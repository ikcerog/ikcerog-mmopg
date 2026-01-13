import * as THREE from 'three';
import { World } from './World.js';
import { Player } from './Player.js';
import { NPCManager } from './NPCManager.js';
import { DialogSystem } from './DialogSystem.js';
import { InputManager } from './InputManager.js';

export class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.player = null;
        this.npcManager = null;
        this.dialogSystem = null;
        this.inputManager = null;
        this.clock = new THREE.Clock();
        this.isRunning = false;
    }

    async init() {
        this.updateLoadingProgress(10, 'Initializing renderer...');
        this.setupRenderer();

        this.updateLoadingProgress(20, 'Creating world...');
        this.setupScene();

        this.updateLoadingProgress(40, 'Generating terrain...');
        this.world = new World(this.scene);
        await this.world.generate();

        this.updateLoadingProgress(60, 'Spawning player...');
        this.player = new Player(this.scene, this.camera);

        this.updateLoadingProgress(70, 'Populating NPCs...');
        this.npcManager = new NPCManager(this.scene, this.world);
        this.npcManager.spawnNPCs(20);

        this.updateLoadingProgress(85, 'Loading dialog system...');
        this.dialogSystem = new DialogSystem(this.npcManager);

        this.updateLoadingProgress(95, 'Setting up controls...');
        this.inputManager = new InputManager(this.player, this.dialogSystem);

        this.updateLoadingProgress(100, 'Ready!');

        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            this.isRunning = true;
            this.animate();
        }, 500);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 100, 2000);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        this.camera.position.set(0, 50, 0);

        // Lighting setup - steampunk atmosphere
        const ambientLight = new THREE.AmbientLight(0xffd4a3, 0.4);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
        sunLight.position.set(100, 200, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -500;
        sunLight.shadow.camera.right = 500;
        sunLight.shadow.camera.top = 500;
        sunLight.shadow.camera.bottom = -500;
        sunLight.shadow.camera.far = 1000;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Additional atmospheric lights for steampunk feel
        const warmLight = new THREE.PointLight(0xff8c00, 0.5, 100);
        warmLight.position.set(50, 30, 50);
        this.scene.add(warmLight);
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        if (this.player) {
            this.player.update(delta, this.inputManager);
        }

        if (this.npcManager) {
            this.npcManager.update(delta, this.player.getPosition());
        }

        if (this.dialogSystem) {
            this.dialogSystem.update(this.player.getPosition(), this.npcManager);
        }

        this.updateHUD();
        this.renderer.render(this.scene, this.camera);
    }

    updateHUD() {
        const pos = this.player.getPosition();
        document.getElementById('player-pos').textContent =
            `${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}, ${pos.z.toFixed(0)}`;

        const nearbyNPCs = this.npcManager.getNearbyNPCs(pos, 50);
        document.getElementById('npc-count').textContent = nearbyNPCs.length;
    }

    updateLoadingProgress(percent, text) {
        document.getElementById('progress-fill').style.width = percent + '%';
        document.getElementById('loading-text').textContent = text;
    }

    onResize() {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}
