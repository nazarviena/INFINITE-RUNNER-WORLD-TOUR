// Configuracoes carregaveis do jogo
const GAME_PARAMS = {
  version: "2.0",
  author: "MagnorioBR",
  
  // Ajustes de dificuldade
  difficulty: {
    easy: { speedMultiplier: 0.8, obstacleDensity: 0.5 },
    normal: { speedMultiplier: 1.0, obstacleDensity: 1.0 },
    hard: { speedMultiplier: 1.3, obstacleDensity: 1.5 }
  },
  
  // Temas de cidade
  cityThemes: {
    paris: { buildingColor: [0.8, 0.78, 0.72], roofStyle: "mansard" },
    nyc: { buildingColor: [0.7, 0.7, 0.7], roofStyle: "flat" },
    tokyo: { buildingColor: [0.75, 0.73, 0.7], roofStyle: "modern" },
    london: { buildingColor: [0.75, 0.68, 0.62], roofStyle: "traditional" },
    rio: { buildingColor: [0.85, 0.8, 0.75], roofStyle: "tropical" }
  }
};

export default GAME_PARAMS;
