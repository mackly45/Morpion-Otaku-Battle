/**
 * Game Features Manager - Centralized system for all game features
 */

// 📱 Mobile Optimization Manager
class MobileManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.setupMobileOptimizations();
    }
    
    detectMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupMobileOptimizations() {
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
            this.setupTouchEvents();
            this.adjustMobileUI();
        }
    }
    
    setupTouchEvents() {
        // Prevent zoom on double tap
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) e.preventDefault();
        }, { passive: false });
        
        // Improve touch responsiveness
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('cell')) {
                e.target.click();
            }
        });
    }
    
    adjustMobileUI() {
        const viewport = document.querySelector('meta[name=viewport]') || document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        if (!document.querySelector('meta[name=viewport]')) {
            document.head.appendChild(viewport);
        }
    }
}

// 💾 Save System Manager
class SaveManager {
    constructor() {
        this.playerStats = this.loadPlayerStats();
        this.gameHistory = this.loadGameHistory();
    }
    
    loadPlayerStats() {
        const stats = localStorage.getItem('morpion_player_stats');
        return stats ? JSON.parse(stats) : {
            totalGames: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winStreak: 0,
            bestWinStreak: 0,
            favoriteCharacter: null,
            totalPlayTime: 0
        };
    }
    
    loadGameHistory() {
        const history = localStorage.getItem('morpion_game_history');
        return history ? JSON.parse(history) : [];
    }
    
    saveGame(gameData) {
        // Update stats
        this.playerStats.totalGames++;
        if (gameData.result === 'win') {
            this.playerStats.wins++;
            this.playerStats.winStreak++;
            this.playerStats.bestWinStreak = Math.max(this.playerStats.bestWinStreak, this.playerStats.winStreak);
        } else if (gameData.result === 'lose') {
            this.playerStats.losses++;
            this.playerStats.winStreak = 0;
        } else {
            this.playerStats.draws++;
        }
        
        // Save game to history
        this.gameHistory.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            player1: gameData.player1,
            player2: gameData.player2,
            winner: gameData.winner,
            duration: gameData.duration,
            moves: gameData.moves
        });
        
        // Keep only last 50 games
        if (this.gameHistory.length > 50) {
            this.gameHistory = this.gameHistory.slice(0, 50);
        }
        
        this.saveToStorage();
    }
    
    saveToStorage() {
        localStorage.setItem('morpion_player_stats', JSON.stringify(this.playerStats));
        localStorage.setItem('morpion_game_history', JSON.stringify(this.gameHistory));
    }
    
    getStats() {
        return { ...this.playerStats };
    }
    
    getHistory() {
        return [...this.gameHistory];
    }
}

// ⚙️ Settings Manager
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
    }
    
    loadSettings() {
        const settings = localStorage.getItem('morpion_settings');
        return settings ? JSON.parse(settings) : {
            difficulty: 'medium',
            theme: 'default',
            language: 'fr',
            animations: true,
            autoSave: true,
            combatSpeed: 'normal',
            gridSize: 'normal',
            showTutorial: true
        };
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }
    
    saveSettings() {
        localStorage.setItem('morpion_settings', JSON.stringify(this.settings));
    }
    
    applySettings() {
        document.body.className = `theme-${this.settings.theme}`;
        if (!this.settings.animations) {
            document.body.classList.add('no-animations');
        }
    }
    
    getSettings() {
        return { ...this.settings };
    }
}

// 🏆 Achievements Manager
class AchievementsManager {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.playerAchievements = this.loadPlayerAchievements();
    }
    
    initializeAchievements() {
        return [
            { id: 'first_win', name: 'Première Victoire', description: 'Gagner votre premier combat', icon: '🎉' },
            { id: 'win_streak_5', name: 'Série de 5', description: 'Gagner 5 parties consécutives', icon: '🔥' },
            { id: 'character_master', name: 'Maître des Personnages', description: 'Gagner avec 5 personnages différents', icon: '👑' },
            { id: 'speed_demon', name: 'Démon de la Vitesse', description: 'Gagner en moins de 2 minutes', icon: '⚡' },
            { id: 'perfectionist', name: 'Perfectionniste', description: 'Gagner sans perdre de vie', icon: '💎' },
            { id: 'veteran', name: 'Vétéran', description: 'Jouer 100 parties', icon: '🎖️' }
        ];
    }
    
    loadPlayerAchievements() {
        const achievements = localStorage.getItem('morpion_achievements');
        return achievements ? JSON.parse(achievements) : [];
    }
    
    checkAchievements(gameData, playerStats) {
        const newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (this.playerAchievements.includes(achievement.id)) return;
            
            let earned = false;
            switch (achievement.id) {
                case 'first_win':
                    earned = playerStats.wins >= 1;
                    break;
                case 'win_streak_5':
                    earned = playerStats.winStreak >= 5;
                    break;
                case 'veteran':
                    earned = playerStats.totalGames >= 100;
                    break;
                // Add more achievement logic
            }
            
            if (earned) {
                this.playerAchievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        });
        
        if (newAchievements.length > 0) {
            this.saveAchievements();
            this.showAchievementNotification(newAchievements);
        }
        
        return newAchievements;
    }
    
    saveAchievements() {
        localStorage.setItem('morpion_achievements', JSON.stringify(this.playerAchievements));
    }
    
    showAchievementNotification(achievements) {
        achievements.forEach(achievement => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-content">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div>
                        <div class="achievement-title">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 5000);
        });
    }
}

// 🎯 Tutorial Manager
class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.tutorialActive = false;
        this.tutorialSteps = this.defineTutorialSteps();
    }
    
    defineTutorialSteps() {
        return [
            { target: '#perso1', text: 'Choisissez votre premier personnage', position: 'bottom' },
            { target: '#perso2', text: 'Choisissez votre second personnage', position: 'bottom' },
            { target: '#commencer', text: 'Cliquez pour commencer le combat', position: 'top' },
            { target: '.grille-morpion', text: 'Cliquez sur une case pour jouer', position: 'top' },
            { target: '.health-bar', text: 'Surveillez la vie de vos personnages', position: 'bottom' }
        ];
    }
    
    startTutorial() {
        this.tutorialActive = true;
        this.currentStep = 0;
        this.showTutorialStep();
    }
    
    showTutorialStep() {
        if (this.currentStep >= this.tutorialSteps.length) {
            this.endTutorial();
            return;
        }
        
        const step = this.tutorialSteps[this.currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextStep();
            return;
        }
        
        this.createTutorialOverlay(target, step.text, step.position);
    }
    
    createTutorialOverlay(target, text, position) {
        // Remove existing overlay
        const existing = document.querySelector('.tutorial-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-highlight"></div>
            <div class="tutorial-popup tutorial-${position}">
                <div class="tutorial-text">${text}</div>
                <div class="tutorial-controls">
                    <button onclick="window.tutorialManager.skipTutorial()">Passer</button>
                    <button onclick="window.tutorialManager.nextStep()">Suivant</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Position the highlight
        const rect = target.getBoundingClientRect();
        const highlight = overlay.querySelector('.tutorial-highlight');
        highlight.style.left = rect.left + 'px';
        highlight.style.top = rect.top + 'px';
        highlight.style.width = rect.width + 'px';
        highlight.style.height = rect.height + 'px';
        
        // Position the popup
        const popup = overlay.querySelector('.tutorial-popup');
        if (position === 'bottom') {
            popup.style.left = rect.left + 'px';
            popup.style.top = (rect.bottom + 10) + 'px';
        } else if (position === 'top') {
            popup.style.left = rect.left + 'px';
            popup.style.top = (rect.top - popup.offsetHeight - 10) + 'px';
        }
    }
    
    nextStep() {
        this.currentStep++;
        this.showTutorialStep();
    }
    
    skipTutorial() {
        this.endTutorial();
    }
    
    endTutorial() {
        this.tutorialActive = false;
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) overlay.remove();
        
        // Mark tutorial as completed
        localStorage.setItem('morpion_tutorial_completed', 'true');
    }
    
    shouldShowTutorial() {
        return !localStorage.getItem('morpion_tutorial_completed');
    }
}

// Initialize all managers
window.addEventListener('DOMContentLoaded', () => {
    window.mobileManager = new MobileManager();
    window.saveManager = new SaveManager();
    window.settingsManager = new SettingsManager();
    window.achievementsManager = new AchievementsManager();
    window.tutorialManager = new TutorialManager();
    window.audioManager = new AudioManager();
    
    settingsManager.applySettings();
    
    // Disable auto-tutorial for now - user can start it manually
    // if (tutorialManager.shouldShowTutorial()) {
    //     setTimeout(() => tutorialManager.startTutorial(), 1000);
    // }
});