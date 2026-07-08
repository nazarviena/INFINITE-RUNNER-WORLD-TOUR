#!/usr/bin/env python3
"""
create_texture_variations.py - Gerador de variacoes de textura procedural
Autor: MagnorioBR
Cria texturas com ruido/desgaste para asfalto, calcada, grama e fachadas
"""

import os
import sys
import math
import random
import hashlib
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

# =============================================================================
# CONFIGURACOES
# =============================================================================
TEXTURE_SIZE = 1024  # resolucao base
OUTPUT_DIR = '../WebBuild/assets/textures'
VARIATIONS = {
    'asphalt': 5,
    'sidewalk': 5,
    'grass': 3,
    'buildings': 20,
    'roofs': 10
}

# =============================================================================
# GERADOR DE RUIDO SIMPLES
# =============================================================================
def seeded_random(seed):
    """Gerador pseudoaleatorio com seed"""
    state = seed
    while True:
        state = (state * 16807 + 0) % 2147483647
        yield (state - 1) / 2147483646

def perlin_noise_2d(x, y, seed=0):
    """Noise 2D simplificado para texturas"""
    n = int(x + y * 57 + seed)
    n = (n << 13) ^ n
    return 1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0

def generate_noise_map(size, scale=8, seed=0):
    """Gera mapa de ruido 2D"""
    noise = np.zeros((size, size), dtype=np.float32)
    for y in range(size):
        for x in range(size):
            nx = x / size * scale
            ny = y / size * scale
            noise[y, x] = perlin_noise_2d(nx, ny, seed)
    # Normalizar
    noise = (noise - noise.min()) / (noise.max() - noise.min())
    return noise

# =============================================================================
# GERADORES DE TEXTURA
# =============================================================================
def create_asphalt_texture(variant=0, seed=0):
    """Textura de asfalto com desgaste"""
    img = Image.new('RGB', (TEXTURE_SIZE, TEXTURE_SIZE), (55, 55, 57))
    draw = ImageDraw.Draw(img)
    rng = random.Random(seed + variant * 1000)
    
    # Base granular
    pixels = img.load()
    noise = generate_noise_map(TEXTURE_SIZE, 16, seed + variant)
    
    for y in range(TEXTURE_SIZE):
        for x in range(TEXTURE_SIZE):
            n = noise[y, x]
            v = int(40 + n * 30)
            pixels[x, y] = (v, v, v + 2)
    
    # Rachaduras
    for _ in range(3 + variant % 3):
        x, y = rng.randint(0, TEXTURE_SIZE), rng.randint(0, TEXTURE_SIZE)
        for _ in range(rng.randint(10, 30)):
            nx = x + rng.randint(-20, 20)
            ny = y + rng.randint(-20, 20)
            if 0 <= nx < TEXTURE_SIZE and 0 <= ny < TEXTURE_SIZE:
                draw.line([(x, y), (nx, ny)], fill=(30, 30, 30), width=1 + variant % 3)
            x, y = nx, ny
    
    # Marcas de pneu
    for _ in range(5 + variant % 4):
        y = rng.randint(0, TEXTURE_SIZE)
        for x in range(0, TEXTURE_SIZE, rng.randint(50, 200)):
            ly = y + rng.randint(-3, 3)
            if 0 <= ly < TEXTURE_SIZE and x < TEXTURE_SIZE:
                draw.line([(x, ly), (min(x + rng.randint(30, 100), TEXTURE_SIZE), ly)], 
                         fill=(40, 40, 40), width=2 + rng.randint(1, 4))
    
    # Manchas de oleo
    for _ in range(2 + variant % 3):
        cx, cy = rng.randint(100, TEXTURE_SIZE-100), rng.randint(100, TEXTURE_SIZE-100)
        for _ in range(20):
            r = rng.randint(20, 80)
            nx = cx + rng.randint(-r, r)
            ny = cy + rng.randint(-r, r)
            if 0 <= nx < TEXTURE_SIZE and 0 <= ny < TEXTURE_SIZE:
                draw.ellipse([nx-r//2, ny-r//2, nx+r//2, ny+r//2], 
                           fill=(25, 25, 30, 100))
    
    return img

def create_sidewalk_texture(variant=0, seed=0):
    """Textura de calcada com placas de concreto"""
    base_color = (190 + variant * 8, 185 + variant * 7, 180 + variant * 7)
    img = Image.new('RGB', (TEXTURE_SIZE, TEXTURE_SIZE), base_color)
    draw = ImageDraw.Draw(img)
    rng = random.Random(seed + variant * 2000)
    
    tile_size = 128 + variant * 16
    
    # Placas de concreto
    for x in range(0, TEXTURE_SIZE, tile_size):
        for y in range(0, TEXTURE_SIZE, tile_size):
            shade = rng.randint(-10, 10)
            color = (base_color[0] + shade, base_color[1] + shade, base_color[2] + shade)
            draw.rectangle([x, y, x + tile_size - 2, y + tile_size - 2], fill=color)
            # Juntas
            draw.rectangle([x + tile_size - 3, y, x + tile_size, y + tile_size], 
                         fill=(120, 120, 120))
            draw.rectangle([x, y + tile_size - 3, x + tile_size, y + tile_size], 
                         fill=(120, 120, 120))
    
    # Sujeira
    for _ in range(20 + variant * 5):
        cx, cy = rng.randint(0, TEXTURE_SIZE), rng.randint(0, TEXTURE_SIZE)
        r = rng.randint(10, 50)
        for dx in range(-r, r):
            for dy in range(-r, r):
                if dx*dx + dy*dy <= r*r:
                    px, py = cx + dx, cy + dy
                    if 0 <= px < TEXTURE_SIZE and 0 <= py < TEXTURE_SIZE:
                        p = img.getpixel((px, py))
                        dark = rng.randint(0, 15)
                        img.putpixel((px, py), 
                                   (max(0, p[0]-dark), max(0, p[1]-dark), max(0, p[2]-dark)))
    
    return img

def create_grass_texture(variant=0, seed=0):
    """Textura de grama variada"""
    base_g = 90 + variant * 30
    img = Image.new('RGB', (TEXTURE_SIZE, TEXTURE_SIZE), (30, base_g, 25))
    pixels = img.load()
    rng = random.Random(seed + variant * 3000)
    noise = generate_noise_map(TEXTURE_SIZE, 12, seed + variant * 3000)
    
    for y in range(TEXTURE_SIZE):
        for x in range(TEXTURE_SIZE):
            n = noise[y, x]
            g = base_g + int(n * 50) - 25
            pixels[x, y] = (20 + int(n * 20), max(10, g), 18 + int(n * 15))
    
    # Manchas claras/escuras
    for _ in range(10 + variant * 3):
        cx, cy = rng.randint(0, TEXTURE_SIZE), rng.randint(0, TEXTURE_SIZE)
        r = rng.randint(30, 100)
        for dx in range(-r, r):
            for dy in range(-r, r):
                if dx*dx + dy*dy <= r*r:
                    px, py = cx + dx, cy + dy
                    if 0 <= px < TEXTURE_SIZE and 0 <= py < TEXTURE_SIZE:
                        p = pixels[px, py]
                        f = 1.0 - (dx*dx + dy*dy) / (r*r)
                        shift = int(15 * f) * (1 if rng.random() > 0.5 else -1)
                        pixels[px, py] = (
                            max(0, min(255, p[0] + shift//2)),
                            max(0, min(255, p[1] + shift)),
                            max(0, min(255, p[2] + shift//2))
                        )
    
    return img

def create_building_facade(variant=0, seed=0):
    """Textura de fachada de predio com janelas"""
    palettes = [
        (200, 190, 180), (180, 170, 165), (210, 200, 190),
        (160, 150, 145), (190, 185, 175), (220, 210, 200),
        (170, 160, 155), (195, 188, 178), (205, 195, 185),
        (185, 178, 168), (175, 168, 160), (215, 205, 195),
        (165, 158, 150), (198, 190, 182), (208, 198, 188),
        (188, 180, 172), (178, 170, 162), (202, 192, 184),
        (192, 184, 176), (212, 202, 192)
    ]
    
    palette = palettes[variant % len(palettes)]
    img = Image.new('RGB', (TEXTURE_SIZE, TEXTURE_SIZE), palette)
    draw = ImageDraw.Draw(img)
    rng = random.Random(seed + variant * 4000)
    
    window_w = 40 + variant * 3
    window_h = 60 + variant * 4
    spacing_x = 20 + variant * 2
    spacing_y = 30 + variant * 3
    
    for x in range(spacing_x, TEXTURE_SIZE - window_w, window_w + spacing_x):
        for y in range(spacing_y, TEXTURE_SIZE - window_h, window_h + spacing_y):
            # Moldura
            draw.rectangle([x-3, y-3, x+window_w+3, y+window_h+3], fill=(50, 50, 55))
            
            # Vidro
            if rng.random() > 0.3:  # luz acesa
                warm = rng.randint(230, 255)
                draw.rectangle([x, y, x+window_w, y+window_h], 
                             fill=(warm, warm-40, warm-80))
            else:
                draw.rectangle([x, y, x+window_w, y+window_h], 
                             fill=(35 + rng.randint(0, 20), 40 + rng.randint(0, 20), 
                                   45 + rng.randint(0, 20)))
            
            # Cruz
            draw.line([(x + window_w//2, y), (x + window_w//2, y + window_h)], 
                     fill=(30, 30, 30), width=2)
            draw.line([(x, y + window_h//2), (x + window_w, y + window_h//2)], 
                     fill=(30, 30, 30), width=2)
    
    # Cornijas
    if variant % 3 == 0:
        for y_line in range(150, TEXTURE_SIZE - 150, 150 + variant * 20):
            draw.rectangle([0, y_line, TEXTURE_SIZE, y_line + 8 + variant % 5], 
                         fill=(70, 70, 75))
    
    return img

def create_roof_texture(variant=0, seed=0):
    """Textura de telhado"""
    base = 70 + variant * 5
    img = Image.new('RGB', (TEXTURE_SIZE, TEXTURE_SIZE), (base, base-5, base-10))
    draw = ImageDraw.Draw(img)
    rng = random.Random(seed + variant * 5000)
    
    # Linhas de telha
    tile_h = 25 + variant * 3
    for y in range(0, TEXTURE_SIZE, tile_h):
        shade = rng.randint(-8, 8)
        color = (base + shade, base - 5 + shade, base - 10 + shade)
        draw.rectangle([0, y, TEXTURE_SIZE, y + tile_h//2], fill=color)
        color2 = (base - 8 + shade, base - 13 + shade, base - 18 + shade)
        draw.rectangle([0, y + tile_h//2, TEXTURE_SIZE, y + tile_h], fill=color2)
    
    # Manchas
    for _ in range(5 + variant):
        cx, cy = rng.randint(100, TEXTURE_SIZE-100), rng.randint(100, TEXTURE_SIZE-100)
        r = rng.randint(30, 80)
        for dx in range(-r, r):
            for dy in range(-r, r):
                if dx*dx + dy*dy <= r*r:
                    px, py = cx + dx, cy + dy
                    if 0 <= px < TEXTURE_SIZE and 0 <= py < TEXTURE_SIZE:
                        p = img.getpixel((px, py))
                        dark = rng.randint(0, 10)
                        img.putpixel((px, py), 
                                   (max(0, p[0]-dark), max(0, p[1]-dark), max(0, p[2]-dark)))
    
    return img

# =============================================================================
# MAIN
# =============================================================================
def main():
    print("=" * 60)
    print("  INFINITE RUNNER: WORLD TOUR - Texture Generator")
    print("  Autor: MagnorioBR")
    print("=" * 60)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    generators = {
        'asphalt': (create_asphalt_texture, 'asphalt'),
        'sidewalk': (create_sidewalk_texture, 'sidewalk'),
        'grass': (create_grass_texture, 'grass'),
        'buildings': (create_building_facade, 'buildings'),
        'roofs': (create_roof_texture, 'roofs')
    }
    
    total = 0
    for category, count in VARIATIONS.items():
        if category not in generators:
            continue
        
        gen_fn, folder = generators[category]
        category_dir = os.path.join(OUTPUT_DIR, folder)
        os.makedirs(category_dir, exist_ok=True)
        
        for variant in range(count):
            img = gen_fn(variant)
            filename = f'{folder}_v{variant:02d}.webp'
            filepath = os.path.join(category_dir, filename)
            img.save(filepath, 'WEBP', quality=90)
            total += 1
            print(f'  ✅ {filepath}')
    
    print(f'\n🎨 Total de texturas geradas: {total}')
    print(f'📁 Local: {os.path.abspath(OUTPUT_DIR)}')

if __name__ == '__main__':
    main()
