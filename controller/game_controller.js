// Contrôleur du jeu Morpion Otaku Battle
class GameController {
    constructor() {
        this.model = null;
        this.perso1 = '';
        this.perso2 = '';
        this.gameMode = 'pvp';
        this.aiDifficulty = 'medium';
        this.gameStartTime = null;
        this.moves = [];

        // Configuration des chemins d'images
        this.imagePath = '';

        this.initializeEventListeners();
        this.initializeManagers();
    }
    
    initializeManagers() {
        // Wait for managers to be loaded
        setTimeout(() => {
            if (window.themeManager) {
                this.themeManager = new window.ThemeManager();
            }
            if (window.analyticsManager) {
                this.analyticsManager = new window.AnalyticsManager();
            }
            if (window.replayManager) {
                this.replayManager = new window.ReplayManager();
            }
            if (window.i18nManager) {
                this.i18nManager = new window.I18nManager();
            }
            if (window.multiplayerManager) {
                this.multiplayerManager = new window.MultiplayerManager();
            }
        }, 100);
    }

    initializeEventListeners() {
        // Prévisualisation des personnages lors de la sélection
        document.getElementById('perso1').addEventListener('change', (e) => {
            this.updatePreview('preview1', e.target.value);
        });

        document.getElementById('perso2').addEventListener('change', (e) => {
            this.updatePreview('preview2', e.target.value);
        });
    }

    updatePreview(previewId, character) {
        const preview = document.getElementById(previewId);
        if (character) {
            const img = document.createElement('img');
            img.src = '../' + character + '.jpg';
            img.alt = character;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.onerror = () => {
                preview.innerHTML = '<span style="font-size: 14px; color: #ff6b6b;">Image non trouvée</span>';
            };
            preview.innerHTML = '';
            preview.appendChild(img);
        } else {
            preview.innerHTML = '';
        }
    }

    // Méthodes globales appelées depuis le HTML
    commencerPartie() {
        this.perso1 = document.getElementById('perso1').value;
        this.perso2 = document.getElementById('perso2').value;
        this.gameMode = document.querySelector('.mode-btn.active').id === 'mode-ai' ? 'ai' : 'pvp';
        this.aiDifficulty = document.getElementById('ai-difficulty').value;

        if (!this.perso1 || !this.perso2) {
            alert('Veuillez sélectionner deux personnages différents !');
            return;
        }

        if (this.perso1 === this.perso2) {
            alert('Veuillez choisir deux personnages différents !');
            return;
        }
        
        this.gameStartTime = Date.now();
        this.moves = [];
        
        // Play sound
        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
        
        // Track analytics
        if (this.analyticsManager) {
            this.analyticsManager.trackEvent('game_start', {
                mode: this.gameMode,
                player1: this.perso1,
                player2: this.perso2,
                difficulty: this.aiDifficulty
            });
        }

        // Initialisation du modèle Python via une requête
        this.initializeGame();
    }

    async initializeGame() {
        try {
            console.log('Initializing game with mode:', this.gameMode, 'difficulty:', this.aiDifficulty);
            
            const response = await fetch('/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    perso1: this.perso1,
                    perso2: this.perso2,
                    ai_mode: this.gameMode === 'ai',
                    ai_difficulty: this.aiDifficulty
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            this.model = data;
            console.log('Game initialized:', this.model);

            this.showGame();
            this.updateUI();
            
            // If AI mode and it's AI's turn, make AI move
            if (this.gameMode === 'ai' && this.model.joueur_actuel && 
                this.model.joueur_actuel.nom === this.model.joueur2.nom) {
                console.log('AI turn detected, making AI move...');
                setTimeout(() => this.playAIMove(), 1000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            alert('Erreur lors du démarrage du jeu: ' + error.message);
        }
    }

    async jouerCoup(ligne, colonne) {
        if (!this.model || this.model.partie_terminee) return;
        
        // In AI mode, prevent player from playing when it's AI's turn
        if (this.gameMode === 'ai' && this.model.joueur_actuel && 
            this.model.joueur_actuel.nom === this.model.joueur2.nom) {
            console.log('It\'s AI turn, ignoring player move');
            return;
        }

        try {
            const response = await fetch('/jouer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ligne: ligne,
                    colonne: colonne
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                console.error('Move error:', data.error);
                return;
            }
            
            this.model = data;
            
            // Play move sound
            if (window.audioManager) {
                window.audioManager.playSound('move');
            }

            this.updateUI();

            if (this.model.partie_terminee) {
                if (this.model.gagnant) {
                    // Montrer temporairement qui a gagné le morpion
                    const tourIndicateur = document.getElementById('tour-indicateur');
                    if (tourIndicateur) {
                        tourIndicateur.textContent = this.model.gagnant.nom + ' a gagné le morpion ! Combat en cours...';
                    }
                    
                    // Play victory sound
                    if (window.audioManager) {
                        window.audioManager.playSound('win');
                    }
                    
                    // Attendre un peu avant de montrer l'écran de fin
                    setTimeout(() => {
                        this.showEndGame();
                    }, 2000);
                } else {
                    // Match nul
                    const tourIndicateur = document.getElementById('tour-indicateur');
                    if (tourIndicateur) {
                        tourIndicateur.textContent = 'Match nul ! Personne ne gagne.';
                    }
                    setTimeout(() => {
                        this.showEndGame();
                    }, 2000);
                }
            } else if (this.gameMode === 'ai' && this.model.joueur_actuel && 
                      this.model.joueur_actuel.nom === this.model.joueur2.nom) {
                // Si c'est le tour de l'IA, jouer automatiquement après un délai
                console.log('Player move completed, AI turn next');
                setTimeout(() => this.playAIMove(), 1500);
            }
        } catch (error) {
            console.error('Erreur lors du coup:', error);
            alert('Erreur lors du coup: ' + error.message);
        }
    }

    updateUI() {
        if (!this.model) return;

        // Mise à jour des informations des joueurs
        const img1 = document.getElementById('img-joueur1');
        const img2 = document.getElementById('img-joueur2');
        const name1 = document.getElementById('name-joueur1');
        const name2 = document.getElementById('name-joueur2');
        const health1 = document.getElementById('health-joueur1');
        const health2 = document.getElementById('health-joueur2');
        const currentPlayer = document.getElementById('joueur-actuel');

        // Check if all elements exist before trying to use them
        if (!img1 || !img2 || !name1 || !name2 || !health1 || !health2 || !currentPlayer) {
            console.warn('Some UI elements not found, skipping UI update');
            return;
        }

        // Configuration joueur 1
        img1.src = '../' + this.model.joueur1.image;
        name1.textContent = this.model.joueur1.nom;
        const healthPercent1 = (this.model.joueur1.vie / this.model.joueur1.vie_max * 100);
        health1.style.width = Math.max(0, healthPercent1) + '%';
        
        // Animation de vie critique
        if (healthPercent1 <= 25) {
            health1.classList.add('health-critical');
        } else {
            health1.classList.remove('health-critical');
        }

        // Configuration joueur 2
        img2.src = '../' + this.model.joueur2.image;
        name2.textContent = this.model.joueur2.nom;
        const healthPercent2 = (this.model.joueur2.vie / this.model.joueur2.vie_max * 100);
        health2.style.width = Math.max(0, healthPercent2) + '%';
        
        // Animation de vie critique
        if (healthPercent2 <= 25) {
            health2.classList.add('health-critical');
        } else {
            health2.classList.remove('health-critical');
        }

        // Joueur actuel
        currentPlayer.textContent = this.model.joueur_actuel.nom;

        // Mise à jour de la grille
        this.updateGrid();

        // Mettre à jour les couleurs des cellules selon le joueur
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const ligne = parseInt(cell.dataset.ligne);
            const colonne = parseInt(cell.dataset.colonne);
            const value = this.model.grille[ligne][colonne];

            cell.className = 'cell';
            if (value === this.model.joueur1.nom) {
                cell.classList.add('joueur1');
            } else if (value === this.model.joueur2.nom) {
                cell.classList.add('joueur2');
            }
        });
    }

    updateGrid() {
        if (!this.model) return;

        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const ligne = parseInt(cell.dataset.ligne);
            const colonne = parseInt(cell.dataset.colonne);
            const value = this.model.grille[ligne][colonne];

            cell.textContent = value ? value.charAt(0).toUpperCase() : '';
        });
    }

    showGame() {
        document.getElementById('selection-personnages').classList.add('hidden');
        document.getElementById('zone-jeu').classList.remove('hidden');
    }

    showCharacterSelection() {
        document.getElementById('zone-jeu').classList.add('hidden');
        document.getElementById('fin-partie').classList.add('hidden');
        document.getElementById('selection-personnages').classList.remove('hidden');

        // Reset game state
        this.model = null;
        this.gameMode = 'pvp';
        
        // Reset UI selections
        document.getElementById('perso1').value = '';
        document.getElementById('perso2').value = '';
        document.getElementById('preview1').innerHTML = '';
        document.getElementById('preview2').innerHTML = '';
        
        // Reset mode selection to PvP
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('mode-pvp').classList.add('active');
        document.getElementById('ai-difficulty-selection').classList.add('hidden');
        document.getElementById('player2-label').textContent = 'Joueur 2';
        
        // Play sound
        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
    }

    async resetPartie() {
        if (!this.model) {
            // If no model exists, return to character selection
            this.showCharacterSelection();
            return;
        }

        try {
            const response = await fetch('/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            this.model = data;

            // Hide end game screen and show game area
            document.getElementById('fin-partie').classList.add('hidden');
            document.getElementById('zone-jeu').classList.remove('hidden');
            
            // Wait a bit before updating UI to ensure DOM is ready
            setTimeout(() => {
                this.updateUI();
                
                // If AI mode and it's AI's turn, make AI move
                if (this.gameMode === 'ai' && this.model.joueur_actuel && 
                    this.model.joueur_actuel.nom === this.model.joueur2.nom) {
                    setTimeout(() => this.playAIMove(), 1000);
                }
            }, 100);
            
            // Play sound
            if (window.audioManager) {
                window.audioManager.playSound('click');
            }
            
        } catch (error) {
            console.error('Erreur lors du reset:', error);
            alert('Erreur lors de la remise à zéro: ' + error.message);
        }
    }
    
    async playAIMove() {
        if (!this.model || this.gameMode !== 'ai' || this.model.partie_terminee) return;
        
        // Check if it's actually the AI's turn (Player 2)
        if (!this.model.joueur_actuel || this.model.joueur_actuel.nom !== this.model.joueur2.nom) {
            return;
        }
        
        console.log('AI is making a move...');
        
        try {
            const response = await fetch('/ai-move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error('Erreur IA:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            if (data.error) {
                console.error('Erreur IA:', data.error);
                return;
            }
            
            this.model = data;
            this.updateUI();
            
            // Play sound for AI move
            if (window.audioManager) {
                window.audioManager.playSound('move');
            }

            if (this.model.partie_terminee) {
                setTimeout(() => {
                    this.showEndGame();
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors du coup IA:', error);
        }
    }

    showEndGame() {
        const messageFin = document.getElementById('message-fin');
        const imgVainqueur = document.getElementById('img-vainqueur');
        const nomVainqueur = document.getElementById('nom-vainqueur');

        // Check if elements exist
        if (!messageFin || !imgVainqueur || !nomVainqueur) {
            console.warn('End game elements not found');
            return;
        }

        if (this.model && this.model.gagnant) {
            if (this.model.gagnant.nom === this.model.joueur1.nom) {
                messageFin.textContent = 'Victoire de ' + this.model.joueur1.nom + ' !';
            } else {
                messageFin.textContent = 'Victoire de ' + this.model.joueur2.nom + ' !';
            }

            imgVainqueur.src = '../' + this.model.gagnant.image;
            nomVainqueur.textContent = this.model.gagnant.nom;
            imgVainqueur.style.display = 'block';
        } else {
            messageFin.textContent = 'Match nul !';
            imgVainqueur.style.display = 'none';
            nomVainqueur.textContent = 'Personne ne gagne';
        }

        document.getElementById('zone-jeu').classList.add('hidden');
        document.getElementById('fin-partie').classList.remove('hidden');
    }
}

// Initialisation du contrôleur
const gameController = new GameController();

// Fonctions globales pour l'HTML
function commencerPartie() {
    gameController.commencerPartie();
}

function jouerCoup(ligne, colonne) {
    gameController.jouerCoup(ligne, colonne);
}

function resetPartie() {
    gameController.resetPartie();
}

function retourSelection() {
    gameController.showCharacterSelection();
}

// New functions for features
function selectMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    const aiDifficulty = document.getElementById('ai-difficulty-selection');
    const player2Label = document.getElementById('player2-label');
    
    if (mode === 'ai') {
        aiDifficulty.classList.remove('hidden');
        player2Label.textContent = 'IA';
    } else {
        aiDifficulty.classList.add('hidden');
        player2Label.textContent = 'Joueur 2';
    }
}

function showSettings() {
    document.getElementById('settings-panel').classList.remove('hidden');
    if (window.audioManager) window.audioManager.playSound('click');
}

function closeSettings() {
    document.getElementById('settings-panel').classList.add('hidden');
    if (window.audioManager) window.audioManager.playSound('click');
}

function showStats() {
    const panel = document.getElementById('stats-panel');
    panel.classList.remove('hidden');
    
    if (window.saveManager) {
        const stats = window.saveManager.getStats();
        document.getElementById('total-games').textContent = stats.totalGames;
        document.getElementById('win-rate').textContent = 
            stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) + '%' : '0%';
        document.getElementById('win-streak').textContent = stats.winStreak;
    }
    
    if (window.audioManager) window.audioManager.playSound('click');
}

function closeStats() {
    document.getElementById('stats-panel').classList.add('hidden');
    if (window.audioManager) window.audioManager.playSound('click');
}

function showAchievements() {
    // Create achievements panel if not exists
    let achievementsPanel = document.getElementById('achievements-panel');
    if (!achievementsPanel) {
        achievementsPanel = document.createElement('div');
        achievementsPanel.id = 'achievements-panel';
        achievementsPanel.className = 'settings-panel hidden';
        achievementsPanel.innerHTML = `
            <h3>🏆 Succès</h3>
            <div id="achievements-list" class="achievements-grid">
                <div class="achievement-item">
                    <span class="achievement-icon">🎉</span>
                    <div class="achievement-info">
                        <div class="achievement-name">Première Victoire</div>
                        <div class="achievement-desc">Gagner votre premier combat</div>
                    </div>
                    <div class="achievement-status unlocked">✓</div>
                </div>
                <div class="achievement-item">
                    <span class="achievement-icon">🔥</span>
                    <div class="achievement-info">
                        <div class="achievement-name">Série de 5</div>
                        <div class="achievement-desc">Gagner 5 parties consécutives</div>
                    </div>
                    <div class="achievement-status locked">🔒</div>
                </div>
                <div class="achievement-item">
                    <span class="achievement-icon">👑</span>
                    <div class="achievement-info">
                        <div class="achievement-name">Maître des Personnages</div>
                        <div class="achievement-desc">Gagner avec 5 personnages différents</div>
                    </div>
                    <div class="achievement-status locked">🔒</div>
                </div>
            </div>
            <button onclick="closeAchievements()">Fermer</button>
        `;
        document.body.appendChild(achievementsPanel);
    }
    
    achievementsPanel.classList.remove('hidden');
    if (window.audioManager) window.audioManager.playSound('click');
}

function closeAchievements() {
    const panel = document.getElementById('achievements-panel');
    if (panel) panel.classList.add('hidden');
    if (window.audioManager) window.audioManager.playSound('click');
}

function toggleMultiplayer() {
    // To be implemented with multiplayer interface
    alert('Mode multijoueur - En développement!');
    if (window.audioManager) window.audioManager.playSound('click');
}

function startTutorial() {
    if (window.tutorialManager) {
        window.tutorialManager.startTutorial();
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

// Missing feature functions
function togglePhotoMode() {
    if (window.visualEffectsManager && window.visualEffectsManager.photoMode) {
        window.visualEffectsManager.photoMode.toggle();
    } else {
        alert('📸 Mode Photo - En développement!');
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

function enableAdvancedShaders() {
    if (window.visualEffectsManager) {
        window.visualEffectsManager.enableAdvancedShaders();
        alert('🌈 Shaders avancés activés!');
    } else {
        alert('🌈 Shaders Avancés - En développement!');
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

function enableTeamMode() {
    alert('👥 Mode Équipe - En développement!');
    if (window.audioManager) window.audioManager.playSound('click');
}

function enableMLAI() {
    if (window.advancedAIManager) {
        window.advancedAIManager.enableMLMode();
        alert('🤖 IA ML activée!');
    } else {
        alert('🤖 IA ML - En développement!');
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

function enablePrediction() {
    if (window.advancedAIManager) {
        window.advancedAIManager.enablePrediction();
        alert('🧩 Prédiction activée!');
    } else {
        alert('🧩 Prédiction - En développement!');
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

function openSkinsManager() {
    if (window.skinsManager && window.skinsManager.openSkinSelector) {
        window.skinsManager.openSkinSelector();
    } else {
        alert('🎭 Skins - En développement!');
    }
    if (window.audioManager) window.audioManager.playSound('click');
}

// Settings event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        // Load saved theme
        const savedTheme = localStorage.getItem('morpion_theme') || 'default';
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
        
        themeSelect.addEventListener('change', (e) => {
            console.log('Theme changed to:', e.target.value);
            applyTheme(e.target.value);
            localStorage.setItem('morpion_theme', e.target.value);
            if (window.audioManager) window.audioManager.playSound('click');
        });
    } else {
        console.warn('Theme select element not found');
    }
    
    // Language selector
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        const savedLang = localStorage.getItem('morpion_language') || 'fr';
        langSelect.value = savedLang;
        
        langSelect.addEventListener('change', (e) => {
            localStorage.setItem('morpion_language', e.target.value);
            updateLanguage(e.target.value);
            if (window.audioManager) window.audioManager.playSound('click');
        });
    }
    
    // Sound toggle
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
        const soundEnabled = localStorage.getItem('morpion_sound_enabled') !== 'false';
        soundToggle.textContent = soundEnabled ? 'ON' : 'OFF';
        soundToggle.classList.toggle('off', !soundEnabled);
        
        soundToggle.addEventListener('click', () => {
            const currentState = soundToggle.textContent === 'ON';
            const newState = !currentState;
            soundToggle.textContent = newState ? 'ON' : 'OFF';
            soundToggle.classList.toggle('off', !newState);
            localStorage.setItem('morpion_sound_enabled', newState.toString());
            
            // Update audio manager
            if (window.audioManager) {
                window.audioManager.soundEnabled = newState;
                window.audioManager.playSound('click');
            }
        });
    }
    
    // Music toggle
    const musicToggle = document.getElementById('toggle-music');
    if (musicToggle) {
        const musicEnabled = localStorage.getItem('morpion_music_enabled') !== 'false';
        musicToggle.textContent = musicEnabled ? 'ON' : 'OFF';
        musicToggle.classList.toggle('off', !musicEnabled);
        
        musicToggle.addEventListener('click', () => {
            const currentState = musicToggle.textContent === 'ON';
            const newState = !currentState;
            musicToggle.textContent = newState ? 'ON' : 'OFF';
            musicToggle.classList.toggle('off', !newState);
            localStorage.setItem('morpion_music_enabled', newState.toString());
            
            // Update audio manager
            if (window.audioManager) {
                window.audioManager.musicEnabled = newState;
                if (newState) {
                    window.audioManager.playBackgroundMusic();
                } else {
                    window.audioManager.stopBackgroundMusic();
                }
                window.audioManager.playSound('click');
            }
        });
    }
});

function applyTheme(themeName) {
    console.log('Applying theme:', themeName);
    
    // Remove existing theme classes
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-ocean', 'theme-fire', 'theme-nature');
    
    // Apply new theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Apply theme colors
    const themes = {
        'default': { primary: '#667eea', secondary: '#764ba2', accent: '#ff6b6b' },
        'dark': { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' },
        'ocean': { primary: '#3498db', secondary: '#2980b9', accent: '#1abc9c' },
        'fire': { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' },
        'nature': { primary: '#27ae60', secondary: '#229954', accent: '#2ecc71' }
    };
    
    if (themes[themeName]) {
        const theme = themes[themeName];
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        
        console.log('Theme applied successfully:', theme);
    } else {
        console.warn('Unknown theme:', themeName);
    }
}

function updateLanguage(lang) {
    const translations = {
        'fr': {
            'game_title': 'Morpion Otaku Battle',
            'choose_characters': 'Choisissez vos personnages',
            'start_battle': 'Commencer le combat !'
        },
        'en': {
            'game_title': 'Tic Tac Toe Otaku Battle',
            'choose_characters': 'Choose your characters',
            'start_battle': 'Start the battle!'
        },
        'es': {
            'game_title': 'Tres en Raya Otaku Battle',
            'choose_characters': 'Elige tus personajes',
            'start_battle': '¡Comenzar la batalla!'
        }
    };
    
    const texts = translations[lang] || translations['fr'];
    
    // Update key elements
    const title = document.querySelector('h1');
    if (title) title.textContent = texts.game_title;
    
    const chooseChars = document.querySelector('h2');
    if (chooseChars) chooseChars.textContent = texts.choose_characters;
    
    const startBtn = document.getElementById('commencer');
    if (startBtn) startBtn.textContent = texts.start_battle;
}