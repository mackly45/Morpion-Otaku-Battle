// Modèle de jeu local pour fonctionner sans API
class LocalGameModel {
    constructor() {
        this.grille = [[null, null, null], [null, null, null], [null, null, null]];
        this.partie_terminee = false;
        this.vainqueur = null;
        this.joueur1 = null;
        this.joueur2 = null;
        this.joueur_actuel = null;
        this.gameMode = 'pvp';
    }

    choisir_personnages(perso1, perso2, gameMode = 'pvp') {
        this.joueur1 = { nom: this.capitalizeFirst(perso1) };
        this.joueur2 = { nom: this.capitalizeFirst(perso2) };
        this.joueur_actuel = this.joueur1;
        this.gameMode = gameMode;
        console.log('Local game initialized:', this.joueur1.nom, 'vs', this.joueur2.nom);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    jouer_coup(ligne, colonne) {
        if (this.partie_terminee || this.grille[ligne][colonne] !== null) {
            return false;
        }

        this.grille[ligne][colonne] = this.joueur_actuel.nom;
        
        if (this._verifier_victoire()) {
            this.partie_terminee = true;
            this.vainqueur = this.joueur_actuel;
        } else if (this._grille_complete()) {
            this.partie_terminee = true;
            this.vainqueur = null; // Match nul
        } else {
            // Changer de joueur
            this.joueur_actuel = (this.joueur_actuel === this.joueur1) ? this.joueur2 : this.joueur1;
        }

        return true;
    }

    _verifier_victoire() {
        const nom = this.joueur_actuel.nom;
        
        // Vérifications horizontales et verticales
        for (let i = 0; i < 3; i++) {
            if ((this.grille[i][0] === nom && this.grille[i][1] === nom && this.grille[i][2] === nom) ||
                (this.grille[0][i] === nom && this.grille[1][i] === nom && this.grille[2][i] === nom)) {
                return true;
            }
        }
        
        // Vérifications diagonales
        if ((this.grille[0][0] === nom && this.grille[1][1] === nom && this.grille[2][2] === nom) ||
            (this.grille[0][2] === nom && this.grille[1][1] === nom && this.grille[2][0] === nom)) {
            return true;
        }
        
        return false;
    }

    _grille_complete() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grille[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // IA simple
    jouer_coup_ia() {
        if (this.partie_terminee) return null;

        // Stratégie simple: trouver le premier emplacement libre
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grille[i][j] === null) {
                    this.jouer_coup(i, j);
                    return { ligne: i, colonne: j };
                }
            }
        }
        return null;
    }

    to_dict() {
        return {
            grille: this.grille,
            partie_terminee: this.partie_terminee,
            vainqueur: this.vainqueur,
            joueur_actuel: this.joueur_actuel,
            joueur1: this.joueur1,
            joueur2: this.joueur2
        };
    }
}

// Rendre disponible globalement
window.LocalGameModel = LocalGameModel;