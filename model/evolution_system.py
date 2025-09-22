"""
Evolution and Special Attacks System for Morpion Otaku Battle
Advanced combat mechanics with character progression
"""
import random
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class SpecialAttack:
    """Special attack definition"""
    name: str
    description: str
    damage_multiplier: float
    energy_cost: int
    effect: str
    animation: str
    cooldown: int


@dataclass
class RandomEvent:
    """Random combat event"""
    name: str
    description: str
    effect_type: str
    value: float
    duration: int
    rarity: float  # 0.0 to 1.0


class EvolutionSystem:
    """Manages character evolution and progression"""
    
    def __init__(self):
        self.special_attacks = self.initialize_special_attacks()
        self.random_events = self.initialize_random_events()
        
    def initialize_special_attacks(self) -> Dict[str, SpecialAttack]:
        """Initialize special attacks for each character"""
        return {
            'asta': SpecialAttack(
                name="Anti-Magic Sword",
                description="Annule les défenses de l'adversaire",
                damage_multiplier=1.5,
                energy_cost=3,
                effect="ignore_defense",
                animation="slash_wave",
                cooldown=3
            ),
            'deku': SpecialAttack(
                name="Detroit Smash",
                description="Attaque dévastatrice mais coûteuse en vie",
                damage_multiplier=2.0,
                energy_cost=4,
                effect="self_damage",
                animation="lightning_punch",
                cooldown=4
            ),
            'gojo': SpecialAttack(
                name="Hollow Purple",
                description="Attaque qui ignore l'espace et les défenses",
                damage_multiplier=2.5,
                energy_cost=5,
                effect="true_damage",
                animation="void_sphere",
                cooldown=5
            ),
            'goku': SpecialAttack(
                name="Kamehameha",
                description="Vague d'énergie surpuissante",
                damage_multiplier=1.8,
                energy_cost=4,
                effect="energy_blast",
                animation="beam_attack",
                cooldown=4
            ),
            'ichigo': SpecialAttack(
                name="Getsuga Tensho",
                description="Lame d'énergie spirituelle",
                damage_multiplier=1.7,
                energy_cost=3,
                effect="spiritual_damage",
                animation="crescent_wave",
                cooldown=3
            ),
            'kaijuu': SpecialAttack(
                name="Kaiju Transformation",
                description="Augmente temporairement toutes les stats",
                damage_multiplier=1.3,
                energy_cost=5,
                effect="stat_boost",
                animation="transformation",
                cooldown=6
            ),
            'luffy': SpecialAttack(
                name="Gear Fourth",
                description="Mode élastique ultime",
                damage_multiplier=1.6,
                energy_cost=4,
                effect="multi_hit",
                animation="elastic_barrage",
                cooldown=4
            ),
            'naruto': SpecialAttack(
                name="Rasengan",
                description="Sphère d'énergie tourbillonnante",
                damage_multiplier=1.4,
                energy_cost=3,
                effect="chakra_drain",
                animation="spiral_sphere",
                cooldown=3
            ),
            'saitama': SpecialAttack(
                name="Serious Punch",
                description="Un coup sérieux qui termine tout",
                damage_multiplier=10.0,
                energy_cost=10,
                effect="instant_ko",
                animation="serious_punch",
                cooldown=10
            )
        }
    
    def initialize_random_events(self) -> List[RandomEvent]:
        """Initialize random combat events"""
        return [
            RandomEvent(
                name="Burst d'Adrénaline",
                description="Le combattant gagne en vitesse et force",
                effect_type="stat_boost",
                value=0.3,
                duration=3,
                rarity=0.15
            ),
            RandomEvent(
                name="Moment de Faiblesse",
                description="Baisse temporaire des défenses",
                effect_type="defense_reduction",
                value=0.2,
                duration=2,
                rarity=0.1
            ),
            RandomEvent(
                name="Regain d'Énergie",
                description="Récupération d'énergie pour les attaques spéciales",
                effect_type="energy_restore",
                value=2.0,
                duration=1,
                rarity=0.2
            ),
            RandomEvent(
                name="Rage du Guerrier",
                description="Les dégâts augmentent mais les défenses baissent",
                effect_type="berserker",
                value=0.5,
                duration=4,
                rarity=0.05
            ),
            RandomEvent(
                name="Concentration Parfaite",
                description="Précision et dégâts critiques augmentés",
                effect_type="critical_boost",
                value=0.4,
                duration=3,
                rarity=0.12
            ),
            RandomEvent(
                name="Coup de Chance",
                description="Prochaine attaque automatiquement critique",
                effect_type="guaranteed_crit",
                value=1.0,
                duration=1,
                rarity=0.08
            )
        ]
    
    def check_for_random_event(self) -> Optional[RandomEvent]:
        """Check if a random event should occur"""
        if random.random() < 0.25:  # 25% chance per turn
            available_events = [e for e in self.random_events if random.random() < e.rarity]
            if available_events:
                return random.choice(available_events)
        return None


class EnhancedPersonnage:
    """Enhanced character class with evolution system"""
    
    def __init__(self, nom: str, image: str, force: int, defense: int, vie: int):
        # Base stats
        self.nom = nom
        self.image = image
        self.base_force = force
        self.base_defense = defense
        self.base_vie = vie
        
        # Current stats (affected by evolution)
        self.force = force
        self.defense = defense
        self.vie = vie
        self.vie_max = vie
        
        # Evolution system
        self.level = 1
        self.experience = 0
        self.experience_to_next_level = 100
        
        # Special attacks system
        self.energy = 5
        self.max_energy = 5
        self.special_cooldowns = {}
        
        # Active effects
        self.active_effects = []
        self.skin = "default"
        
        # Combat stats
        self.battles_won = 0
        self.total_damage_dealt = 0
        self.total_damage_taken = 0
    
    def gain_experience(self, amount: int) -> bool:
        """Gain experience and check for level up"""
        self.experience += amount
        
        if self.experience >= self.experience_to_next_level:
            return self.level_up()
        return False
    
    def level_up(self) -> bool:
        """Level up the character"""
        if self.level >= 10:  # Max level
            return False
            
        self.level += 1
        self.experience -= self.experience_to_next_level
        self.experience_to_next_level = int(self.experience_to_next_level * 1.2)
        
        # Stat increases
        force_increase = max(1, self.base_force // 10)
        defense_increase = max(1, self.base_defense // 10)
        vie_increase = max(5, self.base_vie // 10)
        
        self.base_force += force_increase
        self.base_defense += defense_increase
        self.base_vie += vie_increase
        
        # Update current stats
        self.force = self.base_force
        self.defense = self.base_defense
        old_vie_max = self.vie_max
        self.vie_max = self.base_vie
        
        # Heal proportionally
        if old_vie_max > 0:
            health_percentage = self.vie / old_vie_max
            self.vie = int(self.vie_max * health_percentage)
        
        # Increase max energy every 2 levels
        if self.level % 2 == 0:
            self.max_energy += 1
            self.energy = self.max_energy
        
        return True
    
    def can_use_special_attack(self, attack_name: str) -> bool:
        """Check if character can use special attack"""
        evolution_system = EvolutionSystem()
        if attack_name not in evolution_system.special_attacks:
            return False
            
        attack = evolution_system.special_attacks[attack_name]
        
        # Check energy
        if self.energy < attack.energy_cost:
            return False
            
        # Check cooldown
        if attack_name in self.special_cooldowns and self.special_cooldowns[attack_name] > 0:
            return False
            
        return True
    
    def use_special_attack(self, attack_name: str, target: 'EnhancedPersonnage') -> Dict[str, Any]:
        """Use special attack on target"""
        evolution_system = EvolutionSystem()
        if not self.can_use_special_attack(attack_name):
            return {"success": False, "reason": "Cannot use attack"}
            
        attack = evolution_system.special_attacks[attack_name]
        
        # Consume energy
        self.energy -= attack.energy_cost
        
        # Set cooldown
        self.special_cooldowns[attack_name] = attack.cooldown
        
        # Calculate damage
        base_damage = max(1, self.force - target.defense)
        special_damage = int(base_damage * attack.damage_multiplier)
        
        # Apply special effects
        effect_result = self.apply_special_effect(attack, target, special_damage)
        
        return {
            "success": True,
            "attack": attack,
            "damage": effect_result.get("damage", special_damage),
            "effects": effect_result.get("effects", []),
            "animation": attack.animation
        }
    
    def apply_special_effect(self, attack: SpecialAttack, target: 'EnhancedPersonnage', damage: int) -> Dict[str, Any]:
        """Apply special attack effects"""
        effects = []
        final_damage = damage
        
        if attack.effect == "ignore_defense":
            final_damage = int(self.force * attack.damage_multiplier)
            effects.append("Défenses ignorées!")
            
        elif attack.effect == "self_damage":
            self_damage = int(self.vie_max * 0.1)
            self.vie = max(1, self.vie - self_damage)
            effects.append(f"Auto-dégâts: {self_damage}")
            
        elif attack.effect == "true_damage":
            final_damage = int(self.force * attack.damage_multiplier)
            effects.append("Dégâts absolus!")
            
        elif attack.effect == "stat_boost":
            self.force = int(self.force * 1.3)
            self.defense = int(self.defense * 1.3)
            effects.append("Stats augmentées!")
            
        elif attack.effect == "instant_ko":
            if target.vie <= target.vie_max * 0.5:  # Only if target is below 50% HP
                final_damage = target.vie
                effects.append("K.O. INSTANTANÉ!")
        
        target.vie = max(0, target.vie - final_damage)
        return {"damage": final_damage, "effects": effects}
    
    def update_cooldowns(self):
        """Update special attack cooldowns"""
        for attack_name in list(self.special_cooldowns.keys()):
            self.special_cooldowns[attack_name] = max(0, self.special_cooldowns[attack_name] - 1)
            if self.special_cooldowns[attack_name] == 0:
                del self.special_cooldowns[attack_name]
    
    def restore_energy(self, amount: int = 1):
        """Restore energy each turn"""
        self.energy = min(self.max_energy, self.energy + amount)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'nom': self.nom,
            'image': self.image,
            'force': self.force,
            'defense': self.defense,
            'vie': self.vie,
            'vie_max': self.vie_max,
            'level': self.level,
            'experience': self.experience,
            'experience_to_next_level': self.experience_to_next_level,
            'energy': self.energy,
            'max_energy': self.max_energy,
            'special_cooldowns': self.special_cooldowns,
            'skin': self.skin,
            'battles_won': self.battles_won
        }