"""Game model for Morpion Otaku Battle"""
from typing import Dict, List, Optional, Any
from .ai_player import AIPlayer


class Personnage:
    """Represents a character with stats for combat"""

    def __init__(self, nom: str, image: str, force: int, defense: int, vie: int) -> None:
        """Initialize a character"""
        self.nom: str = nom
        self.image: str = image
        self.force: int = force
        self.defense: int = defense
        self.vie: int = vie
        self.vie_max: int = vie

    def attaquer(self, adversaire: 'Personnage') -> int:
        """Attack an opponent and return damage dealt"""
        degats: int = max(1, self.force - adversaire.defense)
        adversaire.vie -= degats
        return degats

    def est_vivant(self) -> bool:
        """Check if character is alive"""
        return self.vie > 0

    def reset(self) -> None:
        """Reset character health"""
        self.vie = self.vie_max

    def to_dict(self) -> Dict[str, Any]:
        """Convert character to dictionary for JSON serialization"""
        return {
            'nom': self.nom,
            'image': self.image,
            'force': self.force,
            'defense': self.defense,
            'vie': self.vie,
            'vie_max': self.vie_max
        }


class MorpionModel:
    """Game logic for tic-tac-toe with combat system"""

    def __init__(self) -> None:
        """Initialize game model"""
        # Available characters
        self.personnages: Dict[str, Personnage] = {
            'asta': Personnage('Asta', 'asta.jpg', 8, 3, 100),
            'deku': Personnage('Deku', 'deku.jpg', 7, 4, 95),
            'gojo': Personnage('Gojo', 'gojo.jpg', 9, 2, 110),
            'goku': Personnage('Goku', 'goku.jpg', 10, 1, 120),
            'ichigo': Personnage('Ichigo', 'ichigo.jpg', 8, 3, 105),
            'kaijuu': Personnage('Kaiju No 8', 'kaijuu.jpg', 6, 5, 90),
            'luffy': Personnage('Luffy', 'luffy.jpg', 9, 2, 115),
            'naruto': Personnage('Naruto', 'naruto.jpg', 7, 4, 100),
            'saitama': Personnage('Saitama', 'saitama.jpg', 10, 0, 150)
        }

        self.joueur1: Optional[Personnage] = None
        self.joueur2: Optional[Personnage] = None
        self.joueur_actuel: Optional[Personnage] = None
        self.grille: List[List[str]] = [['' for _ in range(3)] for _ in range(3)]
        self.gagnant: Optional[Personnage] = None
        self.partie_terminee: bool = False
        self.is_ai_game: bool = False
        self.ai_player: Optional[AIPlayer] = None
        self.ai_difficulty: str = "medium"

    def choisir_personnages(self, perso1: str, perso2: str, ai_mode: bool = False, ai_difficulty: str = "medium") -> None:
        """Choose characters for players"""
        if perso1 not in self.personnages:
            raise ValueError(f"Personnage '{perso1}' non trouvé")
        if perso2 not in self.personnages:
            raise ValueError(f"Personnage '{perso2}' non trouvé")
        
        self.joueur1 = self.personnages[perso1]
        self.joueur2 = self.personnages[perso2]
        self.joueur_actuel = self.joueur1
        self.is_ai_game = ai_mode
        self.ai_difficulty = ai_difficulty
        
        if ai_mode:
            self.ai_player = AIPlayer(ai_difficulty)
        
        self.reset_partie()

    def reset_partie(self) -> None:
        """Reset the game"""
        self.grille = [['' for _ in range(3)] for _ in range(3)]
        if self.joueur1:
            self.joueur1.reset()
        if self.joueur2:
            self.joueur2.reset()
        self.joueur_actuel = self.joueur1  # Reset to player 1
        self.gagnant = None
        self.partie_terminee = False

    def jouer_coup(self, ligne: int, colonne: int) -> bool:
        """Play a move on the grid"""
        if (self.grille[ligne][colonne] == '' and
            not self.partie_terminee and
            self.joueur_actuel):

            self.grille[ligne][colonne] = self.joueur_actuel.nom

            if self.verifier_victoire():
                self.gagnant = self.joueur_actuel
                self.resoudre_combat()
            elif self.grille_pleine():
                self.partie_terminee = True
            else:
                self.changer_joueur()

            return True
        return False

    def verifier_victoire(self) -> bool:
        """Check for victory condition"""
        # Check rows, columns and diagonals
        for i in range(3):
            if (self.grille[i][0] == self.grille[i][1] == self.grille[i][2] != ''):
                return True
            if (self.grille[0][i] == self.grille[1][i] == self.grille[2][i] != ''):
                return True

        if (self.grille[0][0] == self.grille[1][1] == self.grille[2][2] != ''):
            return True
        if (self.grille[0][2] == self.grille[1][1] == self.grille[2][0] != ''):
            return True

        return False

    def grille_pleine(self) -> bool:
        """Check if grid is full"""
        return all(self.grille[i][j] != '' for i in range(3) for j in range(3))

    def changer_joueur(self) -> None:
        """Switch current player"""
        if self.joueur_actuel == self.joueur1:
            self.joueur_actuel = self.joueur2
        else:
            self.joueur_actuel = self.joueur1

    def resoudre_combat(self) -> None:
        """Resolve combat when someone wins tic-tac-toe"""
        if not self.gagnant:
            return
            
        # Winner attacks loser
        perdant: Optional[Personnage] = None
        if self.gagnant == self.joueur1:
            perdant = self.joueur2
        else:
            perdant = self.joueur1

        if perdant and self.gagnant:
            degats = self.gagnant.attaquer(perdant)
            print(f"{self.gagnant.nom} attaque {perdant.nom} pour {degats} dégâts !")
            
            if not perdant.est_vivant():
                self.partie_terminee = True
                print(f"{perdant.nom} est éliminé ! {self.gagnant.nom} remporte le combat !")
            else:
                # Counter-attack if loser survives
                degats_contre = perdant.attaquer(self.gagnant)
                print(f"{perdant.nom} contre-attaque pour {degats_contre} dégâts !")
                
                if not self.gagnant.est_vivant():
                    self.gagnant = perdant
                    self.partie_terminee = True
                    print(f"{self.gagnant.nom} remporte le combat par contre-attaque !")
                else:
                    # Reset grid for next round if both alive
                    self.grille = [['', '', ''] for _ in range(3)]
                    print("Les deux combattants survivent ! Nouvelle manche !")

    def get_ai_move(self) -> Optional[Dict[str, int]]:
        """Get AI move if it's AI's turn"""
        if (self.is_ai_game and self.ai_player and self.joueur_actuel and
            self.joueur_actuel == self.joueur2 and not self.partie_terminee):
            ligne, colonne = self.ai_player.choose_move(self.grille, self.joueur_actuel.nom)
            return {'ligne': ligne, 'colonne': colonne}
        return None

    def get_etat(self) -> Dict[str, Any]:
        """Get current game state"""
        return {
            'grille': [ligne[:] for ligne in self.grille],
            'joueur_actuel': self.joueur_actuel.to_dict() if self.joueur_actuel else None,
            'joueur1': self.joueur1.to_dict() if self.joueur1 else None,
            'joueur2': self.joueur2.to_dict() if self.joueur2 else None,
            'gagnant': self.gagnant.to_dict() if self.gagnant else None,
            'partie_terminee': self.partie_terminee,
            'is_ai_game': self.is_ai_game,
            'ai_difficulty': self.ai_difficulty
        }
