/**
 * Advanced Features - Themes, Analytics, Replay, i18n, Multiplayer
 */

// 🎨 Theme Manager
class ThemeManager {
    constructor() {
        this.themes = {
            default: { name: 'Classique', colors: { primary: '#667eea', secondary: '#764ba2' } },
            dark: { name: 'Sombre', colors: { primary: '#2c3e50', secondary: '#34495e' } },
            ocean: { name: 'Océan', colors: { primary: '#3498db', secondary: '#2980b9' } },
            fire: { name: 'Feu', colors: { primary: '#e74c3c', secondary: '#c0392b' } },
            nature: { name: 'Nature', colors: { primary: '#27ae60', secondary: '#229954' } }
        };
        this.currentTheme = 'default';
    }
    
    applyTheme(themeName) {
        if (!this.themes[themeName]) return;
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
        document.body.className = `theme-${themeName}`;
        localStorage.setItem('morpion_theme', themeName);
    }
    
    getThemes() { return this.themes; }
}

// 📊 Analytics Manager
class AnalyticsManager {
    constructor() {
        this.sessionData = { startTime: Date.now(), events: [] };
        this.analytics = this.loadAnalytics();
    }
    
    loadAnalytics() {
        const data = localStorage.getItem('morpion_analytics');
        return data ? JSON.parse(data) : {
            totalSessions: 0,
            totalPlayTime: 0,
            characterUsage: {},
            winRates: {},
            averageGameDuration: 0
        };
    }
    
    trackEvent(event, data = {}) {
        this.sessionData.events.push({ type: event, timestamp: Date.now(), data });
        this.analytics.totalSessions++;
        this.saveAnalytics();
    }
    
    saveAnalytics() {
        localStorage.setItem('morpion_analytics', JSON.stringify(this.analytics));
    }
    
    getAnalytics() { return { ...this.analytics }; }
}

// 🔄 Replay Manager
class ReplayManager {
    constructor() {
        this.currentReplay = null;
        this.replays = this.loadReplays();
    }
    
    loadReplays() {
        const replays = localStorage.getItem('morpion_replays');
        return replays ? JSON.parse(replays) : [];
    }
    
    saveReplay(gameData) {
        const replay = {
            id: Date.now(),
            date: new Date().toISOString(),
            players: [gameData.player1, gameData.player2],
            moves: gameData.moves,
            winner: gameData.winner,
            duration: gameData.duration
        };
        
        this.replays.unshift(replay);
        if (this.replays.length > 20) this.replays = this.replays.slice(0, 20);
        localStorage.setItem('morpion_replays', JSON.stringify(this.replays));
    }
    
    playReplay(replayId) {
        const replay = this.replays.find(r => r.id === replayId);
        if (!replay) return false;
        
        this.currentReplay = replay;
        this.replayStep = 0;
        return true;
    }
    
    getReplays() { return [...this.replays]; }
}

// 🌍 Internationalization Manager
class I18nManager {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {
            fr: {
                'choose_characters': 'Choisissez vos personnages',
                'player_1': 'Joueur 1',
                'player_2': 'Joueur 2',
                'start_battle': 'Commencer le combat !',
                'game_over': 'Fin de partie',
                'victory': 'Victoire de',
                'new_game': 'Nouvelle partie',
                'settings': 'Paramètres'
            },
            en: {
                'choose_characters': 'Choose your characters',
                'player_1': 'Player 1',
                'player_2': 'Player 2',
                'start_battle': 'Start the battle!',
                'game_over': 'Game Over',
                'victory': 'Victory of',
                'new_game': 'New game',
                'settings': 'Settings'
            },
            es: {
                'choose_characters': 'Elige tus personajes',
                'player_1': 'Jugador 1',
                'player_2': 'Jugador 2',
                'start_battle': '¡Comenzar la batalla!',
                'game_over': 'Fin del juego',
                'victory': 'Victoria de',
                'new_game': 'Nuevo juego',
                'settings': 'Configuración'
            }
        };
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        this.updatePageTexts();
        localStorage.setItem('morpion_language', lang);
    }
    
    translate(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updatePageTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
    }
}

// 🌐 Multiplayer Manager (Basic WebSocket)
class MultiplayerManager {
    constructor() {
        this.socket = null;
        this.isHost = false;
        this.gameRoom = null;
        this.connected = false;
    }
    
    connect(serverUrl = 'ws://localhost:8080') {
        try {
            this.socket = new WebSocket(serverUrl);
            
            this.socket.onopen = () => {
                this.connected = true;
                this.onConnectionChange(true);
            };
            
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            };
            
            this.socket.onclose = () => {
                this.connected = false;
                this.onConnectionChange(false);
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to connect to multiplayer server:', error);
        }
    }
    
    createRoom() {
        if (!this.connected) return;
        this.isHost = true;
        this.send({ type: 'create_room' });
    }
    
    joinRoom(roomId) {
        if (!this.connected) return;
        this.send({ type: 'join_room', roomId });
    }
    
    sendMove(move) {
        if (!this.connected || !this.gameRoom) return;
        this.send({ type: 'game_move', move, roomId: this.gameRoom });
    }
    
    send(data) {
        if (this.socket && this.connected) {
            this.socket.send(JSON.stringify(data));
        }
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'room_created':
                this.gameRoom = data.roomId;
                this.onRoomCreated(data.roomId);
                break;
            case 'room_joined':
                this.gameRoom = data.roomId;
                this.onRoomJoined(data.roomId);
                break;
            case 'player_move':
                this.onPlayerMove(data.move);
                break;
            case 'game_start':
                this.onGameStart(data.gameData);
                break;
        }
    }
    
    onConnectionChange(connected) {
        // Override in main controller
    }
    
    onRoomCreated(roomId) {
        // Override in main controller
    }
    
    onRoomJoined(roomId) {
        // Override in main controller
    }
    
    onPlayerMove(move) {
        // Override in main controller
    }
    
    onGameStart(gameData) {
        // Override in main controller
    }
}

// Export managers for global access
window.ThemeManager = ThemeManager;
window.AnalyticsManager = AnalyticsManager;
window.ReplayManager = ReplayManager;
window.I18nManager = I18nManager;
window.MultiplayerManager = MultiplayerManager;