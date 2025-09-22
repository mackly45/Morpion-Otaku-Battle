/**
 * Audio Manager for Morpion Otaku Battle
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.soundVolume = 0.7;
        this.musicVolume = 0.5;
        
        this.loadAudioSettings();
        this.initializeSounds();
    }
    
    initializeSounds() {
        // Create simple beep sounds using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds = {
            click: () => this.playBeep(800, 100),
            move: () => this.playBeep(400, 150),
            win: () => this.playVictorySound(),
            hit: () => this.playHitSound(),
            background: () => this.playBackgroundMusic()
        };
    }
    
    playBeep(frequency, duration) {
        if (!this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
    
    playVictorySound() {
        if (!this.soundEnabled) return;
        
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        notes.forEach((note, index) => {
            setTimeout(() => this.playBeep(note, 200), index * 150);
        });
    }
    
    playHitSound() {
        if (!this.soundEnabled) return;
        this.playBeep(200, 300);
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveAudioSettings();
        return this.soundEnabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveAudioSettings();
        return this.musicEnabled;
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioSettings();
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioSettings();
    }
    
    loadAudioSettings() {
        const settings = localStorage.getItem('morpion_audio_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.soundEnabled = parsed.soundEnabled !== false;
            this.musicEnabled = parsed.musicEnabled !== false;
            this.soundVolume = parsed.soundVolume || 0.7;
            this.musicVolume = parsed.musicVolume || 0.5;
        }
    }
    
    saveAudioSettings() {
        localStorage.setItem('morpion_audio_settings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled,
            soundVolume: this.soundVolume,
            musicVolume: this.musicVolume
        }));
    }
    
    playBackgroundMusic() {
        if (!this.musicEnabled) return;
        // Simple background music simulation
        console.log('Playing background music');
    }
    
    stopBackgroundMusic() {
        console.log('Stopping background music');
    }
}