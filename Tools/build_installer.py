#!/usr/bin/env python3
"""
build_installer.py - Script de build e empacotamento final
Autor: MagnorioBR
Gera o arquivo .zip final com todo o projeto
"""

import os
import sys
import shutil
import zipfile
from datetime import datetime
from pathlib import Path

# =============================================================================
# CONFIGURACOES
# =============================================================================
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD_NAME = 'InfiniteRunnerWorldTour_MagnorioBR_v2.0'
EXCLUDE_PATTERNS = [
    '__pycache__', '*.pyc', '.git', '.github', '.DS_Store',
    '*.tmp', '*.log', '.vscode', '.idea', 'node_modules',
    '*.blend1', '*.blend2', 'Thumbs.db'
]

# =============================================================================
# BUILD
# =============================================================================
def should_exclude(path):
    """Verifica se o arquivo deve ser excluido"""
    name = os.path.basename(path)
    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith('*'):
            if name.endswith(pattern[1:]):
                return True
        elif pattern in path or name == pattern:
            return True
    return False

def create_zip():
    """Cria o arquivo .zip final"""
    print("=" * 60)
    print("  INFINITE RUNNER: WORLD TOUR - Build Installer")
    print("  Autor: MagnorioBR")
    print("=" * 60)
    
    output_dir = os.path.join(PROJECT_ROOT, '..')
    zip_path = os.path.join(output_dir, f'{BUILD_NAME}.zip')
    temp_dir = os.path.join(output_dir, f'{BUILD_NAME}_temp')
    
    # Limpar builds anteriores
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    
    print(f'\n📦 Criando build: {BUILD_NAME}')
    
    # Copiar arquivos para diretorio temporario
    files_copied = 0
    total_size = 0
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Filtrar diretorios
        dirs[:] = [d for d in dirs if not should_exclude(os.path.join(root, d))]
        
        for file in files:
            filepath = os.path.join(root, file)
            if should_exclude(filepath):
                continue
            
            rel_path = os.path.relpath(filepath, PROJECT_ROOT)
            dest_path = os.path.join(temp_dir, BUILD_NAME, rel_path)
            
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(filepath, dest_path)
            
            files_copied += 1
            total_size += os.path.getsize(filepath)
    
    print(f'  ✅ {files_copied} arquivos copiados ({total_size / 1024 / 1024:.1f} MB)')
    
    # Criar ZIP
    print(f'\n🗜️ Compactando...')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        temp_root = os.path.join(temp_dir, BUILD_NAME)
        for root, dirs, files in os.walk(temp_root):
            for file in files:
                filepath = os.path.join(root, file)
                arcname = os.path.relpath(filepath, temp_dir)
                zf.write(filepath, arcname)
    
    zip_size = os.path.getsize(zip_path)
    print(f'  ✅ ZIP criado: {zip_path}')
    print(f'  📦 Tamanho: {zip_size / 1024 / 1024:.1f} MB')
    
    # Limpar diretorio temporario
    shutil.rmtree(temp_dir)
    
    # Verificar ZIP
    print(f'\n🔍 Verificando integridade do ZIP...')
    with zipfile.ZipFile(zip_path, 'r') as zf:
        bad = zf.testzip()
        if bad:
            print(f'  ❌ Arquivo corrompido: {bad}')
        else:
            print(f'  ✅ ZIP integro!')
    
    print(f'\n{"=" * 60}')
    print(f'✅ BUILD CONCLUIDO COM SUCESSO!')
    print(f'📁 Arquivo: {zip_path}')
    print(f'📧 Enviar para: Magnoriobr@gmail.com')
    print(f'{"=" * 60}')
    
    return zip_path

if __name__ == '__main__':
    create_zip()
