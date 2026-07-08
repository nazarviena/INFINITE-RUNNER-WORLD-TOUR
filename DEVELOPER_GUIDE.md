# 👨‍💻 Guia do Desenvolvedor - Infinite Runner: World Tour

> **Autor:** MagnorioBR  
> **Versão:** 2.0

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

O jogo é construído em duas plataformas:

1. **Web (Three.js)** - Motor principal, prioridade máxima
2. **Desktop (Unity/C#)** - Build nativo com HDRP

### Diagrama de Classes (Web)

```
Game (Motor Principal)
├── TextureManager      → Geração procedural de texturas
├── WorldGenerator      → Geração de blocos de cidade
│   ├── createCityBlock()   → Cria bloco individual
│   ├── createTree()        → Árvores 3D
│   ├── createLamppost()    → Postes de luz
│   ├── createBench()       → Bancos de praça
│   └── createTrashBin()    → Lixeiras
├── PlayerController    → Controle em primeira pessoa
│   ├── update()            → Loop principal
│   ├── checkCollisions()   → Detecção de colisão
│   └── showDamage()        → Efeito de dano
├── ScoreSystem         → Pontuação exponencial
│   ├── update()            → Verifica marcos
│   └── saveRun()           → Persistência
├── DayNightCycle       → Ciclo dia/noite
├── ParticleSystem      → Partículas (poeira)
└── UIManager           → Interface do usuário
```

---

## 🔧 Classes Detalhadas

### TextureManager

Gerencia todas as texturas do jogo. Usa Canvas 2D para gerar texturas proceduralmente.

```javascript
// Métodos principais
generateAsphalt(seed)      // Textura de asfalto com rachaduras
generateSidewalk(seed)     // Textura de calçada com placas
generateGrass(seed)        // Textura de grama variada
generateBuildingFacade(seed) // Fachada com janelas
generateRoof(seed)         // Telhado com ondulações
getTexture(type, seed)     // Obtém textura por tipo e seed
```

**Sistema Anti-Repetição:**
- Cada bloco tem seed baseada em (bx, bz)
- Seed determina qual variação de textura usar
- Texturas diferentes para cada face de cada prédio
- UV offsets aleatórios para quebrar padrões

### WorldGenerator

Gera blocos de 100x100m com ruas, calçadas, prédios, árvores e mobiliário.

```javascript
createCityBlock(bx, bz)  // Cria bloco completo
update(playerZ)           // Atualiza blocos visíveis
hash(x, z)                // Hash para seed determinística
```

**Estrutura do Bloco:**
```
┌──────────────────────────────────────────┐
│  🏢 Prédios    │🏢│    🏢 Prédios       │
│  🏢            │R │    🏢               │
│  🏢            │U │    🏢               │
├────────────────┤A ├────────────────────┤
│  🌳 Calçada    │  │    Calçada 🌳       │
├────────────────┴──┴────────────────────┤
│              RUA (10m)                  │
├────────────────┬──┬────────────────────┤
│  🌳 Calçada    │  │    Calçada 🌳       │
├────────────────┤  ├────────────────────┤
│  🏢 Prédios    │  │    🏢 Prédios       │
└────────────────┴──┴────────────────────┘
```

### PlayerController

Controla a câmera em primeira pessoa com física.

```javascript
update(delta)          // Atualiza posição e física
checkCollisions()      // Verifica colisões
showDamage()           // Efeito visual de dano
getAverageSpeed()      // Velocidade média
```

**Headbob:** Oscilação da câmera sincronizada com passos usando seno/cosseno.

### ScoreSystem

Sistema de pontuação exponencial.

```javascript
update(distanceMeters)  // Verifica se atingiu próximo marco
saveRun(distanceMeters) // Salva recordes no localStorage
getNextMilestone()      // Retorna próximo marco
```

**Lógica de Marcos:**
```
nextMilestone = 1  (inicial)
Ao atingir 1km → nextMilestone = 2
Ao atingir 2km → nextMilestone = 4
Ao atingir 4km → nextMilestone = 8
...dobrando infinitamente
```

### DayNightCycle

Controla iluminação baseada na distância percorrida.

```javascript
update(distanceMeters)  // Atualiza posição do sol/lua
```

**Regra:** A cada 5km percorridos, avança 1 hora no ciclo diário.

---

## 🎨 Shaders

### terrainBlend.glsl
Mistura 3 texturas (asfalto, calçada, grama) usando blend map:
- Canal R = asfalto
- Canal G = calçada  
- Canal B = grama

### water.glsl
Shader de água para fontes com ondulação animada.

### fog.glsl
Neblina urbana com fade baseado em profundidade.

---

## 🐍 Ferramentas Python

### generate_city_blocks.py
Gera JSON com layout completo da cidade:
- Posições de prédios
- Árvores
- Mobiliário urbano
- Temas de bloco

### create_texture_variations.py
Gera texturas proceduralmente:
- Asfalto (5 variações)
- Calçada (5 variações)
- Grama (3 variações)
- Fachadas (20 variações)
- Telhados (10 variações)

### pack_assets.py
Otimiza assets:
- Converte para .webp
- Gera manifesto JSON
- Verifica integridade

### build_installer.py
Cria arquivo .zip final:
- Remove arquivos temporários
- Compacta tudo
- Verifica integridade

---

## 🔧 Como Estender

### Adicionar Novo Tema de Bloco

1. Em `WorldGenerator.getBlockTheme()`, adicione novo tema
2. Em `createCityBlock()`, adicione lógica específica
3. Adicione texturas correspondentes em `TextureManager`

### Adicionar Novo Tipo de Obstáculo

1. Crie método `createX()` em `WorldGenerator`
2. Adicione ao `createCityBlock()`
3. Adicione verificação em `PlayerController.checkCollisions()`

### Modificar Sistema de Pontuação

Edite `ScoreSystem.update()`:
- Para progressão diferente, mude a lógica de `nextMilestone`
- Para novos tipos de marco, adicione condições

---

## 📊 Otimização

- **InstancedMesh** para objetos repetidos (postes, árvores)
- **Object Pooling** para blocos de cidade
- **Frustum Culling** nativo do Three.js
- **LOD Manual** - objetos distantes com menos detalhes
- **Texturas .webp** para menor tamanho de arquivo

---

## 🐛 Debugging

Ative o console do navegador (F12) para ver:
- Logs de inicialização
- Eventos de marco
- Erros de carregamento

Flags de debug:
```javascript
CONFIG.DEBUG_MODE = true;     // Mostra wireframes
CONFIG.SHOW_BLOCK_BOUNDS = true; // Mostra limites dos blocos
```

---

*© 2026 MagnorioBR - Todos os direitos reservados*
