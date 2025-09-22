"""Flask application for Morpion Otaku Battle"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from model.game_model import MorpionModel
from typing import Dict, Any, Union, Tuple
from flask import Response

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global game model instance
game_model = MorpionModel()

@app.route('/')
def index() -> Response:
    """Serve the main HTML page"""
    return send_from_directory('view', 'index.html')

@app.route('/initialize', methods=['POST'])
def initialize_game() -> Union[Response, Tuple[Response, int]]:
    """Initialize a new game with selected characters"""
    global game_model

    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Données JSON manquantes'}), 400
            
        perso1 = data.get('perso1')
        perso2 = data.get('perso2')
        ai_mode = data.get('ai_mode', False)
        ai_difficulty = data.get('ai_difficulty', 'medium')

        if not perso1 or not perso2:
            return jsonify({'error': 'Personnages non specifies'}), 400

        # Create a new instance of the model
        game_model = MorpionModel()
        game_model.choisir_personnages(perso1, perso2, ai_mode, ai_difficulty)

        return jsonify(game_model.get_etat())
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Erreur lors de l'initialisation: {e}")
        return jsonify({'error': f'Erreur interne: {str(e)}'}), 500

@app.route('/ai-move', methods=['POST'])
def get_ai_move() -> Union[Response, Tuple[Response, int]]:
    """Get AI move"""
    global game_model
    
    if not game_model.joueur1 or not game_model.joueur2:
        return jsonify({'error': 'Partie non initialisee'}), 400
    
    ai_move = game_model.get_ai_move()
    if ai_move:
        # Execute AI move
        success = game_model.jouer_coup(ai_move['ligne'], ai_move['colonne'])
        if success:
            return jsonify(game_model.get_etat())
        else:
            return jsonify({'error': 'Coup IA invalide'}), 400
    else:
        return jsonify({'error': 'Pas le tour de l\'IA'}), 400

@app.route('/stats', methods=['GET'])
def get_stats() -> Union[Response, Tuple[Response, int]]:
    """Get game statistics"""
    # This would typically come from a database
    # For now, return empty stats
    stats = {
        'totalGames': 0,
        'wins': 0,
        'losses': 0,
        'draws': 0
    }
    return jsonify(stats)

@app.route('/jouer', methods=['POST'])
def jouer_coup() -> Union[Response, Tuple[Response, int]]:
    """Play a move on the grid"""
    global game_model

    if not game_model.joueur1 or not game_model.joueur2:
        return jsonify({'error': 'Partie non initialisee'}), 400

    data = request.json
    if not data:
        return jsonify({'error': 'Données JSON manquantes'}), 400
        
    ligne = data.get('ligne')
    colonne = data.get('colonne')

    if ligne is None or colonne is None:
        return jsonify({'error': 'Position non specifiee'}), 400

    # Play the move
    success = game_model.jouer_coup(ligne, colonne)

    if not success:
        return jsonify({'error': 'Coup invalide'}), 400

    return jsonify(game_model.get_etat())

@app.route('/reset', methods=['POST'])
def reset_game() -> Union[Response, Tuple[Response, int]]:
    """Reset the current game"""
    global game_model

    if not game_model.joueur1 or not game_model.joueur2:
        return jsonify({'error': 'Partie non initialisee'}), 400

    game_model.reset_partie()

    return jsonify(game_model.get_etat())

@app.route('/<path:filename>')
def serve_static(filename: str) -> Response:
    """Serve static files (CSS, JS, images)"""
    if filename.endswith(('.css', '.js', '.jpg', '.png', '.gif')):
        return send_from_directory('', filename)
    return send_from_directory('view', filename)

if __name__ == '__main__':
    # Start the server
    print("Demarrage du serveur Morpion Otaku Battle...")
    print("Ouvrez votre navigateur et allez sur: http://localhost:5000")
    print("Assurez-vous d'avoir toutes les images des personnages dans le dossier racine")
    app.run(debug=True, host='0.0.0.0', port=5000)
