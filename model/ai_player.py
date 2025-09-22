"""
AI Player module for Morpion Otaku Battle
Provides different difficulty levels of AI opponents
"""
import random
from typing import Tuple, List, Optional


class AIPlayer:
    """AI player with configurable difficulty levels"""
    
    def __init__(self, difficulty: str = "medium"):
        self.difficulty = difficulty  # easy, medium, hard, expert
        
    def choose_move(self, grille: List[List[str]], joueur_nom: str) -> Tuple[int, int]:
        """Choose the best move based on difficulty level"""
        
        if self.difficulty == "easy":
            return self._easy_move(grille)
        elif self.difficulty == "medium":
            return self._medium_move(grille, joueur_nom)
        elif self.difficulty == "hard":
            return self._hard_move(grille, joueur_nom)
        elif self.difficulty == "expert":
            return self._expert_move(grille, joueur_nom)
        else:
            return self._medium_move(grille, joueur_nom)
    
    def _easy_move(self, grille: List[List[str]]) -> Tuple[int, int]:
        """Random move for easy difficulty"""
        available_moves = []
        for i in range(3):
            for j in range(3):
                if grille[i][j] == '':
                    available_moves.append((i, j))
        
        return random.choice(available_moves) if available_moves else (0, 0)
    
    def _medium_move(self, grille: List[List[str]], joueur_nom: str) -> Tuple[int, int]:
        """Medium difficulty: sometimes make good moves, sometimes random"""
        
        # 70% chance to make a smart move
        if random.random() < 0.7:
            # Try to win first
            win_move = self._find_winning_move(grille, joueur_nom)
            if win_move:
                return win_move
            
            # Then try to block opponent
            opponent_move = self._find_opponent_winning_move(grille, joueur_nom)
            if opponent_move:
                return opponent_move
        
        # Otherwise random move
        return self._easy_move(grille)
    
    def _hard_move(self, grille: List[List[str]], joueur_nom: str) -> Tuple[int, int]:
        """Hard difficulty: always try to win or block"""
        
        # Always try to win first
        win_move = self._find_winning_move(grille, joueur_nom)
        if win_move:
            return win_move
        
        # Then always block opponent
        opponent_move = self._find_opponent_winning_move(grille, joueur_nom)
        if opponent_move:
            return opponent_move
        
        # Take center if available
        if grille[1][1] == '':
            return (1, 1)
        
        # Take corners
        corners = [(0, 0), (0, 2), (2, 0), (2, 2)]
        available_corners = [(i, j) for i, j in corners if grille[i][j] == '']
        if available_corners:
            return random.choice(available_corners)
        
        # Take sides
        return self._easy_move(grille)
    
    def _expert_move(self, grille: List[List[str]], joueur_nom: str) -> Tuple[int, int]:
        """Expert difficulty: minimax algorithm"""
        return self._minimax_move(grille, joueur_nom)
    
    def _find_winning_move(self, grille: List[List[str]], joueur_nom: str) -> Optional[Tuple[int, int]]:
        """Find a move that wins the game"""
        for i in range(3):
            for j in range(3):
                if grille[i][j] == '':
                    # Try this move
                    grille[i][j] = joueur_nom
                    if self._check_winner(grille, joueur_nom):
                        grille[i][j] = ''  # Undo move
                        return (i, j)
                    grille[i][j] = ''  # Undo move
        return None
    
    def _find_opponent_winning_move(self, grille: List[List[str]], joueur_nom: str) -> Optional[Tuple[int, int]]:
        """Find opponent's winning move to block it"""
        # Get all non-empty cells to determine opponent
        for i in range(3):
            for j in range(3):
                if grille[i][j] != '' and grille[i][j] != joueur_nom:
                    opponent_nom = grille[i][j]
                    return self._find_winning_move(grille, opponent_nom)
        return None
    
    def _check_winner(self, grille: List[List[str]], joueur_nom: str) -> bool:
        """Check if the player has won"""
        # Check rows
        for i in range(3):
            if all(grille[i][j] == joueur_nom for j in range(3)):
                return True
        
        # Check columns
        for j in range(3):
            if all(grille[i][j] == joueur_nom for i in range(3)):
                return True
        
        # Check diagonals
        if all(grille[i][i] == joueur_nom for i in range(3)):
            return True
        if all(grille[i][2-i] == joueur_nom for i in range(3)):
            return True
        
        return False
    
    def _minimax_move(self, grille: List[List[str]], joueur_nom: str) -> Tuple[int, int]:
        """Minimax algorithm for perfect play"""
        best_score = float('-inf')
        best_move = (0, 0)
        
        for i in range(3):
            for j in range(3):
                if grille[i][j] == '':
                    grille[i][j] = joueur_nom
                    score = self._minimax(grille, 0, False, joueur_nom)
                    grille[i][j] = ''
                    
                    if score > best_score:
                        best_score = score
                        best_move = (i, j)
        
        return best_move
    
    def _minimax(self, grille: List[List[str]], depth: int, is_maximizing: bool, joueur_nom: str) -> float:
        """Minimax recursive function"""
        # Get opponent name
        opponent_nom = None
        for i in range(3):
            for j in range(3):
                if grille[i][j] != '' and grille[i][j] != joueur_nom:
                    opponent_nom = grille[i][j]
                    break
            if opponent_nom:
                break
        
        if opponent_nom is None:
            opponent_nom = "Opponent"  # Fallback
        
        # Terminal cases
        if self._check_winner(grille, joueur_nom):
            return 10 - depth
        elif self._check_winner(grille, opponent_nom):
            return depth - 10
        elif self._is_board_full(grille):
            return 0
        
        if is_maximizing:
            best_score = float('-inf')
            for i in range(3):
                for j in range(3):
                    if grille[i][j] == '':
                        grille[i][j] = joueur_nom
                        score = self._minimax(grille, depth + 1, False, joueur_nom)
                        grille[i][j] = ''
                        best_score = max(score, best_score)
            return best_score
        else:
            best_score = float('inf')
            for i in range(3):
                for j in range(3):
                    if grille[i][j] == '':
                        grille[i][j] = opponent_nom
                        score = self._minimax(grille, depth + 1, True, joueur_nom)
                        grille[i][j] = ''
                        best_score = min(score, best_score)
            return best_score
    
    def _is_board_full(self, grille: List[List[str]]) -> bool:
        """Check if the board is full"""
        return all(grille[i][j] != '' for i in range(3) for j in range(3))