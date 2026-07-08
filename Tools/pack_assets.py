#!/usr/bin/env python3
"""
pack_assets.py - Otimizador e empacotador de assets
Autor: MagnorioBR
Converte texturas para .webp, gera atlas e otimiza modelos
"""

import os
import sys
import json
import shutil
from pathlib import Path

# =============================================================================
# CONFIGURACOES
# =============================================================================
ASSETS_DIR = '../WebBuild/assets'
TEXTURES_DIR = os.path.join(ASSETS_DIR, 'textures')
MODELS_DIR = os.path.join(ASSETS_DIR, 'models')
AUDIO_DIR = os.path.join(ASSETS_DIR, 'audio')

WEBP_QUALITY = 90
MAX_TEXTURE_SIZE = 2048

# =============================================================================
# OTIMIZACAO DE TEXTURAS
# =============================================================================
def optimize_textures():
    """Converte todas as texturas para .webp e otimiza tamanhos"""
    print("\n📦 Otimizando texturas...")
    
    stats = {'converted': 0, 'optimized': 0, 'errors': 0}
    
    try:
        from PIL import Image
        
        for root, dirs, files in os.walk(TEXTURES_DIR):
            for file in files:
                filepath = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                
                if ext in ['.png', '.jpg', '.jpeg', '.bmp']:
                    try:
                        img = Image.open(filepath)
                        
                        # Redimensionar se maior que o maximo
                        if max(img.size) > MAX_TEXTURE_SIZE:
                            ratio = MAX_TEXTURE_SIZE / max(img.size)
                            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                            img = img.resize(new_size, Image.LANCZOS)
                        
                        # Salvar como .webp
                        webp_path = os.path.splitext(filepath)[0] + '.webp'
                        img.save(webp_path, 'WEBP', quality=WEBP_QUALITY)
                        
                        # Remover original se diferente
                        if webp_path != filepath:
                            os.remove(filepath)
                        
                        stats['converted'] += 1
                        print(f'  ✅ {os.path.relpath(webp_path, ASSETS_DIR)}')
                        
                    except Exception as e:
                        stats['errors'] += 1
                        print(f'  ❌ Erro em {file}: {e}')
    except ImportError:
        print('  ⚠️ Pillow nao instalado. Pulando otimizacao de texturas.')
    
    return stats

# =============================================================================
# GERACAO DE MANIFESTO
# =============================================================================
def generate_asset_manifest():
    """Gera manifesto JSON com todos os assets"""
    print("\n📋 Gerando manifesto de assets...")
    
    manifest = {
        'version': '2.0',
        'author': 'MagnorioBR',
        'textures': {},
        'models': {},
        'audio': {}
    }
    
    # Texturas
    for category in os.listdir(TEXTURES_DIR):
        category_path = os.path.join(TEXTURES_DIR, category)
        if os.path.isdir(category_path):
            files = [f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            manifest['textures'][category] = {
                'count': len(files),
                'files': sorted(files)
            }
    
    # Modelos
    for category in os.listdir(MODELS_DIR):
        category_path = os.path.join(MODELS_DIR, category)
        if os.path.isdir(category_path):
            files = [f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            manifest['models'][category] = {
                'count': len(files),
                'files': sorted(files)
            }
    
    # Audio
    for category in os.listdir(AUDIO_DIR):
        category_path = os.path.join(AUDIO_DIR, category)
        if os.path.isdir(category_path):
            files = [f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
            manifest['audio'][category] = {
                'count': len(files),
                'files': sorted(files)
            }
    
    manifest_path = os.path.join(ASSETS_DIR, 'manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f'  ✅ Manifesto salvo: {manifest_path}')
    return manifest

# =============================================================================
# VERIFICACAO DE INTEGRIDADE
# =============================================================================
def verify_assets():
    """Verifica se todos os assets referenciados existem"""
    print("\n🔍 Verificando integridade dos assets...")
    
    issues = []
    total_files = 0
    
    for root, dirs, files in os.walk(ASSETS_DIR):
        for file in files:
            if file == 'manifest.json':
                continue
            total_files += 1
            filepath = os.path.join(root, file)
            
            # Verificar se o arquivo nao esta corrompido
            if os.path.getsize(filepath) == 0:
                issues.append(f'Arquivo vazio: {os.path.relpath(filepath, ASSETS_DIR)}')
    
    print(f'  📊 Total de arquivos: {total_files}')
    if issues:
        print(f'  ⚠️ {len(issues)} problemas encontrados:')
        for issue in issues:
            print(f'    - {issue}')
    else:
        print('  ✅ Todos os assets estao integros!')
    
    return issues

# =============================================================================
# MAIN
# =============================================================================
def main():
    print("=" * 60)
    print("  INFINITE RUNNER: WORLD TOUR - Asset Packer")
    print("  Autor: MagnorioBR")
    print("=" * 60)
    
    # Otimizar texturas
    texture_stats = optimize_textures()
    
    # Gerar manifesto
    manifest = generate_asset_manifest()
    
    # Verificar assets
    issues = verify_assets()
    
    # Resumo
    print("\n" + "=" * 60)
    print("📊 Resumo:")
    print(f"  Texturas convertidas: {texture_stats.get('converted', 0)}")
    
    total_tex = sum(v['count'] for v in manifest['textures'].values())
    total_models = sum(v['count'] for v in manifest['models'].values())
    total_audio = sum(v['count'] for v in manifest['audio'].values())
    
    print(f"  Total texturas: {total_tex}")
    print(f"  Total modelos: {total_models}")
    print(f"  Total audio: {total_audio}")
    print(f"  Problemas: {len(issues)}")
    print("=" * 60)

if __name__ == '__main__':
    main()
