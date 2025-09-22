/**
 * Advanced AI System with Machine Learning and Adaptation
 * Includes adaptive AI, team coordination, prediction, and recommendations
 */

class AdvancedAISystem {
    constructor() {
        this.playerProfile = this.loadPlayerProfile();
        this.gameHistory = [];
        this.neuralNetwork = new SimpleNeuralNetwork();
        this.adaptiveWeights = {
            aggression: 0.5,
            defense: 0.5,
            risk_taking: 0.5,
            pattern_recognition: 0.5
        };
        
        this.teamAI = new TeamAICoordinator();
        this.movePrediction = new MovePredictionEngine();
        this.recommendationSystem = new RecommendationEngine();
    }
    
    loadPlayerProfile() {
        const profile = localStorage.getItem('morpion_player_profile');
        return profile ? JSON.parse(profile) : {
            averageThinkingTime: 5000,
            preferredOpenings: {},
            defensivePatterns: {},
            aggressivePatterns: {},
            mistakePatterns: {},
            favoriteCharacters: {},
            playstyle: 'balanced', // aggressive, defensive, balanced
            adaptationLevel: 1
        };
    }
    
    savePlayerProfile() {
        localStorage.setItem('morpion_player_profile', JSON.stringify(this.playerProfile));
    }
    
    analyzePlayerMove(move, gameState, thinkingTime) {
        // Record move for analysis
        const moveData = {
            position: [move.ligne, move.colonne],
            thinkingTime,
            gameState: JSON.parse(JSON.stringify(gameState)),
            timestamp: Date.now()
        };
        
        this.gameHistory.push(moveData);
        
        // Analyze patterns
        this.analyzePlaystyle(moveData);
        this.updatePlayerProfile(moveData);
        
        // Train neural network
        this.trainOnMove(moveData);
    }
    
    analyzePlaystyle(moveData) {
        const { position, thinkingTime, gameState } = moveData;
        
        // Analyze aggression (center vs corners vs edges)
        const isCenter = position[0] === 1 && position[1] === 1;
        const isCorner = (position[0] % 2 === 0) && (position[1] % 2 === 0);
        
        if (isCenter) {
            this.adaptiveWeights.aggression += 0.1;
        } else if (isCorner) {
            this.adaptiveWeights.defense += 0.1;
        }
        
        // Analyze thinking time
        if (thinkingTime < 2000) {
            this.adaptiveWeights.risk_taking += 0.05;
        } else if (thinkingTime > 8000) {
            this.adaptiveWeights.defense += 0.05;
        }
        
        // Normalize weights
        const total = Object.values(this.adaptiveWeights).reduce((a, b) => a + b, 0);
        Object.keys(this.adaptiveWeights).forEach(key => {
            this.adaptiveWeights[key] /= total;
        });
    }
    
    updatePlayerProfile(moveData) {
        // Update average thinking time
        const historyLength = this.gameHistory.length;
        this.playerProfile.averageThinkingTime = 
            (this.playerProfile.averageThinkingTime * (historyLength - 1) + moveData.thinkingTime) / historyLength;
        
        // Update playstyle
        if (this.adaptiveWeights.aggression > 0.4) {
            this.playerProfile.playstyle = 'aggressive';
        } else if (this.adaptiveWeights.defense > 0.4) {
            this.playerProfile.playstyle = 'defensive';
        } else {
            this.playerProfile.playstyle = 'balanced';
        }
        
        this.savePlayerProfile();
    }
    
    getAdaptiveMove(grille, joueurNom, difficulty = 'adaptive') {
        // Use neural network to predict best move
        const boardState = this.encodeBoard(grille);
        const playerStyle = this.encodePlayerStyle();
        
        const input = [...boardState, ...playerStyle];
        const output = this.neuralNetwork.forward(input);
        
        // Convert output to move
        const availableMoves = this.getAvailableMoves(grille);
        const moveScores = availableMoves.map((move, index) => ({
            move,
            score: output[index] || 0
        }));
        
        // Sort by score and add some randomness based on adaptation level
        moveScores.sort((a, b) => b.score - a.score);
        
        // Apply adaptation randomness
        const adaptationRandomness = Math.max(0, 1 - this.playerProfile.adaptationLevel / 10);
        const randomIndex = Math.floor(Math.random() * Math.min(3, moveScores.length) * (1 + adaptationRandomness));
        
        return moveScores[randomIndex]?.move || availableMoves[0];
    }
    
    encodeBoard(grille) {
        // Convert 3x3 board to flat array with encoded values
        const encoded = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grille[i][j] === '') {
                    encoded.push(0);
                } else {
                    // Encode based on current player vs opponent
                    encoded.push(grille[i][j] === 'current' ? 1 : -1);
                }
            }
        }
        return encoded;
    }
    
    encodePlayerStyle() {
        return [
            this.adaptiveWeights.aggression,
            this.adaptiveWeights.defense,
            this.adaptiveWeights.risk_taking,
            this.adaptiveWeights.pattern_recognition,
            this.playerProfile.averageThinkingTime / 10000, // Normalize
            this.playerProfile.adaptationLevel / 10
        ];
    }
    
    getAvailableMoves(grille) {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grille[i][j] === '') {
                    moves.push({ ligne: i, colonne: j });
                }
            }
        }
        return moves;
    }
    
    trainOnMove(moveData) {
        // Simple training based on game outcome
        // This would be enhanced with actual game results
        const input = [...this.encodeBoard(moveData.gameState.grille), ...this.encodePlayerStyle()];
        
        // For now, assume good moves (this would be replaced with actual outcome)
        const target = new Array(9).fill(0);
        const moveIndex = moveData.position[0] * 3 + moveData.position[1];
        target[moveIndex] = 1;
        
        this.neuralNetwork.train(input, target, 0.01);
    }
}

class SimpleNeuralNetwork {
    constructor() {
        this.inputSize = 15; // 9 board + 6 player style
        this.hiddenSize = 20;
        this.outputSize = 9; // 9 possible moves
        
        // Initialize weights randomly
        this.weightsInputHidden = this.randomMatrix(this.inputSize, this.hiddenSize);
        this.weightsHiddenOutput = this.randomMatrix(this.hiddenSize, this.outputSize);
        
        this.biasHidden = new Array(this.hiddenSize).fill(0).map(() => Math.random() - 0.5);
        this.biasOutput = new Array(this.outputSize).fill(0).map(() => Math.random() - 0.5);
    }
    
    randomMatrix(rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = Math.random() - 0.5;
            }
        }
        return matrix;
    }
    
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    forward(input) {
        // Input to hidden layer
        const hidden = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = this.biasHidden[i];
            for (let j = 0; j < this.inputSize; j++) {
                sum += input[j] * this.weightsInputHidden[j][i];
            }
            hidden[i] = this.sigmoid(sum);
        }
        
        // Hidden to output layer
        const output = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = this.biasOutput[i];
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += hidden[j] * this.weightsHiddenOutput[j][i];
            }
            output[i] = this.sigmoid(sum);
        }
        
        return output;
    }
    
    train(input, target, learningRate) {
        // Simple backpropagation (simplified for demo)
        const output = this.forward(input);
        
        // Calculate error
        const outputError = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputError[i] = target[i] - output[i];
        }
        
        // Update weights (simplified)
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weightsHiddenOutput[i][j] += learningRate * outputError[j] * output[j] * (1 - output[j]);
            }
        }
    }
}

class TeamAICoordinator {
    constructor() {
        this.teamStrategy = 'balanced';
        this.coordination = {
            aggressive_support: 0.5,
            defensive_support: 0.5,
            combo_execution: 0.5
        };
    }
    
    planTeamMove(allies, enemies, gameState) {
        // Analyze team composition and plan coordinated moves
        const teamPlan = {
            primaryMove: null,
            supportMoves: [],
            strategy: this.determineStrategy(allies, enemies)
        };
        
        // Calculate synergy bonuses
        const synergy = this.calculateTeamSynergy(allies);
        
        // Plan coordinated attack
        if (synergy > 0.7) {
            teamPlan.primaryMove = this.planComboAttack(allies, enemies);
        } else {
            teamPlan.primaryMove = this.planIndividualMove(allies[0], gameState);
        }
        
        return teamPlan;
    }
    
    determineStrategy(allies, enemies) {
        const allyPower = allies.reduce((sum, ally) => sum + ally.force, 0);
        const enemyPower = enemies.reduce((sum, enemy) => sum + enemy.force, 0);
        
        if (allyPower > enemyPower * 1.2) {
            return 'aggressive';
        } else if (allyPower < enemyPower * 0.8) {
            return 'defensive';
        } else {
            return 'balanced';
        }
    }
    
    calculateTeamSynergy(allies) {
        // Calculate synergy based on character combinations
        const synergyMap = {
            'goku_vegeta': 0.9,
            'naruto_sasuke': 0.85,
            'luffy_zoro': 0.8,
            'deku_bakugo': 0.75
        };
        
        // Check for known synergies
        const allyNames = allies.map(a => a.nom).sort().join('_');
        return synergyMap[allyNames] || 0.5;
    }
    
    planComboAttack(allies, enemies) {
        // Plan a devastating combo attack
        return {
            type: 'combo',
            participants: allies,
            damage_multiplier: 1.5,
            energy_cost: 3
        };
    }
    
    planIndividualMove(character, gameState) {
        // Plan individual move based on current game state
        return {
            type: 'individual',
            character: character,
            move: this.getBestIndividualMove(character, gameState)
        };
    }
    
    getBestIndividualMove(character, gameState) {
        // Simplified move calculation
        const availableMoves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameState.grille[i][j] === '') {
                    availableMoves.push({ ligne: i, colonne: j });
                }
            }
        }
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
}

class MovePredictionEngine {
    constructor() {
        this.playerPatterns = new Map();
        this.predictionAccuracy = 0.5;
    }
    
    analyzePlayerPattern(playerId, moveHistory) {
        if (!this.playerPatterns.has(playerId)) {
            this.playerPatterns.set(playerId, {
                openingMoves: {},
                responsePatterns: {},
                endgamePatterns: {}
            });
        }
        
        const patterns = this.playerPatterns.get(playerId);
        
        // Analyze opening moves
        if (moveHistory.length <= 2) {
            const opening = moveHistory.map(m => `${m.ligne},${m.colonne}`).join('-');
            patterns.openingMoves[opening] = (patterns.openingMoves[opening] || 0) + 1;
        }
        
        // Analyze response patterns
        if (moveHistory.length >= 2) {
            const lastOpponentMove = moveHistory[moveHistory.length - 2];
            const playerResponse = moveHistory[moveHistory.length - 1];
            const pattern = `${lastOpponentMove.ligne},${lastOpponentMove.colonne}->${playerResponse.ligne},${playerResponse.colonne}`;
            patterns.responsePatterns[pattern] = (patterns.responsePatterns[pattern] || 0) + 1;
        }
    }
    
    predictNextMove(playerId, currentGameState, moveHistory) {
        if (!this.playerPatterns.has(playerId)) {
            return null;
        }
        
        const patterns = this.playerPatterns.get(playerId);
        const predictions = [];
        
        // Predict based on response patterns
        if (moveHistory.length > 0) {
            const lastMove = moveHistory[moveHistory.length - 1];
            const responseKey = `${lastMove.ligne},${lastMove.colonne}->`;
            
            Object.keys(patterns.responsePatterns).forEach(pattern => {
                if (pattern.startsWith(responseKey)) {
                    const response = pattern.split('->')[1];
                    const [ligne, colonne] = response.split(',').map(Number);
                    
                    if (currentGameState.grille[ligne][colonne] === '') {
                        predictions.push({
                            ligne,
                            colonne,
                            confidence: patterns.responsePatterns[pattern] / 100
                        });
                    }
                }
            });
        }
        
        // Sort by confidence
        predictions.sort((a, b) => b.confidence - a.confidence);
        
        return predictions[0] || null;
    }
    
    getPredictionAccuracy() {
        return this.predictionAccuracy;
    }
    
    updateAccuracy(prediction, actualMove) {
        if (prediction && 
            prediction.ligne === actualMove.ligne && 
            prediction.colonne === actualMove.colonne) {
            this.predictionAccuracy = Math.min(0.95, this.predictionAccuracy + 0.05);
        } else {
            this.predictionAccuracy = Math.max(0.1, this.predictionAccuracy - 0.02);
        }
    }
}

class RecommendationEngine {
    constructor() {
        this.moveEvaluator = new MoveEvaluator();
    }
    
    getRecommendations(gameState, playerCharacter, difficulty = 'medium') {
        const availableMoves = this.getAvailableMoves(gameState.grille);
        const recommendations = [];
        
        availableMoves.forEach(move => {
            const score = this.evaluateMove(move, gameState, playerCharacter);
            const risk = this.calculateRisk(move, gameState);
            const reward = this.calculateReward(move, gameState);
            
            recommendations.push({
                move,
                score,
                risk,
                reward,
                explanation: this.generateExplanation(move, score, risk, reward)
            });
        });
        
        // Sort by score
        recommendations.sort((a, b) => b.score - a.score);
        
        // Return top 3 recommendations
        return recommendations.slice(0, 3);
    }
    
    evaluateMove(move, gameState, character) {
        let score = 0;
        
        // Check for winning move
        if (this.isWinningMove(move, gameState, character.nom)) {
            score += 100;
        }
        
        // Check for blocking move
        if (this.isBlockingMove(move, gameState, character.nom)) {
            score += 50;
        }
        
        // Positional value
        score += this.getPositionalValue(move);
        
        // Character synergy
        score += this.getCharacterSynergy(move, character);
        
        return score;
    }
    
    isWinningMove(move, gameState, playerName) {
        // Simulate move and check for win
        const tempGrid = gameState.grille.map(row => [...row]);
        tempGrid[move.ligne][move.colonne] = playerName;
        
        return this.checkWin(tempGrid, playerName);
    }
    
    isBlockingMove(move, gameState, playerName) {
        // Check if move blocks opponent win
        const opponentName = gameState.joueur1.nom === playerName ? 
            gameState.joueur2.nom : gameState.joueur1.nom;
        
        const tempGrid = gameState.grille.map(row => [...row]);
        tempGrid[move.ligne][move.colonne] = opponentName;
        
        return this.checkWin(tempGrid, opponentName);
    }
    
    checkWin(grid, playerName) {
        // Check rows, columns, and diagonals
        for (let i = 0; i < 3; i++) {
            if (grid[i].every(cell => cell === playerName) ||
                grid.every(row => row[i] === playerName)) {
                return true;
            }
        }
        
        return (grid[0][0] === playerName && grid[1][1] === playerName && grid[2][2] === playerName) ||
               (grid[0][2] === playerName && grid[1][1] === playerName && grid[2][0] === playerName);
    }
    
    getPositionalValue(move) {
        // Center is most valuable, corners next, edges least
        const values = [
            [3, 2, 3],
            [2, 4, 2],
            [3, 2, 3]
        ];
        
        return values[move.ligne][move.colonne];
    }
    
    getCharacterSynergy(move, character) {
        // Some characters prefer certain positions
        const preferences = {
            'goku': [[1, 1]], // Center
            'saitama': [[1, 1]], // Center
            'gojo': [[0, 0], [0, 2], [2, 0], [2, 2]], // Corners
            'ichigo': [[0, 1], [1, 0], [1, 2], [2, 1]] // Edges
        };
        
        const charPrefs = preferences[character.nom] || [];
        const matchesPreference = charPrefs.some(pref => 
            pref[0] === move.ligne && pref[1] === move.colonne);
        
        return matchesPreference ? 2 : 0;
    }
    
    calculateRisk(move, gameState) {
        // Calculate risk level (0-10)
        let risk = 0;
        
        // Center moves are generally safer
        if (move.ligne === 1 && move.colonne === 1) {
            risk += 2;
        }
        
        // Edge moves can be risky
        if ((move.ligne === 1 && move.colonne !== 1) || 
            (move.ligne !== 1 && move.colonne === 1)) {
            risk += 4;
        }
        
        return Math.min(10, risk);
    }
    
    calculateReward(move, gameState) {
        // Calculate potential reward (0-10)
        let reward = 5; // Base reward
        
        // Higher reward for strategic positions
        if (move.ligne === 1 && move.colonne === 1) {
            reward += 3;
        }
        
        return Math.min(10, reward);
    }
    
    generateExplanation(move, score, risk, reward) {
        const explanations = [];
        
        if (score > 80) {
            explanations.push("Coup gagnant !");
        } else if (score > 40) {
            explanations.push("Bloque l'adversaire");
        }
        
        if (move.ligne === 1 && move.colonne === 1) {
            explanations.push("Position centrale stratégique");
        }
        
        if (risk < 3) {
            explanations.push("Risque faible");
        } else if (risk > 7) {
            explanations.push("Risque élevé");
        }
        
        return explanations.join(", ") || "Coup standard";
    }
    
    getAvailableMoves(grille) {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grille[i][j] === '') {
                    moves.push({ ligne: i, colonne: j });
                }
            }
        }
        return moves;
    }
}

class MoveEvaluator {
    constructor() {
        this.evaluationCriteria = {
            winning: 100,
            blocking: 50,
            center: 10,
            corner: 7,
            edge: 5,
            fork: 25,
            trap: 15
        };
    }
    
    evaluatePosition(grid, playerName) {
        let score = 0;
        
        // Evaluate all possible moves
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i][j] === '') {
                    score += this.evaluateMove({ligne: i, colonne: j}, grid, playerName);
                }
            }
        }
        
        return score;
    }
    
    evaluateMove(move, grid, playerName) {
        // This would contain detailed move evaluation logic
        // For now, return a simple positional value
        return this.getPositionalValue(move);
    }
    
    getPositionalValue(move) {
        const values = [
            [3, 2, 3],
            [2, 4, 2],
            [3, 2, 3]
        ];
        
        return values[move.ligne][move.colonne];
    }
}

// Export for global use
window.AdvancedAISystem = AdvancedAISystem;
window.advancedAI = new AdvancedAISystem();