# Vercel-compatible Flask app
from flask import Flask, request, jsonify, render_template_string
import sys
import os
import json

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from model.game_model import MorpionModel
    from model.ai_player import AIPlayer
except ImportError:
    # Fallback if imports fail
    class MorpionModel:
        def __init__(self):
            self.partie_terminee = False
            self.vainqueur = None
            self.joueur_actuel = None
            self.joueur1 = None
            self.joueur2 = None
            self.grille = [[None for _ in range(3)] for _ in range(3)]
        
        def choisir_personnages(self, perso1, perso2):
            class Joueur:
                def __init__(self, nom):
                    self.nom = nom.capitalize()
            
            self.joueur1 = Joueur(perso1)
            self.joueur2 = Joueur(perso2)
            self.joueur_actuel = self.joueur1
        
        def jouer_coup(self, ligne, colonne, joueur):
            if self.grille[ligne][colonne] is None:
                self.grille[ligne][colonne] = joueur.nom
                self._verifier_victoire()
                if not self.partie_terminee:
                    self.joueur_actuel = self.joueur2 if joueur == self.joueur1 else self.joueur1
                return True
            return False
        
        def _verifier_victoire(self):
            # Vérification horizontale, verticale et diagonale
            for i in range(3):
                if (self.grille[i][0] == self.grille[i][1] == self.grille[i][2] and self.grille[i][0] is not None):
                    self.partie_terminee = True
                    self.vainqueur = self.joueur1 if self.grille[i][0] == self.joueur1.nom else self.joueur2
                    return
                if (self.grille[0][i] == self.grille[1][i] == self.grille[2][i] and self.grille[0][i] is not None):
                    self.partie_terminee = True
                    self.vainqueur = self.joueur1 if self.grille[0][i] == self.joueur1.nom else self.joueur2
                    return
            
            # Diagonales
            if (self.grille[0][0] == self.grille[1][1] == self.grille[2][2] and self.grille[0][0] is not None):
                self.partie_terminee = True
                self.vainqueur = self.joueur1 if self.grille[0][0] == self.joueur1.nom else self.joueur2
                return
            if (self.grille[0][2] == self.grille[1][1] == self.grille[2][0] and self.grille[0][2] is not None):
                self.partie_terminee = True
                self.vainqueur = self.joueur1 if self.grille[0][2] == self.joueur1.nom else self.joueur2
                return
            
            # Vérifier égalité
            if all(self.grille[i][j] is not None for i in range(3) for j in range(3)):
                self.partie_terminee = True
                self.vainqueur = None
        
        def to_dict(self):
            return {
                'grille': self.grille,
                'partie_terminee': self.partie_terminee,
                'vainqueur': self.vainqueur.nom if self.vainqueur else None,
                'joueur_actuel': self.joueur_actuel.nom if self.joueur_actuel else None,
                'joueur1': self.joueur1.nom if self.joueur1 else None,
                'joueur2': self.joueur2.nom if self.joueur2 else None
            }
    
    class AIPlayer:
        @staticmethod
        def jouer_coup_optimal(grille, joueur_nom, difficulte='medium'):
            # IA simple pour Vercel
            for i in range(3):
                for j in range(3):
                    if grille[i][j] is None:
                        return i, j
            return None, None

app = Flask(__name__)

# Variable globale pour le jeu
game_model = None

@app.route('/')
def home():
    """Redirection vers le jeu principal"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>🎮 Morpion Otaku Battle</title>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=/view/index.html">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .btn {
                display: inline-block;
                padding: 15px 30px;
                background: #ff6b6b;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                margin: 10px;
                transition: transform 0.3s;
            }
            .btn:hover { transform: scale(1.05); }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎮 Morpion Otaku Battle</h1>
            <p>Jeu de morpion anime avec 24+ personnages !</p>
            <p>Redirection automatique...</p>
            <a href="/view/index.html" class="btn">🚀 Jouer Maintenant</a>
            <br><br>
            <p><small>✅ Déployé avec succès sur Vercel !</small></p>
        </div>
    </body>
    </html>
    '''

@app.route('/api/initialize', methods=['POST'])
def initialize_game():
    """Initialiser une nouvelle partie"""
    global game_model
    
    try:
        data = request.get_json()
        perso1 = data.get('perso1', 'goku')
        perso2 = data.get('perso2', 'luffy')
        ai_mode = data.get('ai_mode', False)
        
        game_model = MorpionModel()
        game_model.choisir_personnages(perso1, perso2)
        
        return jsonify({
            'success': True,
            'message': 'Partie initialisée',
            'game_state': game_model.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/move', methods=['POST'])
def make_move():
    """Jouer un coup"""
    global game_model
    
    if not game_model:
        return jsonify({'success': False, 'error': 'Partie non initialisée'}), 400
    
    try:
        data = request.get_json()
        ligne = data.get('ligne')
        colonne = data.get('colonne')
        
        if ligne is None or colonne is None:
            return jsonify({'success': False, 'error': 'Position invalide'}), 400
        
        joueur = game_model.joueur_actuel
        success = game_model.jouer_coup(ligne, colonne, joueur)
        
        if not success:
            return jsonify({'success': False, 'error': 'Coup invalide'}), 400
        
        return jsonify({
            'success': True,
            'game_state': game_model.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai-move', methods=['POST'])
def ai_move():
    """Coup de l'IA"""
    global game_model
    
    if not game_model:
        return jsonify({'success': False, 'error': 'Partie non initialisée'}), 400
    
    try:
        data = request.get_json()
        difficulte = data.get('difficulte', 'medium')
        
        ligne, colonne = AIPlayer.jouer_coup_optimal(
            game_model.grille, 
            game_model.joueur_actuel.nom,
            difficulte
        )
        
        if ligne is not None and colonne is not None:
            joueur = game_model.joueur_actuel
            game_model.jouer_coup(ligne, colonne, joueur)
            
            return jsonify({
                'success': True,
                'move': {'ligne': ligne, 'colonne': colonne},
                'game_state': game_model.to_dict()
            })
        else:
            return jsonify({'success': False, 'error': 'Aucun coup possible'}), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset_game():
    """Réinitialiser la partie"""
    global game_model
    game_model = None
    
    return jsonify({
        'success': True,
        'message': 'Partie réinitialisée'
    })

@app.route('/api/health')
def health_check():
    """Vérification de santé de l'API"""
    return jsonify({
        'status': 'OK',
        'message': 'Morpion Otaku Battle API is running on Vercel!',
        'version': '1.0.2'
    })

# Pour Vercel, nous devons exporter l'app
def handler(request):
    """Handler pour Vercel"""
    return app(request.environ, lambda x, y: None)

if __name__ == '__main__':
    app.run(debug=True)