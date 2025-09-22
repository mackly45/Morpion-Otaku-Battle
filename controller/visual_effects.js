/**
 * Advanced Visual Effects System
 * WebGL shaders, lighting effects, and photo mode
 */

class VisualEffectsManager {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.shaderPrograms = {};
        this.activeEffects = new Map();
        this.lightingSystem = new LightingSystem();
        this.photoMode = new PhotoMode();
        
        this.initializeWebGL();
        this.createShaders();
    }
    
    initializeWebGL() {
        // Create WebGL canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'effects-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '100';
        
        document.body.appendChild(this.canvas);
        
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to CSS effects');
            this.useWebGL = false;
            return;
        }
        
        this.useWebGL = true;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    createShaders() {
        if (!this.useWebGL) return;
        
        // Energy wave shader
        this.shaderPrograms.energyWave = this.createShaderProgram(
            this.getVertexShader(),
            this.getEnergyWaveFragmentShader()
        );
        
        // Lightning shader
        this.shaderPrograms.lightning = this.createShaderProgram(
            this.getVertexShader(),
            this.getLightningFragmentShader()
        );
        
        // Particle system shader
        this.shaderPrograms.particles = this.createShaderProgram(
            this.getParticleVertexShader(),
            this.getParticleFragmentShader()
        );
    }
    
    getVertexShader() {
        return `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
    }
    
    getEnergyWaveFragmentShader() {
        return `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform float u_time;
            uniform vec3 u_color;
            uniform float u_intensity;
            
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(v_texCoord, center);
                
                float wave = sin(dist * 20.0 - u_time * 5.0) * 0.5 + 0.5;
                float pulse = 1.0 - smoothstep(0.0, 0.5, dist);
                
                float alpha = wave * pulse * u_intensity;
                gl_FragColor = vec4(u_color, alpha);
            }
        `;
    }
    
    getLightningFragmentShader() {
        return `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform float u_time;
            uniform vec2 u_resolution;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 st = v_texCoord;
                float noise = random(st + u_time);
                
                float lightning = step(0.98, noise);
                vec3 color = vec3(0.8, 0.9, 1.0) * lightning;
                
                gl_FragColor = vec4(color, lightning * 0.8);
            }
        `;
    }
    
    getParticleVertexShader() {
        return `
            attribute vec2 a_position;
            attribute float a_size;
            attribute vec3 a_color;
            attribute float a_alpha;
            
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                gl_PointSize = a_size;
                v_color = a_color;
                v_alpha = a_alpha;
            }
        `;
    }
    
    getParticleFragmentShader() {
        return `
            precision mediump float;
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                gl_FragColor = vec4(v_color, alpha * v_alpha);
            }
        `;
    }
    
    createShaderProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program failed to link');
            return null;
        }
        
        return program;
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    // CSS fallback effects
    createCSSEffect(type, element, options = {}) {
        if (this.useWebGL) return;
        
        switch (type) {
            case 'energy_blast':
                this.createEnergyBlastCSS(element, options);
                break;
            case 'lightning':
                this.createLightningCSS(element, options);
                break;
            case 'particles':
                this.createParticlesCSS(element, options);
                break;
        }
    }
    
    createEnergyBlastCSS(element, options) {
        const effect = document.createElement('div');
        effect.className = 'energy-blast-effect';
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            margin: -100px 0 0 -100px;
            border-radius: 50%;
            background: radial-gradient(circle, ${options.color || '#00ffff'} 0%, transparent 70%);
            animation: energyBlast 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }
    
    createLightningCSS(element, options) {
        const lightning = document.createElement('div');
        lightning.className = 'lightning-effect';
        lightning.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 40%, #ffffff 50%, transparent 60%);
            animation: lightning 0.3s ease-in-out;
            pointer-events: none;
            z-index: 999;
        `;
        
        element.appendChild(lightning);
        setTimeout(() => lightning.remove(), 300);
    }
    
    playSpecialAttackEffect(attackName, element) {
        const effects = {
            'Anti-Magic Sword': () => this.createSlashWaveEffect(element),
            'Detroit Smash': () => this.createLightningPunchEffect(element),
            'Hollow Purple': () => this.createVoidSphereEffect(element),
            'Kamehameha': () => this.createBeamAttackEffect(element),
            'Getsuga Tensho': () => this.createCrescentWaveEffect(element),
            'Kaiju Transformation': () => this.createTransformationEffect(element),
            'Gear Fourth': () => this.createElasticBarrageEffect(element),
            'Rasengan': () => this.createSpiralSphereEffect(element),
            'Serious Punch': () => this.createSeriousPunchEffect(element)
        };
        
        if (effects[attackName]) {
            effects[attackName]();
        }
    }
    
    createSlashWaveEffect(element) {
        this.createCSSEffect('energy_blast', element, { color: '#ff6b6b' });
    }
    
    createLightningPunchEffect(element) {
        this.createCSSEffect('lightning', element);
        this.createCSSEffect('energy_blast', element, { color: '#00ff00' });
    }
    
    createVoidSphereEffect(element) {
        this.createCSSEffect('energy_blast', element, { color: '#9400d3' });
    }
    
    createBeamAttackEffect(element) {
        const beam = document.createElement('div');
        beam.className = 'beam-effect';
        beam.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 20px;
            margin-top: -10px;
            background: linear-gradient(90deg, #00ffff, #ffffff, #00ffff);
            animation: beam 1.5s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.appendChild(beam);
        setTimeout(() => beam.remove(), 1500);
    }
    
    createSeriousPunchEffect(element) {
        // Screen shake
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        setTimeout(() => document.body.style.animation = '', 500);
        
        // Massive energy blast
        this.createCSSEffect('energy_blast', element, { color: '#ffd700' });
        this.createCSSEffect('lightning', element);
    }
}

class LightingSystem {
    constructor() {
        this.lights = [];
        this.ambientColor = [0.3, 0.3, 0.4];
        this.dynamicLighting = true;
    }
    
    addLight(type, position, color, intensity) {
        const light = {
            id: Date.now() + Math.random(),
            type, // 'point', 'directional', 'spot'
            position,
            color,
            intensity,
            active: true
        };
        
        this.lights.push(light);
        this.updateLighting();
        
        return light.id;
    }
    
    removeLight(lightId) {
        this.lights = this.lights.filter(light => light.id !== lightId);
        this.updateLighting();
    }
    
    updateLighting() {
        if (!this.dynamicLighting) return;
        
        // Update CSS custom properties for lighting
        const totalIntensity = this.lights.reduce((sum, light) => sum + light.intensity, 0);
        const avgColor = this.calculateAverageColor();
        
        document.documentElement.style.setProperty('--dynamic-light-intensity', totalIntensity);
        document.documentElement.style.setProperty('--dynamic-light-color', 
            `rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`);
    }
    
    calculateAverageColor() {
        if (this.lights.length === 0) return this.ambientColor;
        
        const totalColor = this.lights.reduce((sum, light) => [
            sum[0] + light.color[0] * light.intensity,
            sum[1] + light.color[1] * light.intensity,
            sum[2] + light.color[2] * light.intensity
        ], [0, 0, 0]);
        
        const totalIntensity = this.lights.reduce((sum, light) => sum + light.intensity, 0);
        
        return totalIntensity > 0 ? 
            totalColor.map(c => Math.min(255, c / totalIntensity)) : 
            this.ambientColor;
    }
    
    createBattleAmbiance(character1, character2) {
        // Character-specific lighting
        const char1Light = this.getCharacterLight(character1);
        const char2Light = this.getCharacterLight(character2);
        
        this.addLight('point', [-0.5, 0, 1], char1Light.color, 0.7);
        this.addLight('point', [0.5, 0, 1], char2Light.color, 0.7);
    }
    
    getCharacterLight(characterName) {
        const characterLights = {
            'asta': { color: [100, 255, 100] }, // Green
            'deku': { color: [100, 255, 100] }, // Green
            'gojo': { color: [148, 0, 211] },   // Purple
            'goku': { color: [255, 165, 0] },  // Orange
            'ichigo': { color: [255, 100, 100] }, // Red
            'kaijuu': { color: [255, 255, 100] }, // Yellow
            'luffy': { color: [255, 100, 100] },  // Red
            'naruto': { color: [255, 165, 0] },   // Orange
            'saitama': { color: [255, 255, 255] } // White
        };
        
        return characterLights[characterName] || { color: [255, 255, 255] };
    }
}

class PhotoMode {
    constructor() {
        this.active = false;
        this.filters = {
            'normal': '',
            'epic': 'contrast(1.2) saturate(1.3) brightness(1.1)',
            'dramatic': 'contrast(1.5) saturate(0.8) sepia(0.2)',
            'vintage': 'sepia(0.5) contrast(1.1) brightness(0.9)',
            'neon': 'saturate(2) hue-rotate(90deg) contrast(1.3)'
        };
        this.currentFilter = 'normal';
    }
    
    activate() {
        this.active = true;
        this.createPhotoInterface();
        document.body.classList.add('photo-mode');
    }
    
    deactivate() {
        this.active = false;
        this.removePhotoInterface();
        document.body.classList.remove('photo-mode');
    }
    
    createPhotoInterface() {
        const photoUI = document.createElement('div');
        photoUI.id = 'photo-mode-ui';
        photoUI.innerHTML = `
            <div class="photo-controls">
                <button onclick="photoMode.captureScreenshot()">📸 Capturer</button>
                <select onchange="photoMode.applyFilter(this.value)">
                    <option value="normal">Normal</option>
                    <option value="epic">Épique</option>
                    <option value="dramatic">Dramatique</option>
                    <option value="vintage">Vintage</option>
                    <option value="neon">Néon</option>
                </select>
                <button onclick="photoMode.deactivate()">✖ Fermer</button>
            </div>
        `;
        
        document.body.appendChild(photoUI);
    }
    
    removePhotoInterface() {
        const photoUI = document.getElementById('photo-mode-ui');
        if (photoUI) photoUI.remove();
    }
    
    applyFilter(filterName) {
        this.currentFilter = filterName;
        document.body.style.filter = this.filters[filterName];
    }
    
    captureScreenshot() {
        // Use html2canvas library if available, otherwise fall back to basic method
        if (typeof html2canvas !== 'undefined') {
            html2canvas(document.body).then(canvas => {
                this.downloadImage(canvas);
            });
        } else {
            // Fallback method
            this.captureBasicScreenshot();
        }
    }
    
    captureBasicScreenshot() {
        // Create a canvas with game content
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Fill with background
        ctx.fillStyle = '#667eea';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text overlay
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Morpion Otaku Battle', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Screenshot captured!', canvas.width / 2, canvas.height / 2 + 60);
        
        this.downloadImage(canvas);
    }
    
    downloadImage(canvas) {
        const link = document.createElement('a');
        link.download = `morpion-battle-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
}

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes energyBlast {
        0% { transform: scale(0.1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes lightning {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    @keyframes beam {
        0% { transform: scaleX(0); opacity: 1; }
        100% { transform: scaleX(1); opacity: 0; }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .photo-mode {
        position: relative;
    }
    
    #photo-mode-ui {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
        z-index: 2000;
    }
    
    .photo-controls {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .photo-controls button, .photo-controls select {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        background: #ff6b6b;
        color: white;
        cursor: pointer;
    }
`;
document.head.appendChild(styleSheet);

// Initialize global instances
window.visualEffectsManager = new VisualEffectsManager();
window.photoMode = window.visualEffectsManager.photoMode;