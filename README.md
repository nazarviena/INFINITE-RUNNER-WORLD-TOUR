# 🏃 Infinite Runner: World Tour v4.0

**Autor:** MagnorioBR | **Email:** Magnoriobr@gmail.com
**© 2026 Todos os direitos reservados**

---

## 🎮 Sobre

Corrida infinita em PRIMEIRA PESSOA por cidades turísticas com:
- 🗺️ Geração procedural infinita
- 🎨 Texturas realistas sem repetição
- ⏱️ Distância e tempo baseados na VIDA REAL (1km = 1km)
- 🏆 Sistema de marcos exponenciais (1→2→4→8→16... km)
- 🌧️ Sistema de clima dinâmico (sol, chuva, chão molhado)
- 🌅 Ciclo dia/noite com iluminação dinâmica
- 🔊 Áudio procedural (passos, respiração, ambiente)
- 📊 Ranking local automático
- 📱 Responsivo (desktop e mobile)

---

## 🚀 Como Jogar

### GitHub Pages (recomendado)
1. Faça upload deste repositório para o GitHub
2. Ative GitHub Pages em Settings → Pages → branch `main` → `/ (root)`
3. Acesse: `https://SEU_USER.github.io/InfiniteRunnerWorldTour/`

### Localmente
```bash
cd WebBuild/
python3 -m http.server 8080
# Abra http://localhost:8080
```

---

## 🎯 Controles

| Ação | Desktop | Mobile |
|------|---------|--------|
| Correr | W | Toque na tela |
| Desviar | A / D | Botões ◀ ▶ |
| Sprint | Shift | Botão SPRINT |
| Pular | Espaço | Botão PULAR |
| Pausa | ESC | - |

---

## 📊 Sistema de Pontuação

Marcos dobram exponencialmente:

| Marco | Distância | Tempo (corrida) |
|-------|-----------|-----------------|
| 🥉 1º | 1 km | ~7min30s |
| 🥈 2º | 2 km | ~15min |
| 🥇 3º | 4 km | ~30min |
| 💎 4º | 8 km | ~1h |
| ⭐ 5º | 16 km | ~2h |
| 🌟 6º | 32 km | ~4h |
| ... | ...do brando... | |

---

## 🛠️ Tecnologias

- **Three.js** r152+ (WebGL)
- **Web Audio API** (áudio procedural)
- **Canvas 2D** (texturas procedurais)
- **100% estático** — HTML/CSS/JS puro

---

## 📁 Estrutura

```
/
├── index.html          ← Página principal
├── game.js             ← Motor do jogo (695 linhas)
├── style.css           ← Estilos responsivos
├── ranking.js          ← Sistema de ranking local
├── firebase-config.js  ← Config Firebase (opcional)
├── shaders/            ← Shaders GLSL
├── config/             ← Parâmetros
├── README.md           ← Este arquivo
├── LICENSE             ← Direitos reservados
└── CREDITS.txt         ← Créditos
```

---

## ⚖️ Licença

**Todos os direitos reservados - MagnorioBR © 2026**

Não é permitida redistribuição ou uso comercial sem autorização.

---

📧 **Magnoriobr@gmail.com**
