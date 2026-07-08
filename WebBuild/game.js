// =============================================================================
// INFINITE RUNNER: WORLD TOUR - v2.0
// Autor: MagnorioBR
// Email: Magnoriobr@gmail.com
// Todos os direitos reservados (c) 2026
// =============================================================================
// Motor: Three.js r152+ | Fisica: Cannon-es (opcional)
// =============================================================================

import * as THREE from 'three';

// =============================================================================
// CONFIGURACOES GLOBAIS
// =============================================================================
const CONFIG = {
    // Mundo
    BLOCK_SIZE: 100,        // metros por bloco
    ROAD_WIDTH: 10,         // largura da rua (m)
    SIDEWALK_WIDTH: 3,      // largura da calcada (m)
    BUILDING_MIN_HEIGHT: 8,
    BUILDING_MAX_HEIGHT: 40,
    VIEW_DISTANCE: 400,     // metros de renderizacao
    
    // Jogador
    PLAYER_HEIGHT: 1.70,    // altura dos olhos
    BASE_SPEED: 8,          // m/s (corrida base)
    SPRINT_SPEED: 14,       // m/s (sprint)
    MAX_STAMINA: 100,
    STAMINA_DRAIN: 25,      // por segundo
    STAMINA_REGEN: 15,      // por segundo
    
    // Fisica
    GRAVITY: 9.8,
    JUMP_FORCE: 5,
    
    // Headbob
    HEADBOB_AMPLITUDE: 0.04,
    HEADBOB_FREQUENCY: 2.5,
    
    // Dia/Noite
    DAY_DURATION_KM: 5,     // quantos km por hora do dia
};

// =============================================================================
// GERENCIADOR DE TEXTURAS (Canvas-based procedural)
// =============================================================================
class TextureManager {
    constructor() {
        this.textures = {};
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        this.generateAllTextures();
    }
    
    seededRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }
    
    generateAsphalt(seed) {
        const rand = this.seededRandom(seed);
        this.ctx.fillStyle = `rgb(${40 + rand()*20}, ${40 + rand()*20}, ${42 + rand()*20})`;
        this.ctx.fillRect(0, 0, 1024, 1024);
        
        // Textura de asfalto granular
        for (let i = 0; i < 50000; i++) {
            const x = Math.floor(rand() * 1024);
            const y = Math.floor(rand() * 1024);
            const v = 40 + rand() * 25;
            this.ctx.fillStyle = `rgb(${v},${v},${v+2})`;
            this.ctx.fillRect(x, y, 2 + rand()*3, 2 + rand()*3);
        }
        
        // Rachaduras aleatorias
        this.ctx.strokeStyle = 'rgba(20,20,20,0.3)';
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            let x = rand() * 1024, y = rand() * 1024;
            this.ctx.moveTo(x, y);
            for (let j = 0; j < 10; j++) {
                x += (rand() - 0.5) * 200;
                y += (rand() - 0.5) * 200;
                this.ctx.lineTo(x, y);
            }
            this.ctx.lineWidth = 1 + rand() * 2;
            this.ctx.stroke();
        }
        
        // Marcas de pneu
        this.ctx.strokeStyle = 'rgba(30,30,30,0.15)';
        for (let i = 0; i < 8; i++) {
            this.ctx.beginPath();
            let y = rand() * 1024;
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(1024, y + (rand() - 0.5) * 20);
            this.ctx.lineWidth = 3 + rand() * 5;
            this.ctx.stroke();
        }
    }
    
    generateSidewalk(seed) {
        const rand = this.seededRandom(seed);
        const baseR = 180 + rand() * 30;
        const baseG = 175 + rand() * 30;
        const baseB = 170 + rand() * 30;
        this.ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
        this.ctx.fillRect(0, 0, 1024, 1024);
        
        // Grade de placas de concreto
        const tileSize = 128 + rand() * 64;
        for (let x = 0; x < 1024; x += tileSize) {
            for (let y = 0; y < 1024; y += tileSize) {
                const rv = rand() * 20 - 10;
                this.ctx.fillStyle = `rgb(${baseR+rv},${baseG+rv},${baseB+rv})`;
                this.ctx.fillRect(x, y, tileSize - 2, tileSize - 2);
                
                // Juntas
                this.ctx.fillStyle = 'rgba(100,100,100,0.4)';
                this.ctx.fillRect(x + tileSize - 3, y, 3, tileSize);
                this.ctx.fillRect(x, y + tileSize - 3, tileSize, 3);
            }
        }
        
        // Manchas de sujeira
        for (let i = 0; i < 30; i++) {
            const cx = rand() * 1024, cy = rand() * 1024;
            const r = 10 + rand() * 40;
            const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, `rgba(80,75,70,${0.1 + rand()*0.2})`);
            grad.addColorStop(1, 'rgba(80,75,70,0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
    }
    
    generateGrass(seed) {
        const rand = this.seededRandom(seed);
        const baseG = 80 + rand() * 50;
        this.ctx.fillStyle = `rgb(${20+rand()*20},${baseG},${20+rand()*15})`;
        this.ctx.fillRect(0, 0, 1024, 1024);
        
        // Textura de grama fina
        for (let i = 0; i < 80000; i++) {
            const x = rand() * 1024;
            const y = rand() * 1024;
            const g = baseG + rand() * 40;
            this.ctx.fillStyle = `rgb(${15+rand()*25},${g},${15+rand()*20})`;
            this.ctx.fillRect(x, y, 1, 2 + rand() * 4);
        }
        
        // Manchas mais claras/mais escuras
        for (let i = 0; i < 15; i++) {
            const cx = rand() * 1024, cy = rand() * 1024;
            const r = 30 + rand() * 80;
            const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            const shade = rand() > 0.5 ? 'rgba(40,100,30,0.2)' : 'rgba(60,130,40,0.2)';
            grad.addColorStop(0, shade);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
    }
    
    generateBuildingFacade(seed) {
        const rand = this.seededRandom(seed);
        // Cores urbanas variadas
        const palettes = [
            [200, 190, 180], [180, 170, 165], [210, 200, 190],
            [160, 150, 145], [190, 185, 175], [220, 210, 200],
            [170, 160, 155], [195, 188, 178], [205, 195, 185],
            [185, 178, 168], [175, 168, 160], [215, 205, 195],
            [165, 158, 150], [198, 190, 182], [208, 198, 188],
            [188, 180, 172], [178, 170, 162], [202, 192, 184],
            [192, 184, 176], [212, 202, 192]
        ];
        const palette = palettes[Math.floor(rand() * palettes.length)];
        
        this.ctx.fillStyle = `rgb(${palette[0]},${palette[1]},${palette[2]})`;
        this.ctx.fillRect(0, 0, 1024, 1024);
        
        // Janelas
        const windowW = 40 + rand() * 20;
        const windowH = 60 + rand() * 30;
        const spacingX = 20 + rand() * 30;
        const spacingY = 30 + rand() * 40;
        
        for (let x = spacingX; x < 1024 - windowW; x += windowW + spacingX) {
            for (let y = spacingY; y < 1024 - windowH; y += windowH + spacingY) {
                // Moldura
                this.ctx.fillStyle = 'rgba(40,40,40,0.8)';
                this.ctx.fillRect(x - 3, y - 3, windowW + 6, windowH + 6);
                
                // Vidro
                const glassLit = rand() > 0.3;
                if (glassLit) {
                    const warm = 240 + rand() * 15;
                    this.ctx.fillStyle = `rgb(${warm},${warm-40},${warm-80})`;
                } else {
                    this.ctx.fillStyle = `rgb(${30+rand()*20},${35+rand()*20},${40+rand()*20})`;
                }
                this.ctx.fillRect(x, y, windowW, windowH);
                
                // Cruz da janela
                this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
                this.ctx.fillRect(x + windowW/2 - 1, y, 2, windowH);
                this.ctx.fillRect(x, y + windowH/2 - 1, windowW, 2);
                
                // Reflexo
                if (glassLit) {
                    this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    this.ctx.fillRect(x + 2, y + 2, windowW * 0.3, windowH - 4);
                }
            }
        }
        
        // Detalhes de fachada (cornijas, varandas)
        if (rand() > 0.5) {
            for (let y = 200; y < 900; y += 200 + rand() * 100) {
                this.ctx.fillStyle = 'rgba(60,60,60,0.6)';
                this.ctx.fillRect(0, y, 1024, 6 + rand() * 4);
            }
        }
    }
    
    generateRoof(seed) {
        const rand = this.seededRandom(seed);
        const r = 60 + rand() * 40;
        this.ctx.fillStyle = `rgb(${r},${r-5},${r-10})`;
        this.ctx.fillRect(0, 0, 1024, 1024);
        
        // Telhas/ondulacoes
        for (let y = 0; y < 1024; y += 30 + rand() * 20) {
            this.ctx.fillStyle = `rgba(${r+10},${r+5},${r},0.3)`;
            this.ctx.fillRect(0, y, 1024, 15);
            this.ctx.fillStyle = `rgba(${r-10},${r-15},${r-20},0.3)`;
            this.ctx.fillRect(0, y + 15, 1024, 15);
        }
        
        // Manchas
        for (let i = 0; i < 10; i++) {
            const cx = rand() * 1024, cy = rand() * 1024;
            const rad = 20 + rand() * 60;
            const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
            grad.addColorStop(0, `rgba(${r-20},${r-25},${r-30},0.3)`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        }
    }
    
    generateTexture(name, seed, generatorFn) {
        generatorFn.call(this, seed);
        const tex = new THREE.CanvasTexture(this.canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }
    
    generateAllTextures() {
        // Pre-gerar todas as variacoes
        this.textureCache = {};
        for (let i = 0; i < 5; i++) {
            this.textureCache[`asphalt_${i}`] = this.generateTexture('asphalt', 1000 + i, this.generateAsphalt);
        }
        for (let i = 0; i < 5; i++) {
            this.textureCache[`sidewalk_${i}`] = this.generateTexture('sidewalk', 2000 + i, this.generateSidewalk);
        }
        for (let i = 0; i < 3; i++) {
            this.textureCache[`grass_${i}`] = this.generateTexture('grass', 3000 + i, this.generateGrass);
        }
        for (let i = 0; i < 20; i++) {
            this.textureCache[`building_${i}`] = this.generateTexture('building', 4000 + i, this.generateBuildingFacade);
        }
        for (let i = 0; i < 10; i++) {
            this.textureCache[`roof_${i}`] = this.generateTexture('roof', 5000 + i, this.generateRoof);
        }
    }
    
    getTexture(type, seed) {
        if (type === 'asphalt') {
            return this.textureCache[`asphalt_${Math.abs(seed) % 5}`];
        } else if (type === 'sidewalk') {
            return this.textureCache[`sidewalk_${Math.abs(seed) % 5}`];
        } else if (type === 'grass') {
            return this.textureCache[`grass_${Math.abs(seed) % 3}`];
        } else if (type === 'building') {
            return this.textureCache[`building_${Math.abs(seed) % 20}`];
        } else if (type === 'roof') {
            return this.textureCache[`roof_${Math.abs(seed) % 10}`];
        }
        return this.textureCache['asphalt_0'];
    }
}

// =============================================================================
// GERADOR DE MUNDO PROCEDURAL
// =============================================================================
class WorldGenerator {
    constructor(scene, textureManager) {
        this.scene = scene;
        this.tm = textureManager;
        this.blocks = new Map();
        this.blockPool = [];
        this.materials = {};
        this.initMaterials();
    }
    
    hash(x, z) {
        let h = x * 374761393 + z * 668265263;
        h = (h ^ (h >> 13)) * 1274126177;
        return h ^ (h >> 16);
    }
    
    initMaterials() {
        // Sera populado dinamicamente
    }
    
    getBlockKey(bx, bz) {
        return `${bx},${bz}`;
    }
    
    createCityBlock(bx, bz) {
        const seed = this.hash(bx, bz);
        const group = new THREE.Group();
        group.position.set(bx * CONFIG.BLOCK_SIZE, 0, bz * CONFIG.BLOCK_SIZE);
        
        const BS = CONFIG.BLOCK_SIZE;
        const RW = CONFIG.ROAD_WIDTH;
        const SW = CONFIG.SIDEWALK_WIDTH;
        const halfBS = BS / 2;
        const halfRW = RW / 2;
        
        // Determinar tema do bloco baseado na seed
        const rand = this.seededRand(seed);
        const theme = this.getBlockTheme(bx, bz, rand);
        
        // --- RUA PRINCIPAL (atravessa o bloco no eixo Z) ---
        const roadGeo = new THREE.PlaneGeometry(RW, BS);
        const roadTex = this.tm.getTexture('asphalt', seed + 100).clone();
        roadTex.repeat.set(1, BS / RW);
        roadTex.wrapS = THREE.RepeatWrapping;
        roadTex.wrapT = THREE.RepeatWrapping;
        const roadMat = new THREE.MeshStandardMaterial({ 
            map: roadTex, 
            roughness: 0.9, 
            metalness: 0.05,
            color: new THREE.Color(0.9, 0.9, 0.9)
        });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0.01, 0);
        road.receiveShadow = true;
        group.add(road);
        
        // Faixa central da rua
        const lineGeo = new THREE.PlaneGeometry(0.3, BS);
        const lineMat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00, 
            roughness: 0.5, 
            emissive: 0x222200 
        });
        for (let lz = -halfBS; lz < halfBS; lz += 6) {
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.02, lz + 3);
            group.add(line);
        }
        
        // --- CALCADAS ---
        for (let side = -1; side <= 1; side += 2) {
            const sidewalkGeo = new THREE.PlaneGeometry(SW, BS);
            const swTex = this.tm.getTexture('sidewalk', seed + side * 200).clone();
            swTex.repeat.set(1, BS / 3);
            const swMat = new THREE.MeshStandardMaterial({ 
                map: swTex, 
                roughness: 0.7, 
                metalness: 0.0 
            });
            const sidewalk = new THREE.Mesh(sidewalkGeo, swMat);
            sidewalk.rotation.x = -Math.PI / 2;
            sidewalk.position.set(side * (halfRW + SW/2), 0.05, 0);
            sidewalk.receiveShadow = true;
            group.add(sidewalk);
            
            // Meio-fio
            const curbGeo = new THREE.BoxGeometry(0.2, 0.15, BS);
            const curbMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.6 });
            const curb = new THREE.Mesh(curbGeo, curbMat);
            curb.position.set(side * halfRW, 0.08, 0);
            curb.castShadow = true;
            curb.receiveShadow = true;
            group.add(curb);
        }
        
        // --- QUARTEIRÕES (predios) ---
        const bldgZoneStart = halfRW + SW;
        const bldgZoneWidth = (halfBS - bldgZoneStart);
        
        for (let side = -1; side <= 1; side += 2) {
            const bldgX = side * (bldgZoneStart + bldgZoneWidth / 2);
            
            // Dividir em 2-3 predios por lado
            const numBuildings = 2 + Math.floor(Math.abs(rand()) * 2);
            const bldgDepth = bldgZoneWidth;
            const bldgWidth = (BS - 4) / numBuildings;
            
            for (let b = 0; b < numBuildings; b++) {
                const bz = -halfBS + 2 + b * bldgWidth + bldgWidth / 2;
                const height = CONFIG.BUILDING_MIN_HEIGHT + Math.abs(this.seededRand(seed + b * 1000 + side * 500)()) * (CONFIG.BUILDING_MAX_HEIGHT - CONFIG.BUILDING_MIN_HEIGHT);
                
                const bldgGeo = new THREE.BoxGeometry(bldgDepth - 0.2, height, bldgWidth - 0.5);
                const facadeTex = this.tm.getTexture('building', seed + b * 100 + side * 50).clone();
                
                // Ajustar UV para nao repetir
                facadeTex.repeat.set(1, height / (bldgWidth - 0.5));
                facadeTex.offset.y = Math.abs(this.seededRand(seed + b + 999)()) * 0.5;
                
                const bldgMat = new THREE.MeshStandardMaterial({ 
                    map: facadeTex, 
                    roughness: 0.6, 
                    metalness: 0.1 
                });
                const building = new THREE.Mesh(bldgGeo, bldgMat);
                building.position.set(bldgX, height / 2, bz);
                building.castShadow = true;
                building.receiveShadow = true;
                
                // Telhado
                const roofTex = this.tm.getTexture('roof', seed + b * 200 + side * 100).clone();
                roofTex.repeat.set(2, 2);
                const roofGeo = new THREE.PlaneGeometry(bldgDepth - 0.2, bldgWidth - 0.5);
                const roofMat = new THREE.MeshStandardMaterial({ 
                    map: roofTex, 
                    roughness: 0.8 
                });
                const roof = new THREE.Mesh(roofGeo, roofMat);
                roof.rotation.x = -Math.PI / 2;
                roof.position.set(bldgX, height + 0.01, bz);
                group.add(roof);
                
                group.add(building);
            }
        }
        
        // --- ARVORES nas calcadas ---
        for (let side = -1; side <= 1; side += 2) {
            const treeX = side * (halfRW + SW / 2);
            for (let tz = -halfBS + 5; tz < halfBS - 5; tz += 15 + Math.abs(rand()) * 20) {
                const tree = this.createTree(seed + Math.floor(tz * 1000) + side * 3000);
                tree.position.set(treeX, 0, tz);
                group.add(tree);
            }
        }
        
        // --- POSTES DE LUZ ---
        for (let side = -1; side <= 1; side += 2) {
            const postX = side * (halfRW + 0.5);
            for (let pz = -halfBS + 10; pz < halfBS - 10; pz += 25) {
                const post = this.createLamppost(seed + Math.floor(pz * 2000) + side * 5000);
                post.position.set(postX, 0, pz);
                group.add(post);
            }
        }
        
        // --- BANCOS E LIXEIRAS ---
        for (let side = -1; side <= 1; side += 2) {
            const propX = side * (halfRW + SW - 1);
            for (let pz = -halfBS + 8; pz < halfBS - 8; pz += 30 + Math.abs(rand()) * 20) {
                if (Math.abs(rand()) > 0.6) {
                    const bench = this.createBench(seed + Math.floor(pz * 500));
                    bench.position.set(propX, 0, pz);
                    group.add(bench);
                } else {
                    const bin = this.createTrashBin(seed + Math.floor(pz * 700));
                    bin.position.set(propX, 0, pz);
                    group.add(bin);
                }
            }
        }
        
        group.userData = { bx, bz, theme, seed };
        return group;
    }
    
    seededRand(seed) {
        let s = seed;
        return function() {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }
    
    getBlockTheme(bx, bz, rand) {
        const absRand = Math.abs(rand());
        if (absRand < 0.3) return 'urban';
        if (absRand < 0.55) return 'residential';
        if (absRand < 0.7) return 'commercial';
        if (absRand < 0.85) return 'park';
        return 'mixed';
    }
    
    createTree(seed) {
        const rand = this.seededRand(seed);
        const group = new THREE.Group();
        
        // Tronco
        const trunkH = 2 + rand() * 3;
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, trunkH, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.35, 0.2, 0.1), roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkH / 2;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Copa (esferas sobrepostas para variedade)
        const crownBase = trunkH;
        const numSpheres = 2 + Math.floor(rand() * 3);
        const crownColor = new THREE.Color(0.1 + rand() * 0.3, 0.3 + rand() * 0.5, 0.05 + rand() * 0.15);
        
        for (let i = 0; i < numSpheres; i++) {
            const r = 0.8 + rand() * 1.2;
            const crownGeo = new THREE.SphereGeometry(r, 8, 6);
            const crownMat = new THREE.MeshStandardMaterial({ color: crownColor, roughness: 0.8 });
            const crown = new THREE.Mesh(crownGeo, crownMat);
            crown.position.set(
                (rand() - 0.5) * 1.5,
                crownBase + 0.5 + rand() * 1.5,
                (rand() - 0.5) * 1.5
            );
            crown.castShadow = true;
            group.add(crown);
        }
        
        return group;
    }
    
    createLamppost(seed) {
        const group = new THREE.Group();
        
        // Poste
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 6, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.8 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 3;
        pole.castShadow = true;
        group.add(pole);
        
        // Braco
        const armGeo = new THREE.BoxGeometry(1.5, 0.1, 0.1);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.position.set(0, 5.8, 0);
        group.add(arm);
        
        // Lampada
        const bulbGeo = new THREE.SphereGeometry(0.25, 8, 4);
        const bulbMat = new THREE.MeshStandardMaterial({ 
            color: 0xffffee, 
            emissive: 0x444433, 
            roughness: 0.3 
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0.8, 5.8, 0);
        group.add(bulb);
        
        return group;
    }
    
    createBench(seed) {
        const group = new THREE.Group();
        const woodColor = new THREE.Color(0.4, 0.25, 0.15);
        const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.7 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.9 });
        
        // Pernas
        for (let l = -1; l <= 1; l += 2) {
            const legGeo = new THREE.BoxGeometry(0.05, 0.7, 0.05);
            const leg = new THREE.Mesh(legGeo, metalMat);
            leg.position.set(l * 0.8, 0.35, 0);
            group.add(leg);
        }
        
        // Assento
        const seatGeo = new THREE.BoxGeometry(1.8, 0.08, 0.4);
        const seat = new THREE.Mesh(seatGeo, woodMat);
        seat.position.y = 0.74;
        group.add(seat);
        
        // Encosto
        const backGeo = new THREE.BoxGeometry(1.8, 0.5, 0.05);
        const back = new THREE.Mesh(backGeo, woodMat);
        back.position.set(0, 1, -0.18);
        group.add(back);
        
        return group;
    }
    
    createTrashBin(seed) {
        const group = new THREE.Group();
        const binGeo = new THREE.CylinderGeometry(0.25, 0.2, 1, 8);
        const binMat = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(0.2, 0.5, 0.2), 
            roughness: 0.5, 
            metalness: 0.6 
        });
        const bin = new THREE.Mesh(binGeo, binMat);
        bin.position.y = 0.5;
        bin.castShadow = true;
        group.add(bin);
        return group;
    }
    
    update(playerZ) {
        const playerBZ = Math.floor(playerZ / CONFIG.BLOCK_SIZE);
        const range = Math.ceil(CONFIG.VIEW_DISTANCE / CONFIG.BLOCK_SIZE) + 1;
        
        // Gerar novos blocos
        const neededBlocks = new Set();
        for (let bz = playerBZ - range; bz <= playerBZ + range; bz++) {
            for (let bx = -2; bx <= 2; bx++) {
                neededBlocks.add(this.getBlockKey(bx, bz));
            }
        }
        
        // Remover blocos distantes
        for (const [key, block] of this.blocks) {
            if (!neededBlocks.has(key)) {
                this.scene.remove(block);
                this.blockPool.push(block);
            }
            neededBlocks.delete(key);
        }
        
        // Criar novos blocos
        for (const key of neededBlocks) {
            const [bx, bz] = key.split(',').map(Number);
            const block = this.createCityBlock(bx, bz);
            this.scene.add(block);
            this.blocks.set(key, block);
        }
    }
}

// =============================================================================
// CONTROLADOR DO JOGADOR (Primeira Pessoa)
// =============================================================================
class PlayerController {
    constructor(camera) {
        this.camera = camera;
        this.camera.position.set(0, CONFIG.PLAYER_HEIGHT, 0);
        
        this.speed = 0;            // velocidade atual m/s
        this.targetSpeed = 0;
        this.lateralOffset = 0;    // desvio A/D
        this.targetLateral = 0;
        this.distance = 0;         // distancia total percorrida
        this.stamina = CONFIG.MAX_STAMINA;
        this.isSprinting = false;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.verticalOffset = 0;
        this.health = 100;
        this.alive = true;
        
        // Headbob
        this.headbobTimer = 0;
        this.headbobBaseY = CONFIG.PLAYER_HEIGHT;
        
        // Input
        this.keys = {};
        this.setupInput();
        
        // Velocidade media
        this.speedHistory = [];
        this.lastTime = performance.now();
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'shift') this.isSprinting = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            if (e.key.toLowerCase() === 'shift') this.isSprinting = false;
        });
    }
    
    update(delta) {
        if (!this.alive) return;
        
        const dt = Math.min(delta, 0.1); // cap para evitar saltos
        
        // Velocidade alvo
        if (this.keys['w']) {
            this.targetSpeed = this.isSprinting && this.stamina > 0 ? CONFIG.SPRINT_SPEED : CONFIG.BASE_SPEED;
        } else if (this.keys['s']) {
            this.targetSpeed = Math.max(0, this.speed - 5 * dt);
        } else {
            // Desacelerar naturalmente se parar de correr
            this.targetSpeed = Math.max(0, this.speed - 2 * dt);
        }
        
        // Stamina
        if (this.isSprinting && this.keys['w'] && this.speed > CONFIG.BASE_SPEED) {
            this.stamina = Math.max(0, this.stamina - CONFIG.STAMINA_DRAIN * dt);
            if (this.stamina <= 0) this.isSprinting = false;
        } else {
            this.stamina = Math.min(CONFIG.MAX_STAMINA, this.stamina + CONFIG.STAMINA_REGEN * dt);
        }
        
        // Suavizar velocidade
        this.speed += (this.targetSpeed - this.speed) * Math.min(5 * dt, 1);
        
        // Distancia
        this.distance += this.speed * dt;
        
        // Movimento lateral
        if (this.keys['a']) this.targetLateral = -3;
        else if (this.keys['d']) this.targetLateral = 3;
        else this.targetLateral = 0;
        this.lateralOffset += (this.targetLateral - this.lateralOffset) * Math.min(8 * dt, 1);
        
        // Pulo
        if (this.keys[' '] && !this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = CONFIG.JUMP_FORCE;
        }
        
        if (this.isJumping) {
            this.jumpVelocity -= CONFIG.GRAVITY * dt;
            this.verticalOffset += this.jumpVelocity * dt;
            if (this.verticalOffset <= 0) {
                this.verticalOffset = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
        
        // Headbob
        if (this.speed > 1) {
            this.headbobTimer += dt * CONFIG.HEADBOB_FREQUENCY * (this.speed / CONFIG.BASE_SPEED);
        }
        const headbobY = Math.sin(this.headbobTimer * Math.PI * 2) * CONFIG.HEADBOB_AMPLITUDE * Math.min(this.speed / CONFIG.BASE_SPEED, 1.5);
        const headbobX = Math.cos(this.headbobTimer * Math.PI) * CONFIG.HEADBOB_AMPLITUDE * 0.5;
        
        // Atualizar posicao da camera
        const totalZ = this.distance;
        this.camera.position.set(
            this.lateralOffset + headbobX,
            this.headbobBaseY + this.verticalOffset + headbobY,
            totalZ
        );
        
        // Verificar colisoes com predios
        this.checkCollisions();
        
        // Historico de velocidade
        this.speedHistory.push(this.speed);
        if (this.speedHistory.length > 120) this.speedHistory.shift();
    }
    
    checkCollisions() {
        const px = this.camera.position.x;
        const pz = this.camera.position.z;
        const RW = CONFIG.ROAD_WIDTH / 2;
        
        // Colisao com predios (laterais da rua)
        const buildingZone = RW + CONFIG.SIDEWALK_WIDTH;
        if (Math.abs(px) > buildingZone + 0.5) {
            // Colidiu com predio
            this.speed *= 0.7;
            this.camera.position.x = Math.sign(px) * buildingZone;
            this.health -= 15;
            this.lateralOffset = this.camera.position.x;
            this.targetLateral = this.camera.position.x;
            this.showDamage();
            
            if (this.health <= 0) {
                this.alive = false;
                this.speed = 0;
            }
        }
        
        // Tambem verificar arvores/postes (zona da calcada)
        if (Math.abs(px) > RW && Math.abs(px) < buildingZone) {
            const BS = CONFIG.BLOCK_SIZE;
            const localZ = ((pz % BS) + BS) % BS;
            // Verificar se ha arvore proxima (simplificado)
            for (let tz = 5; tz < BS - 5; tz += 17) {
                if (Math.abs(localZ - tz) < 0.6 && Math.abs(px) > RW + 1) {
                    this.speed *= 0.8;
                    this.health -= 5;
                    this.showDamage();
                    break;
                }
            }
        }
    }
    
    showDamage() {
        const flash = document.createElement('div');
        flash.className = 'damage-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
    }
    
    getAverageSpeed() {
        if (this.speedHistory.length === 0) return 0;
        return this.speedHistory.reduce((a, b) => a + b, 0) / this.speedHistory.length;
    }
}

// =============================================================================
// SISTEMA DE PONTUACAO EXPONENCIAL
// =============================================================================
class ScoreSystem {
    constructor() {
        this.bestDistance = parseFloat(localStorage.getItem('irwt_bestDistance') || '0');
        this.bestMilestone = parseFloat(localStorage.getItem('irwt_bestMilestone') || '0');
        this.totalDistance = parseFloat(localStorage.getItem('irwt_totalDistance') || '0');
        this.gamesPlayed = parseInt(localStorage.getItem('irwt_gamesPlayed') || '0');
        
        this.currentMilestones = [];
        this.nextMilestone = 1; // em km (1, 2, 4, 8, ...)
        this.lastMilestoneReached = 0;
    }
    
    update(distanceMeters) {
        const distanceKm = distanceMeters / 1000;
        
        // Verificar se atingiu o proximo marco
        if (distanceKm >= this.nextMilestone) {
            const milestone = this.nextMilestone;
            this.currentMilestones.push(milestone);
            this.lastMilestoneReached = milestone;
            
            // Proximo marco: dobra
            this.nextMilestone *= 2;
            
            // Salvar recorde
            if (milestone > this.bestMilestone) {
                this.bestMilestone = milestone;
                localStorage.setItem('irwt_bestMilestone', this.bestMilestone.toString());
            }
            
            return milestone;
        }
        return null;
    }
    
    saveRun(distanceMeters) {
        const distanceKm = distanceMeters / 1000;
        
        if (distanceKm > this.bestDistance) {
            this.bestDistance = distanceKm;
            localStorage.setItem('irwt_bestDistance', this.bestDistance.toString());
        }
        
        this.totalDistance += distanceKm;
        localStorage.setItem('irwt_totalDistance', this.totalDistance.toString());
        
        this.gamesPlayed++;
        localStorage.setItem('irwt_gamesPlayed', this.gamesPlayed.toString());
    }
    
    getNextMilestone() {
        return this.nextMilestone;
    }
}

// =============================================================================
// SISTEMA DE CICLO DIA/NOITE
// =============================================================================
class DayNightCycle {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.timeOfDay = 8; // Comeca as 8:00
        this.dayProgress = 0;
        
        this.setupLighting();
    }
    
    setupLighting() {
        // Luz direcional (sol)
        this.sunLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
        this.sunLight.position.set(50, 80, 30);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 200;
        this.sunLight.shadow.camera.left = -50;
        this.sunLight.shadow.camera.right = 50;
        this.sunLight.shadow.camera.top = 50;
        this.sunLight.shadow.camera.bottom = -50;
        this.scene.add(this.sunLight);
        
        // Luz ambiente
        this.ambientLight = new THREE.AmbientLight(0x404060, 0.4);
        this.scene.add(this.ambientLight);
        
        // Hemisfere light (ceu/solo)
        this.hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x362907, 0.3);
        this.scene.add(this.hemiLight);
    }
    
    update(distanceMeters) {
        // A cada 5km, avanca 1 hora
        const hoursPassed = distanceMeters / (CONFIG.DAY_DURATION_KM * 1000);
        this.timeOfDay = (8 + hoursPassed) % 24;
        
        // Normalizar para 0-1 (ciclo completo)
        const dayCycle = this.timeOfDay / 24;
        this.dayProgress = dayCycle;
        
        // Ajustar iluminacao
        const sunAngle = dayCycle * Math.PI * 2;
        const sunHeight = Math.sin(sunAngle);
        const sunX = Math.cos(sunAngle) * 100;
        
        this.sunLight.position.set(sunX, sunHeight * 100, 30);
        
        const isDaytime = sunHeight > -0.1;
        const intensity = Math.max(0.05, sunHeight + 0.2);
        
        this.sunLight.intensity = intensity * 2;
        this.ambientLight.intensity = Math.max(0.1, intensity * 0.4);
        
        // Cores do ceu
        if (isDaytime) {
            this.scene.background = new THREE.Color(
                0.3 + sunHeight * 0.3,
                0.5 + sunHeight * 0.3,
                0.8 + sunHeight * 0.2
            );
            this.scene.fog = new THREE.Fog(
                new THREE.Color(0.7, 0.75, 0.8),
                50, CONFIG.VIEW_DISTANCE
            );
        } else {
            const nightFactor = Math.abs(sunHeight);
            this.scene.background = new THREE.Color(
                0.02 + nightFactor * 0.05,
                0.02 + nightFactor * 0.05,
                0.08 + nightFactor * 0.1
            );
            this.scene.fog = new THREE.Fog(
                new THREE.Color(0.02, 0.02, 0.05),
                20, CONFIG.VIEW_DISTANCE * 0.7
            );
        }
    }
}

// =============================================================================
// GERENCIADOR DE PARTICULAS
// =============================================================================
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.setup();
    }
    
    setup() {
        // Poeira da corrida
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 200;
        const dustPositions = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount; i++) {
            dustPositions[i * 3] = (Math.random() - 0.5) * 10;
            dustPositions[i * 3 + 1] = Math.random() * 0.5;
            dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        const dustMat = new THREE.PointsMaterial({
            color: 0xccbbaa,
            size: 0.1,
            transparent: true,
            opacity: 0.4,
            blending: THREE.NormalBlending,
            depthWrite: false
        });
        this.dust = new THREE.Points(dustGeo, dustMat);
        this.scene.add(this.dust);
    }
    
    update(playerPos, speed) {
        this.dust.position.copy(playerPos);
        this.dust.position.y = 0.1;
        this.dust.material.opacity = Math.min(0.6, speed / CONFIG.BASE_SPEED * 0.4);
    }
}

// =============================================================================
// GERENCIADOR DE UI
// =============================================================================
class UIManager {
    constructor() {
        this.elements = {
            loading: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            loadingText: document.getElementById('loading-text'),
            mainMenu: document.getElementById('main-menu'),
            records: document.getElementById('records-screen'),
            settings: document.getElementById('settings-screen'),
            hud: document.getElementById('game-hud'),
            hudDistance: document.getElementById('hud-distance'),
            hudNextMilestone: document.getElementById('hud-next-milestone'),
            hudRecord: document.getElementById('hud-record'),
            hudSpeed: document.getElementById('hud-speed'),
            staminaBar: document.getElementById('stamina-bar'),
            milestoneOverlay: document.getElementById('milestone-overlay'),
            milestoneValue: document.getElementById('milestone-value'),
            pause: document.getElementById('pause-screen'),
            gameover: document.getElementById('gameover-screen'),
            goDistance: document.getElementById('go-distance'),
            goMilestone: document.getElementById('go-milestone'),
            goMilestonesCount: document.getElementById('go-milestones-count'),
            goAvgSpeed: document.getElementById('go-avg-speed'),
            bestDistance: document.getElementById('best-distance'),
            bestMilestone: document.getElementById('best-milestone'),
            totalDistance: document.getElementById('total-distance'),
            gamesPlayed: document.getElementById('games-played'),
        };
    }
    
    showLoading(percent, text) {
        this.elements.loading.style.display = 'flex';
        this.elements.loadingBar.style.width = percent + '%';
        this.elements.loadingText.textContent = text;
    }
    
    hideLoading() {
        this.elements.loading.style.display = 'none';
    }
    
    showMainMenu() {
        this.elements.mainMenu.style.display = 'flex';
        this.elements.hud.style.display = 'none';
        this.elements.gameover.style.display = 'none';
        this.elements.pause.style.display = 'none';
    }
    
    hideMainMenu() {
        this.elements.mainMenu.style.display = 'none';
    }
    
    showHUD() {
        this.elements.hud.style.display = 'block';
    }
    
    hideHUD() {
        this.elements.hud.style.display = 'none';
    }
    
    updateHUD(distance, nextMilestone, record, speed, stamina) {
        this.elements.hudDistance.textContent = (distance / 1000).toFixed(2) + ' km';
        this.elements.hudNextMilestone.textContent = nextMilestone + ' km';
        this.elements.hudRecord.textContent = record.toFixed(1) + ' km';
        this.elements.hudSpeed.textContent = Math.round(speed * 3.6) + ' km/h';
        this.elements.staminaBar.style.width = stamina + '%';
        
        // Cor da stamina
        if (stamina < 25) {
            this.elements.staminaBar.style.background = 'linear-gradient(90deg, #f44336, #ff9800)';
        } else if (stamina < 50) {
            this.elements.staminaBar.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
        } else {
            this.elements.staminaBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        }
    }
    
    showMilestone(km) {
        this.elements.milestoneValue.textContent = km + ' km';
        this.elements.milestoneOverlay.style.display = 'flex';
        this.elements.milestoneOverlay.style.animation = 'none';
        this.elements.milestoneOverlay.offsetHeight; // reflow
        this.elements.milestoneOverlay.style.animation = 'milestoneFadeIn 2s ease-out forwards';
        setTimeout(() => {
            this.elements.milestoneOverlay.style.display = 'none';
        }, 2000);
    }
    
    showPause() {
        this.elements.pause.style.display = 'flex';
    }
    
    hidePause() {
        this.elements.pause.style.display = 'none';
    }
    
    showGameOver(distance, milestone, milestonesCount, avgSpeed) {
        this.elements.goDistance.textContent = (distance / 1000).toFixed(2) + ' km';
        this.elements.goMilestone.textContent = milestone + ' km';
        this.elements.goMilestonesCount.textContent = milestonesCount;
        this.elements.goAvgSpeed.textContent = Math.round(avgSpeed * 3.6) + ' km/h';
        this.elements.gameover.style.display = 'flex';
        this.elements.hud.style.display = 'none';
    }
    
    hideGameOver() {
        this.elements.gameover.style.display = 'none';
    }
    
    showRecords(scoreSystem) {
        this.elements.bestDistance.textContent = scoreSystem.bestDistance.toFixed(2) + ' km';
        this.elements.bestMilestone.textContent = scoreSystem.bestMilestone + ' km';
        this.elements.totalDistance.textContent = scoreSystem.totalDistance.toFixed(2) + ' km';
        this.elements.gamesPlayed.textContent = scoreSystem.gamesPlayed;
        this.elements.records.style.display = 'flex';
    }
    
    hideRecords() {
        this.elements.records.style.display = 'none';
    }
    
    showSettings() {
        this.elements.settings.style.display = 'flex';
    }
    
    hideSettings() {
        this.elements.settings.style.display = 'none';
    }
}

// =============================================================================
// MOTOR PRINCIPAL DO JOGO
// =============================================================================
class Game {
    constructor() {
        this.state = 'loading'; // loading, menu, playing, paused, gameover
        this.isPaused = false;
        
        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Sistemas
        this.textureManager = null;
        this.worldGenerator = null;
        this.player = null;
        this.scoreSystem = null;
        this.dayNight = null;
        this.particles = null;
        this.ui = null;
        
        // Tempo
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        
        this.init();
    }
    
    async init() {
        this.ui = new UIManager();
        this.ui.showLoading(0, 'Inicializando motor grafico...');
        
        await this.sleep(100);
        
        // Criar cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0xCCDDFF, 50, CONFIG.VIEW_DISTANCE);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            CONFIG.VIEW_DISTANCE + 100
        );
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        this.ui.showLoading(20, 'Gerando texturas...');
        await this.sleep(50);
        
        // Texturas
        this.textureManager = new TextureManager();
        
        this.ui.showLoading(50, 'Construindo mundo...');
        await this.sleep(50);
        
        // Mundo
        this.worldGenerator = new WorldGenerator(this.scene, this.textureManager);
        
        this.ui.showLoading(70, 'Configurando iluminacao...');
        await this.sleep(50);
        
        // Dia/Noite
        this.dayNight = new DayNightCycle(this.scene, this.renderer);
        
        // Particulas
        this.particles = new ParticleSystem(this.scene);
        
        this.ui.showLoading(85, 'Preparando controles...');
        await this.sleep(50);
        
        // Jogador
        this.player = new PlayerController(this.camera);
        
        // Pontuacao
        this.scoreSystem = new ScoreSystem();
        
        this.ui.showLoading(100, 'Pronto!');
        await this.sleep(300);
        
        this.ui.hideLoading();
        this.state = 'menu';
        this.ui.showMainMenu();
        
        this.setupMenuEvents();
        this.setupResizeHandler();
        
        // Iniciar loop
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    setupMenuEvents() {
        document.getElementById('btn-run').addEventListener('click', () => this.startGame());
        document.getElementById('btn-records').addEventListener('click', () => {
            this.ui.hideMainMenu();
            this.ui.showRecords(this.scoreSystem);
        });
        document.getElementById('btn-settings').addEventListener('click', () => {
            this.ui.hideMainMenu();
            this.ui.showSettings();
        });
        document.getElementById('btn-back-records').addEventListener('click', () => {
            this.ui.hideRecords();
            this.ui.showMainMenu();
        });
        document.getElementById('btn-back-settings').addEventListener('click', () => {
            this.ui.hideSettings();
            this.ui.showMainMenu();
        });
        document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
        document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
        document.getElementById('btn-quit').addEventListener('click', () => this.quitToMenu());
        document.getElementById('btn-retry').addEventListener('click', () => this.restartGame());
        document.getElementById('btn-go-menu').addEventListener('click', () => this.quitToMenu());
        
        // ESC para pausar
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === 'playing') {
                    this.pauseGame();
                } else if (this.state === 'paused') {
                    this.resumeGame();
                }
            }
        });
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    startGame() {
        this.ui.hideMainMenu();
        this.ui.hideRecords();
        this.ui.hideSettings();
        this.ui.hideGameOver();
        this.ui.showHUD();
        
        // Resetar sistemas
        this.resetGame();
        
        this.state = 'playing';
        this.lastFrameTime = performance.now();
    }
    
    resetGame() {
        // Limpar mundo antigo
        if (this.worldGenerator) {
            for (const [key, block] of this.worldGenerator.blocks) {
                this.scene.remove(block);
            }
            this.worldGenerator.blocks.clear();
        }
        
        // Resetar jogador
        this.player = new PlayerController(this.camera);
        
        // Resetar pontuacao
        this.scoreSystem.currentMilestones = [];
        this.scoreSystem.nextMilestone = 1;
        this.scoreSystem.lastMilestoneReached = 0;
        
        // Resetar dia
        this.dayNight.timeOfDay = 8;
    }
    
    pauseGame() {
        this.state = 'paused';
        this.isPaused = true;
        this.ui.showPause();
    }
    
    resumeGame() {
        this.state = 'playing';
        this.isPaused = false;
        this.ui.hidePause();
        this.lastFrameTime = performance.now();
    }
    
    restartGame() {
        this.ui.hidePause();
        this.ui.hideGameOver();
        this.startGame();
    }
    
    quitToMenu() {
        this.state = 'menu';
        this.isPaused = false;
        this.ui.hidePause();
        this.ui.hideGameOver();
        this.ui.hideHUD();
        
        // Salvar estatisticas se estava jogando
        if (this.player && this.player.distance > 0) {
            this.scoreSystem.saveRun(this.player.distance);
        }
        
        this.ui.showMainMenu();
    }
    
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        const now = performance.now();
        this.deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;
        
        if (this.state === 'playing' && !this.isPaused) {
            const dt = this.deltaTime;
            
            // Atualizar jogador
            this.player.update(dt);
            
            // Atualizar mundo
            this.worldGenerator.update(this.player.distance);
            
            // Atualizar pontuacao
            const milestone = this.scoreSystem.update(this.player.distance);
            if (milestone) {
                this.ui.showMilestone(milestone);
            }
            
            // Atualizar dia/noite
            this.dayNight.update(this.player.distance);
            
            // Atualizar particulas
            this.particles.update(this.camera.position, this.player.speed);
            
            // Atualizar HUD
            this.ui.updateHUD(
                this.player.distance,
                this.scoreSystem.getNextMilestone(),
                this.scoreSystem.bestDistance,
                this.player.speed,
                this.player.stamina
            );
            
            // Verificar game over
            if (!this.player.alive) {
                this.gameOver();
            }
        }
        
        // Renderizar sempre
        this.renderer.render(this.scene, this.camera);
    }
    
    gameOver() {
        this.state = 'gameover';
        this.scoreSystem.saveRun(this.player.distance);
        this.ui.showGameOver(
            this.player.distance,
            this.scoreSystem.lastMilestoneReached,
            this.scoreSystem.currentMilestones.length,
            this.player.getAverageSpeed()
        );
    }
}

// =============================================================================
// INICIALIZACAO
// =============================================================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('%c🏃 Infinite Runner: World Tour v2.0 %c| MagnorioBR %c| (c) 2026',
        'color:#ff6b35;font-size:1.2em;', 'color:#f7c948;', 'color:#888;');
    console.log('%c🌐 Motor: Three.js | Corrida Infinita em Primeira Pessoa',
        'color:#aaa;');
    console.log('%c📧 Contato: Magnoriobr@gmail.com', 'color:#666;');
    
    window.game = new Game();
});
