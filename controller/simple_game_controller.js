// Contrôleur de jeu simplifié et fonctionnel pour Vercel
class SimpleGameController {
    constructor() {
        this.localModel = null;
        this.perso1 = '';
        this.perso2 = '';
        this.gameMode = 'pvp';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Prévisualisation des personnages
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
            img.src = '../static/images/' + character + '.jpg';
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

    commencerPartie() {
        this.perso1 = document.getElementById('perso1').value;
        this.perso2 = document.getElementById('perso2').value;
        this.gameMode = document.querySelector('.mode-btn.active').id === 'mode-ai' ? 'ai' : 'pvp';

        if (!this.perso1 || !this.perso2) {
            alert('Veuillez sélectionner deux personnages différents !');
            return;
        }

        if (this.perso1 === this.perso2) {
            alert('Veuillez choisir deux personnages différents !');
            return;
        }

        console.log('Starting game:', this.perso1, 'vs', this.perso2, 'mode:', this.gameMode);
        this.initializeLocalGame();
    }

    initializeLocalGame() {
        // Utiliser toujours le modèle local pour simplifier
        if (!window.LocalGameModel) {
            alert('Erreur: Modèle de jeu local non disponible');
            return;
        }

        this.localModel = new window.LocalGameModel();
        this.localModel.choisir_personnages(this.perso1, this.perso2, this.gameMode);
        
        console.log('Local game initialized:', this.localModel.to_dict());
        this.showGame();
        this.updateUI();
    }

    jouerCoup(ligne, colonne) {
        if (!this.localModel || this.localModel.partie_terminee) return;
        
        // En mode IA, empêcher le joueur de jouer quand c'est le tour de l'IA
        if (this.gameMode === 'ai' && this.localModel.joueur_actuel && 
            this.localModel.joueur2 && this.localModel.joueur_actuel.nom === this.localModel.joueur2.nom) {
            console.log('C\'est le tour de l\'IA');
            return;
        }

        const success = this.localModel.jouer_coup(ligne, colonne);
        if (!success) {
            console.log('Coup invalide');
            return;
        }

        console.log('Move played:', ligne, colonne);
        this.updateUI();

        if (this.localModel.partie_terminee) {
            this.handleGameEnd();
        } else if (this.gameMode === 'ai' && this.localModel.joueur_actuel && 
                   this.localModel.joueur2 && this.localModel.joueur_actuel.nom === this.localModel.joueur2.nom) {
            // Tour de l'IA
            setTimeout(() => this.playAIMove(), 1000);
        }
    }

    playAIMove() {
        if (!this.localModel || this.gameMode !== 'ai' || this.localModel.partie_terminee) return;
        
        const aiMove = this.localModel.jouer_coup_ia();
        if (aiMove) {
            console.log('AI played:', aiMove.ligne, aiMove.colonne);
            this.updateUI();
            
            if (this.localModel.partie_terminee) {
                this.handleGameEnd();
            }
        }
    }

    handleGameEnd() {
        const tourIndicateur = document.getElementById('tour-indicateur');
        if (this.localModel.vainqueur) {
            if (tourIndicateur) {
                tourIndicateur.textContent = this.localModel.vainqueur.nom + ' a gagné !';
            }
        } else {
            if (tourIndicateur) {
                tourIndicateur.textContent = 'Match nul !';
            }
        }
        
        setTimeout(() => {
            this.showEndGame();
        }, 2000);
    }

    updateUI() {
        if (!this.localModel) return;

        // Mettre à jour l'indicateur de tour
        const currentPlayer = document.getElementById('joueur-actuel');
        if (currentPlayer && this.localModel.joueur_actuel) {
            currentPlayer.textContent = this.localModel.joueur_actuel.nom;
        }

        // Mettre à jour la grille
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const ligne = parseInt(cell.dataset.ligne);
            const colonne = parseInt(cell.dataset.colonne);
            const value = this.localModel.grille[ligne][colonne];

            cell.textContent = value ? value.charAt(0).toUpperCase() : '';
            
            // Changer la couleur selon le joueur
            cell.className = 'cell';
            if (value === this.localModel.joueur1.nom) {
                cell.classList.add('joueur1');
            } else if (value === this.localModel.joueur2.nom) {
                cell.classList.add('joueur2');
            }
        });

        // Mettre à jour les noms des joueurs
        const name1 = document.getElementById('name-joueur1');
        const name2 = document.getElementById('name-joueur2');
        if (name1) name1.textContent = this.localModel.joueur1.nom;
        if (name2) name2.textContent = this.localModel.joueur2.nom;

        // Mettre à jour les images
        const img1 = document.getElementById('img-joueur1');
        const img2 = document.getElementById('img-joueur2');
        if (img1) img1.src = '../static/images/' + this.perso1 + '.jpg';
        if (img2) img2.src = '../static/images/' + this.perso2 + '.jpg';
    }

    showGame() {
        document.getElementById('selection-personnages').classList.add('hidden');
        document.getElementById('zone-jeu').classList.remove('hidden');
    }

    showEndGame() {
        document.getElementById('zone-jeu').classList.add('hidden');
        document.getElementById('fin-partie').classList.remove('hidden');
        
        // Mettre à jour l'écran de fin
        const messageFin = document.getElementById('message-fin');
        const nomVainqueur = document.getElementById('nom-vainqueur');
        const imgVainqueur = document.getElementById('img-vainqueur');
        
        if (this.localModel.vainqueur) {
            if (messageFin) messageFin.textContent = 'Victoire !';
            if (nomVainqueur) nomVainqueur.textContent = this.localModel.vainqueur.nom;
            if (imgVainqueur) {
                const winnerCharacter = this.localModel.vainqueur.nom === this.localModel.joueur1.nom ? this.perso1 : this.perso2;
                imgVainqueur.src = '../static/images/' + winnerCharacter + '.jpg';
            }
        } else {
            if (messageFin) messageFin.textContent = 'Match nul !';
            if (nomVainqueur) nomVainqueur.textContent = 'Personne ne gagne';
            if (imgVainqueur) imgVainqueur.src = '';
        }
    }

    resetPartie() {
        if (this.localModel) {
            this.initializeLocalGame();
            document.getElementById('fin-partie').classList.add('hidden');
        }
    }

    retourSelection() {
        document.getElementById('zone-jeu').classList.add('hidden');
        document.getElementById('fin-partie').classList.add('hidden');
        document.getElementById('selection-personnages').classList.remove('hidden');
        
        // Reset selections
        document.getElementById('perso1').value = '';
        document.getElementById('perso2').value = '';
        document.getElementById('preview1').innerHTML = '';
        document.getElementById('preview2').innerHTML = '';
        
        this.localModel = null;
    }
}

// Créer une instance globale
let gameController;

// Fonctions globales pour le HTML
function commencerPartie() {
    if (gameController) {
        gameController.commencerPartie();
    }
}

function jouerCoup(ligne, colonne) {
    if (gameController) {
        gameController.jouerCoup(ligne, colonne);
    }
}

function resetPartie() {
    if (gameController) {
        gameController.resetPartie();
    }
}

function retourSelection() {
    if (gameController) {
        gameController.retourSelection();
    }
}

function selectMode(mode) {
    // Gérer la sélection de mode
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('mode-' + mode).classList.add('active');
    
    const aiDifficultySelection = document.getElementById('ai-difficulty-selection');
    const player2Label = document.getElementById('player2-label');
    
    if (mode === 'ai') {
        aiDifficultySelection.classList.remove('hidden');
        if (player2Label) player2Label.textContent = 'IA (Ordinateur)';
    } else {
        aiDifficultySelection.classList.add('hidden');
        if (player2Label) player2Label.textContent = 'Joueur 2';
    }
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Simple Game Controller...');
    gameController = new SimpleGameController();
});