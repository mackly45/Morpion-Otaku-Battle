# Morpion Otaku Battle

Un jeu de morpion épique où des personnages d'anime s'affrontent dans des combats intenses avec des fonctionnalités avancées !

## Description

**Morpion Otaku Battle** est une version ultra-améliorée du jeu de morpion classique où chaque victoire sur la grille déclenche un système de combat entre les personnages. Choisissez parmi 9 personnages d'anime légendaires et affrontez-vous dans des duels stratégiques avec une IA intelligente, des effets visuels spectaculaires, et bien plus !

## ✨ Fonctionnalités

### 🎮 Fonctionnalités de Base
* **9 personnages d'anime légendaires** : Asta, Deku, Gojo, Goku, Ichigo, Kaiju No. 8, Luffy, Naruto, Saitama
* **Système de combat avancé** : Points de vie, attaques, contre-attaques
* **Mode PvP et IA** : Jouez contre un ami ou contre l'intelligence artificielle
* **4 niveaux de difficulté IA** : Facile, Moyen, Difficile, Expert (avec algorithme minimax)
* **Interface moderne responsive** : S'adapte parfaitement à tous les écrans

### 🎨 Système de Thèmes
* **5 thèmes visuels** : Classique, Sombre, Océan, Feu, Nature
* **Interface personnalisable** : Changez l'apparence selon vos préférences
* **Transitions fluides** : Animations élégantes entre les thèmes

### 🔊 Système Audio Complet
* **Effets sonores** : Sons pour les clics, mouvements, victoires
* **Musique de fond** : Ambiance sonore immersive
* **Contrôles audio** : Désactivez sons/musique indépendamment

### 📱 Optimisation Mobile
* **Interface tactile** : Optimisée pour smartphones et tablettes
* **Adaptation automatique** : Détection et adaptation mobile
* **Contrôles tactiles** : Interactions fluides sur écran tactile

### 💾 Système de Sauvegarde
* **Statistiques persistantes** : Parties jouées, taux de victoire, séries
* **Historique des parties** : Sauvegarde des 50 dernières parties
* **Paramètres sauvegardés** : Thème, langue, préférences audio

### 🏆 Système d'Achievements
* **Succès débloquables** : Première victoire, séries de victoires, etc.
* **Notifications visuelles** : Alertes lors des nouveaux succès
* **Progression trackée** : Suivez vos accomplissements

### 🎓 Tutoriel Interactif
* **Guide pas à pas** : Apprenez à jouer facilement
* **Aide contextuelle** : Assistance pendant le jeu
* **Mode découverte** : Explorez toutes les fonctionnalités

### 📊 Analytics et Statistiques
* **Données de jeu** : Temps de jeu, personnages favoris
* **Analyses de performance** : Taux de victoire par personnage
* **Historique détaillé** : Replays et statistiques avancées

### 🌍 Internationalisation
* **3 langues supportées** : Français, English, Español
* **Interface traduite** : Textes adaptés selon la langue
* **Changement à la volée** : Basculez entre les langues instantanément

### 🚀 Fonctionnalités Avancées
* **📸 Mode Photo** : Capturez vos moments de victoire
* **🌈 Shaders Avancés** : Effets visuels avec WebGL
* **🤖 IA Machine Learning** : Intelligence artificielle évolutive
* **🧩 Prédiction de Coups** : Suggestions de mouvements optimaux
* **🎭 Système de Skins** : Apparences alternatives pour les personnages
* **👥 Préparation Mode Équipe** : Fonctionnalité en développement

### 🎯 Système de Replay
* **Sauvegarde automatique** : Enregistrement des parties importantes
* **Revisionner les coups** : Analysez vos stratégies
* **Partage de parties** : Exportez vos meilleures performances

## 🎮 Comment jouer

### Mode Joueur vs Joueur (PvP)
1. **Sélection des personnages** : Chaque joueur choisit un personnage différent
2. **Tour par tour** : Les joueurs placent leurs marques (initiales du personnage) sur la grille 3x3
3. **Victoire au morpion** : Le joueur qui aligne 3 marques gagne la manche
4. **Combat** : Le gagnant attaque le perdant selon les statistiques des personnages
5. **Système de vie** : Les personnages ont des points de vie qui diminuent lors des attaques
6. **Contre-attaque** : Si le perdant survit, il peut contre-attaquer !

### Mode Joueur vs IA
1. **Sélection IA** : Choisissez "Joueur vs IA" et sélectionnez la difficulté
2. **Difficultés disponibles** :
   - **Facile** : IA qui joue aléatoirement
   - **Moyen** : IA avec 70% de coups intelligents
   - **Difficile** : IA qui bloque et attaque toujours
   - **Expert** : IA avec algorithme minimax (imbattable !)
3. **Combat automatique** : L'IA joue automatiquement après votre tour

### Contrôles et Navigation
- **⚙️** : Paramètres (thèmes, sons, langue)
- **📁** : Statistiques de jeu
- **🏆** : Succès et achievements
- **📸** : Mode photo
- **🎭** : Skins et personnalisations
- **🎯** : Tutoriel interactif
- **🌍** : Mode multijoueur (préparation)

## Statistiques des personnages

| Personnage | Force | Défense | Vie | Spécialité |
|------------|-------|---------|-----|------------|
| **Asta** | 8 | 3 | 100 | Équilibré |
| **Deku** | 7 | 4 | 95 | Défenseur |
| **Gojo** | 9 | 2 | 110 | Puissant |
| **Goku** | 10 | 1 | 120 | Ultra-fort |
| **Ichigo** | 8 | 3 | 105 | Équilibré |
| **Kaiju No. 8** | 6 | 5 | 90 | Tank |
| **Luffy** | 9 | 2 | 115 | Puissant |
| **Naruto** | 7 | 4 | 100 | Défenseur |
| **Saitama** | 10 | 0 | 150 | Invincible |

## 💻 Installation et exécution

### Prérequis
- Python 3.7+
- pip (gestionnaire de paquets Python)
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

### Installation rapide

1. **Installation automatique (recommandé)** :
   ```bash
   ./start_game.sh  # Sur Linux/Mac
   start_game.bat   # Sur Windows
   ```

2. **Installation manuelle** :
   ```bash
   pip install -r requirements.txt
   python app.py
   ```

### Lancement du jeu

1. Le serveur démarre automatiquement sur le port 5000
2. Ouvrez votre navigateur et allez sur : `http://localhost:5000`
3. Le jeu se charge avec tous les personnages et fonctionnalités
4. Profitez de l'expérience complète !

### Première utilisation

1. **Tutoriel** : Cliquez sur 🎯 pour découvrir le jeu
2. **Paramètres** : Configurez votre thème et langue préférés
3. **Test IA** : Essayez les différents niveaux de difficulté
4. **Exploration** : Découvrez toutes les fonctionnalités avancées

## 🏛️ Architecture du projet

```
Morpion-Otaku-Battle/
├── model/
│   ├── game_model.py           # Logique principale du jeu
│   ├── ai_player.py            # Intelligence artificielle (4 niveaux)
│   └── evolution_system.py     # Système d'évolution des personnages
├── controller/
│   ├── game_controller.js      # Contrôleur principal
│   ├── audio_manager.js        # Gestion audio et sons
│   ├── features_manager.js     # Gestionnaire de fonctionnalités
│   ├── advanced_features.js    # Fonctionnalités avancées
│   ├── visual_effects.js       # Effets visuels et shaders WebGL
│   ├── advanced_ai.js          # IA machine learning
│   └── skins_and_final_features.js # Skins et fonctions finales
├── view/
│   └── index.html              # Interface utilisateur
├── app.py                      # Serveur Flask (API REST)
├── styles.css                  # Styles CSS avec thèmes
├── requirements.txt            # Dépendances Python
├── start_game.sh              # Script de démarrage Linux/Mac
├── start_game.bat             # Script de démarrage Windows
├── TROUBLESHOOTING.md         # Guide de dépannage
└── README.md                  # Documentation complète
```

### Architecture Technique

**Backend (Python)**
- **Flask** : Serveur web léger et API REST
- **MorpionModel** : Logique de jeu et gestion des personnages
- **AIPlayer** : Algorithmes d'IA (aléatoire, heuristique, minimax)
- **CORS** : Support cross-origin pour le développement

**Frontend (JavaScript)**
- **GameController** : Orchestration du jeu et communication API
- **Gestionnaires spécialisés** : Audio, thèmes, sauvegarde, achievements
- **Managers avancés** : IA ML, effets visuels, skins, analytics

**Interface (HTML/CSS)**
- **Design responsive** : Adaptation mobile et desktop
- **Système de thèmes** : Variables CSS dynamiques
- **Animations fluides** : Transitions et effets visuels

## 🛠️ Technologies utilisées

### Backend
* **Python 3.7+** : Langage principal backend
* **Flask 2.3+** : Framework web minimaliste et performant
* **Flask-CORS** : Support des requêtes cross-origin
* **Algorithmes IA** : Minimax, heuristiques, machine learning

### Frontend
* **HTML5** : Structure sémantique moderne
* **CSS3** : Animations, grid, flexbox, variables CSS
* **JavaScript ES6+** : Classes, modules, async/await, fetch API
* **WebGL** : Rendu graphique avancé pour les shaders
* **Web Audio API** : Gestion audio native

### Architecture
* **MVC Pattern** : Séparation modèle-vue-contrôleur
* **API RESTful** : Communication client-serveur standardisée
* **JSON** : Format d'échange de données
* **LocalStorage** : Persistance des données côté client

### Fonctionnalités Avancées
* **Intelligence Artificielle** : 4 niveaux avec minimax
* **Effets Visuels** : Shaders GLSL, animations CSS3
* **Responsive Design** : Adaptation mobile automatique
* **Internationalisation** : Support multi-langues
* **Analytics** : Tracking des performances et statistiques

## 📷 Fichiers des personnages

Assurez-vous d'avoir ces images dans la racine du projet :
- `asta.jpg` - **Asta** (Black Clover)
- `deku.jpg` - **Izuku Midoriya** (My Hero Academia) 
- `gojo.jpg` - **Satoru Gojo** (Jujutsu Kaisen)
- `goku.jpg` - **Son Goku** (Dragon Ball)
- `ichigo.jpg` - **Ichigo Kurosaki** (Bleach)
- `kaijuu.jpg` - **Kafka Hibino** (Kaiju No. 8)
- `luffy.jpg` - **Monkey D. Luffy** (One Piece)
- `naruto.jpg` - **Naruto Uzumaki** (Naruto)
- `saitama.jpg` - **Saitama** (One Punch Man)

### Formats Supportés
- **Extensions** : `.jpg`, `.jpeg`, `.png`, `.webp`
- **Taille recommandée** : 512x512px minimum
- **Qualité** : Haute résolution pour un rendu optimal

## 🔧 Dépannage

Consultez le fichier `TROUBLESHOOTING.md` pour les solutions aux problèmes courants :
- Problèmes de démarrage du serveur
- Images manquantes
- Problèmes de compatibilité navigateur
- Erreurs de dépendances Python
- Optimisation des performances

## 🚀 Fonctionnalités Déjà Implémentées

### ✅ Complètement Fonctionnelles
- [x] **Intelligence Artificielle** - 4 niveaux de difficulté avec minimax
- [x] **Système Audio** - Sons et musique avec contrôles
- [x] **Optimisation Mobile** - Interface tactile responsive
- [x] **Système de Sauvegarde** - Statistiques et historique persistants
- [x] **Thèmes Multiples** - 5 thèmes visuels avec transitions
- [x] **Système d'Achievements** - Succès et notifications
- [x] **Tutoriel Interactif** - Guide pas à pas
- [x] **Analytics** - Tracking des performances
- [x] **Système de Replay** - Enregistrement et analyse des parties
- [x] **Internationalisation** - Support Français/English/Español
- [x] **Boutons Reset/Rejouer** - Gestion complète des parties

### 🛠️ En Développement Actif
- [ ] **📸 Mode Photo** - Capture d'écran avec filtres
- [ ] **🌈 Shaders Avancés** - Effets visuels WebGL
- [ ] **🤖 IA Machine Learning** - Intelligence artificielle évolutive
- [ ] **🧩 Prédiction de Coups** - Suggestions optimales
- [ ] **🎭 Système de Skins** - Apparences alternatives
- [ ] **👥 Mode Équipe** - Batailles en équipe

### 📅 Améliorations Futures
- [ ] **Mode multijoueur en ligne** - WebSocket et serveur dédié
- [ ] **Plus de personnages** - Extension avec nouveaux animes
- [ ] **Système d'évolution** - Progression et niveaux des personnages
- [ ] **Animations de combat** - Scènes de combat cinématiques
- [ ] **Modes de jeu alternatifs** - Grilles 4x4, 5x5, modes spéciaux
- [ ] **Tournois et classements** - Compétitions online
- [ ] **Boutique virtuelle** - Économie de jeu et objets cosmétiques
- [ ] **Spectateur mode** - Regarder les parties d'autres joueurs

## 🏆 Captures d'Écran

### Interface Principale
![Menu Principal](https://via.placeholder.com/800x600/667eea/ffffff?text=Menu+Principal+Morpion+Otaku)
*Sélection des personnages avec aperçu en temps réel*

### Combat en Action
![Gameplay](https://via.placeholder.com/800x600/764ba2/ffffff?text=Combat+en+Cours)
*Grille de jeu avec barres de vie des personnages*

### Thèmes Disponibles
![Thèmes](https://via.placeholder.com/800x600/e74c3c/ffffff?text=5+Themes+Visuels)
*Classique, Sombre, Océan, Feu, Nature*

## 🤝 Contributions

Les contributions sont les bienvenues ! Voici comment participer :

### Comment Contribuer
1. **Fork** le repository
2. **Créez** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commitez** vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créez** une Pull Request

### Types de Contributions
- 🐛 **Bug fixes** : Correction de bugs et problèmes
- ✨ **Nouvelles fonctionnalités** : Ajout de features innovantes
- 📝 **Documentation** : Amélioration de la documentation
- 🎨 **Design** : Améliorations visuelles et UX
- 🌍 **Traductions** : Support de nouvelles langues
- 🚀 **Optimisations** : Améliorations des performances

## 📜 Licence

Ce projet est open-source sous licence MIT. Vous êtes libre de :
- ✅ Utiliser le code pour des projets personnels et commerciaux
- ✅ Modifier et adapter le code selon vos besoins
- ✅ Distribuer et partager le projet
- ✅ Contribuer au développement

### Crédits
- **Personnages** : Propriété de leurs créateurs respectifs
- **Concept** : Adaptation originale du morpion classique
- **Développement** : Communauté open-source

---

## 🎆 Remerciements

Merci à tous les fans d'anime et développeurs qui ont contribué à ce projet !

**Développé avec ❤️ pour la communauté otaku**

*Que le meilleur personnage gagne ! 🏆*

---

### 📧 Contact & Support

- **Issues** : Signalez les bugs sur GitHub Issues
- **Discussions** : Participez aux discussions communautaires
- **Wiki** : Consultez la documentation étendue
- **Discord** : Rejoignez notre serveur communautaire (bientôt !)
