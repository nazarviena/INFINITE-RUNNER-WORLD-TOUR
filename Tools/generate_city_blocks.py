#!/usr/bin/env python3
"""
generate_city_blocks.py - Gerador de layout de blocos de cidade
Autor: MagnorioBR
Gera JSON com posicoes de ruas, edificios e elementos decorativos
"""

import json
import random
import hashlib
from dataclasses import dataclass, field
from typing import List, Tuple

# =============================================================================
# CONFIGURACOES
# =============================================================================
BLOCK_SIZE = 100       # metros
ROAD_WIDTH = 10        # largura da rua
SIDEWALK_WIDTH = 3     # largura da calcada
BUILDING_MIN_HEIGHT = 8
BUILDING_MAX_HEIGHT = 40
NUM_BLOCKS_AHEAD = 20
NUM_BLOCKS_BEHIND = 3

THEMES = ['urban', 'residential', 'commercial', 'park', 'mixed']

# =============================================================================
# CLASSES DE DADOS
# =============================================================================
@dataclass
class Building:
    x: float
    z: float
    width: float
    depth: float
    height: float
    facade_variant: int
    roof_variant: int
    has_balcony: bool = False
    has_awning: bool = False

@dataclass
class Tree:
    x: float
    z: float
    variant: int
    height: float
    crown_radius: float

@dataclass
class StreetFurniture:
    x: float
    z: float
    f_type: str  # 'bench', 'trash_bin', 'lamp_post', 'hydrant', 'sign'
    rotation: float = 0.0

@dataclass
class CityBlock:
    bx: int
    bz: int
    theme: str
    seed: int
    buildings: List[Building] = field(default_factory=list)
    trees: List[Tree] = field(default_factory=list)
    furniture: List[StreetFurniture] = field(default_factory=list)
    has_crosswalk: bool = False
    has_traffic_light: bool = False

# =============================================================================
# GERADOR
# =============================================================================
class CityBlockGenerator:
    def __init__(self, seed: int = 42):
        self.global_seed = seed
        
    def get_block_seed(self, bx: int, bz: int) -> int:
        """Gera seed deterministica para cada bloco"""
        data = f"{bx},{bz},{self.global_seed}"
        return int(hashlib.sha256(data.encode()).hexdigest()[:8], 16)
    
    def determine_theme(self, bx: int, bz: int, seed: int) -> str:
        """Determina o tema do bloco baseado na posicao"""
        rng = random.Random(seed)
        roll = rng.random()
        
        # Centro urbano mais provavel perto do eixo central
        if abs(bx) <= 0:
            if roll < 0.5: return 'urban'
            if roll < 0.75: return 'commercial'
            if roll < 0.9: return 'mixed'
            return 'park'
        else:
            if roll < 0.3: return 'residential'
            if roll < 0.55: return 'urban'
            if roll < 0.7: return 'commercial'
            if roll < 0.85: return 'mixed'
            return 'park'
    
    def generate_block(self, bx: int, bz: int) -> CityBlock:
        """Gera um bloco completo da cidade"""
        seed = self.get_block_seed(bx, bz)
        rng = random.Random(seed)
        theme = self.determine_theme(bx, bz, seed)
        
        block = CityBlock(bx=bx, bz=bz, theme=theme, seed=seed)
        
        # Predios
        block.buildings = self.generate_buildings(bx, bz, theme, rng)
        
        # Arvores
        block.trees = self.generate_trees(bx, bz, theme, rng)
        
        # Mobiliario urbano
        block.furniture = self.generate_furniture(bx, bz, theme, rng)
        
        # Cruzamentos (a cada 4 blocos)
        if bz % 4 == 0 or bx % 4 == 0:
            block.has_crosswalk = True
            block.has_traffic_light = (bz % 4 == 0 and bx % 4 == 0)
        
        return block
    
    def generate_buildings(self, bx: int, bz: int, theme: str, rng: random.Random) -> List[Building]:
        """Gera predios para um bloco"""
        buildings = []
        BS = BLOCK_SIZE
        RW = ROAD_WIDTH
        SW = SIDEWALK_WIDTH
        
        bldg_zone_start = RW / 2 + SW
        bldg_zone_width = (BS / 2) - bldg_zone_start
        
        for side in [-1, 1]:
            bldg_x = side * (bldg_zone_start + bldg_zone_width / 2)
            
            # Numero de predios baseado no tema
            if theme in ['urban', 'commercial']:
                num_bldgs = rng.randint(1, 2)
            elif theme == 'residential':
                num_bldgs = rng.randint(2, 4)
            else:
                num_bldgs = rng.randint(1, 3)
            
            bldg_width = (BS - rng.randint(4, 8)) / num_bldgs
            
            for b in range(num_bldgs):
                bz_pos = -BS/2 + 2 + b * bldg_width + bldg_width / 2
                
                if theme in ['urban', 'commercial']:
                    height = rng.uniform(15, BUILDING_MAX_HEIGHT)
                elif theme == 'residential':
                    height = rng.uniform(BUILDING_MIN_HEIGHT, 20)
                else:
                    height = rng.uniform(BUILDING_MIN_HEIGHT, 15)
                
                building = Building(
                    x=bldg_x,
                    z=bz_pos,
                    width=bldg_width - 0.5,
                    depth=bldg_zone_width - 0.2,
                    height=height,
                    facade_variant=rng.randint(0, 19),
                    roof_variant=rng.randint(0, 9),
                    has_balcony=rng.random() > 0.7,
                    has_awning=rng.random() > 0.8
                )
                buildings.append(building)
        
        return buildings
    
    def generate_trees(self, bx: int, bz: int, theme: str, rng: random.Random) -> List[Tree]:
        """Gera arvores para as calcadas"""
        trees = []
        BS = BLOCK_SIZE
        RW = ROAD_WIDTH
        SW = SIDEWALK_WIDTH
        
        spacing = 15 if theme == 'park' else rng.uniform(12, 25)
        
        for side in [-1, 1]:
            tree_x = side * (RW / 2 + SW / 2)
            tz = -BS/2 + 5
            
            while tz < BS/2 - 5:
                if rng.random() > 0.3:  # 70% de chance de ter arvore
                    tree = Tree(
                        x=tree_x + rng.uniform(-0.5, 0.5),
                        z=tz + rng.uniform(-2, 2),
                        variant=rng.randint(0, 4),
                        height=rng.uniform(3, 7),
                        crown_radius=rng.uniform(1, 3)
                    )
                    trees.append(tree)
                tz += spacing + rng.uniform(-3, 3)
        
        return trees
    
    def generate_furniture(self, bx: int, bz: int, theme: str, rng: random.Random) -> List[StreetFurniture]:
        """Gera mobiliario urbano"""
        furniture = []
        BS = BLOCK_SIZE
        RW = ROAD_WIDTH
        SW = SIDEWALK_WIDTH
        
        for side in [-1, 1]:
            furn_x = side * (RW / 2 + SW - 1)
            
            # Postes de luz
            for pz in range(int(-BS/2 + 10), int(BS/2 - 10), 25):
                furniture.append(StreetFurniture(
                    x=furn_x, z=pz + rng.uniform(-1, 1),
                    f_type='lamp_post'
                ))
            
            # Bancos e lixeiras
            for pz in range(int(-BS/2 + 8), int(BS/2 - 8), rng.randint(20, 40)):
                if rng.random() > 0.5:
                    furniture.append(StreetFurniture(
                        x=furn_x, z=pz,
                        f_type='bench',
                        rotation=rng.choice([0, 180])
                    ))
                else:
                    furniture.append(StreetFurniture(
                        x=furn_x, z=pz,
                        f_type='trash_bin'
                    ))
            
            # Hidrantes ocasionais
            if rng.random() > 0.7:
                furniture.append(StreetFurniture(
                    x=furn_x + rng.uniform(-1, 1),
                    z=-BS/2 + rng.uniform(15, BS - 15),
                    f_type='hydrant'
                ))
        
        return furniture
    
    def generate_all_blocks(self, num_blocks: int = 50) -> List[dict]:
        """Gera todos os blocos e retorna como lista de dicionarios"""
        blocks = []
        
        for bz in range(-NUM_BLOCKS_BEHIND, NUM_BLOCKS_AHEAD):
            for bx in range(-2, 3):
                block = self.generate_block(bx, bz)
                blocks.append(self.block_to_dict(block))
        
        return blocks
    
    def block_to_dict(self, block: CityBlock) -> dict:
        """Converte bloco para dicionario serializavel"""
        return {
            'bx': block.bx,
            'bz': block.bz,
            'theme': block.theme,
            'seed': block.seed,
            'has_crosswalk': block.has_crosswalk,
            'has_traffic_light': block.has_traffic_light,
            'buildings': [
                {
                    'x': b.x, 'z': b.z,
                    'width': b.width, 'depth': b.depth,
                    'height': b.height,
                    'facade_variant': b.facade_variant,
                    'roof_variant': b.roof_variant,
                    'has_balcony': b.has_balcony,
                    'has_awning': b.has_awning
                }
                for b in block.buildings
            ],
            'trees': [
                {
                    'x': t.x, 'z': t.z,
                    'variant': t.variant,
                    'height': t.height,
                    'crown_radius': t.crown_radius
                }
                for t in block.trees
            ],
            'furniture': [
                {
                    'x': f.x, 'z': f.z,
                    'type': f.f_type,
                    'rotation': f.rotation
                }
                for f in block.furniture
            ]
        }

# =============================================================================
# MAIN
# =============================================================================
def main():
    print("=" * 60)
    print("  INFINITE RUNNER: WORLD TOUR - City Block Generator")
    print("  Autor: MagnorioBR")
    print("=" * 60)
    
    generator = CityBlockGenerator(seed=42)
    blocks = generator.generate_all_blocks(50)
    
    output = {
        'version': '2.0',
        'author': 'MagnorioBR',
        'block_size': BLOCK_SIZE,
        'road_width': ROAD_WIDTH,
        'sidewalk_width': SIDEWALK_WIDTH,
        'num_blocks': len(blocks),
        'blocks': blocks
    }
    
    output_path = '../WebBuild/config/city_layout.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Gerados {len(blocks)} blocos de cidade")
    print(f"📁 Layout salvo em: {output_path}")
    print(f"📊 Temas gerados:")
    
    themes_count = {}
    for b in blocks:
        t = b['theme']
        themes_count[t] = themes_count.get(t, 0) + 1
    
    for theme, count in sorted(themes_count.items()):
        print(f"   - {theme}: {count} blocos")
    
    total_buildings = sum(len(b['buildings']) for b in blocks)
    total_trees = sum(len(b['trees']) for b in blocks)
    total_furniture = sum(len(b['furniture']) for b in blocks)
    
    print(f"\n📊 Total de elementos:")
    print(f"   - {total_buildings} predios")
    print(f"   - {total_trees} arvores")
    print(f"   - {total_furniture} mobiliario urbano")

if __name__ == '__main__':
    main()
