import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.chunkSize = 500; // meters per chunk
        this.worldSize = 4; // 4x4 chunks = 2km x 2km = 4 sq km
        this.structures = [];
    }

    async generate() {
        // Generate terrain chunks
        for (let x = 0; x < this.worldSize; x++) {
            for (let z = 0; z < this.worldSize; z++) {
                const chunkX = (x - this.worldSize / 2) * this.chunkSize;
                const chunkZ = (z - this.worldSize / 2) * this.chunkSize;
                this.createChunk(chunkX, chunkZ);
            }
        }

        // Add steampunk structures
        this.generateSteampunkStructures();
    }

    createChunk(offsetX, offsetZ) {
        const geometry = new THREE.PlaneGeometry(
            this.chunkSize,
            this.chunkSize,
            50,
            50
        );
        geometry.rotateX(-Math.PI / 2);

        // Apply procedural height variation
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            const height = this.getTerrainHeight(x + offsetX, z + offsetZ);
            positions.setY(i, height);
        }
        geometry.computeVertexNormals();

        // Steampunk-themed terrain material
        const material = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9,
            metalness: 0.1,
            flatShading: false
        });

        const chunk = new THREE.Mesh(geometry, material);
        chunk.position.set(offsetX, 0, offsetZ);
        chunk.receiveShadow = true;
        this.scene.add(chunk);

        const key = `${offsetX}_${offsetZ}`;
        this.chunks.set(key, chunk);
    }

    getTerrainHeight(x, z) {
        // Multi-octave noise simulation
        let height = 0;
        height += Math.sin(x * 0.01) * 5;
        height += Math.cos(z * 0.01) * 5;
        height += Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2;
        height += Math.sin((x + z) * 0.02) * 3;
        return height;
    }

    generateSteampunkStructures() {
        const structureCount = 30;

        for (let i = 0; i < structureCount; i++) {
            const x = (Math.random() - 0.5) * this.chunkSize * this.worldSize;
            const z = (Math.random() - 0.5) * this.chunkSize * this.worldSize;
            const y = this.getTerrainHeight(x, z);

            const type = Math.floor(Math.random() * 4);

            switch (type) {
                case 0:
                    this.createClockTower(x, y, z);
                    break;
                case 1:
                    this.createFactoryBuilding(x, y, z);
                    break;
                case 2:
                    this.createSteamPipe(x, y, z);
                    break;
                case 3:
                    this.createGearStatue(x, y, z);
                    break;
            }
        }

        // Add scattered props
        this.generateScatteredProps();
    }

    createClockTower(x, y, z) {
        const group = new THREE.Group();

        // Tower base
        const baseGeometry = new THREE.BoxGeometry(15, 40, 15);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b4423,
            metalness: 0.3,
            roughness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 20;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Clock face
        const clockGeometry = new THREE.CylinderGeometry(6, 6, 2, 32);
        const clockMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });
        const clock = new THREE.Mesh(clockGeometry, clockMaterial);
        clock.rotation.x = Math.PI / 2;
        clock.position.set(0, 30, 8);
        clock.castShadow = true;
        group.add(clock);

        // Spire
        const spireGeometry = new THREE.ConeGeometry(5, 15, 8);
        const spireMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6914,
            metalness: 0.7,
            roughness: 0.3
        });
        const spire = new THREE.Mesh(spireGeometry, spireMaterial);
        spire.position.y = 47;
        spire.castShadow = true;
        group.add(spire);

        group.position.set(x, y, z);
        this.scene.add(group);
        this.structures.push({ type: 'clocktower', position: new THREE.Vector3(x, y, z), group });
    }

    createFactoryBuilding(x, y, z) {
        const group = new THREE.Group();

        // Main building
        const buildingGeometry = new THREE.BoxGeometry(30, 25, 20);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            metalness: 0.5,
            roughness: 0.6
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = 12.5;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Smokestacks
        for (let i = 0; i < 3; i++) {
            const stackGeometry = new THREE.CylinderGeometry(2, 2.5, 20, 16);
            const stackMaterial = new THREE.MeshStandardMaterial({
                color: 0x2a2a2a,
                metalness: 0.7,
                roughness: 0.4
            });
            const stack = new THREE.Mesh(stackGeometry, stackMaterial);
            stack.position.set((i - 1) * 8, 35, 0);
            stack.castShadow = true;
            group.add(stack);
        }

        group.position.set(x, y, z);
        this.scene.add(group);
        this.structures.push({ type: 'factory', position: new THREE.Vector3(x, y, z), group });
    }

    createSteamPipe(x, y, z) {
        const group = new THREE.Group();

        const pipeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 30, 16);
        const pipeMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            metalness: 0.8,
            roughness: 0.3
        });

        const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe1.rotation.z = Math.PI / 2;
        pipe1.position.set(15, 5, 0);
        pipe1.castShadow = true;
        group.add(pipe1);

        // Valve
        const valveGeometry = new THREE.TorusGeometry(2, 0.5, 16, 32);
        const valveMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            metalness: 0.9,
            roughness: 0.2
        });
        const valve = new THREE.Mesh(valveGeometry, valveMaterial);
        valve.rotation.y = Math.PI / 2;
        valve.position.set(0, 5, 0);
        valve.castShadow = true;
        group.add(valve);

        group.position.set(x, y, z);
        this.scene.add(group);
        this.structures.push({ type: 'pipe', position: new THREE.Vector3(x, y, z), group });
    }

    createGearStatue(x, y, z) {
        const group = new THREE.Group();

        // Large gear
        const gearGeometry = new THREE.CylinderGeometry(8, 8, 3, 12);
        const gearMaterial = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.9,
            roughness: 0.2
        });
        const gear = new THREE.Mesh(gearGeometry, gearMaterial);
        gear.position.y = 10;
        gear.castShadow = true;
        group.add(gear);

        // Teeth
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const toothGeometry = new THREE.BoxGeometry(2, 3, 1);
            const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
            tooth.position.set(
                Math.cos(angle) * 9,
                10,
                Math.sin(angle) * 9
            );
            tooth.rotation.y = angle;
            tooth.castShadow = true;
            group.add(tooth);
        }

        // Support pillar
        const pillarGeometry = new THREE.CylinderGeometry(2, 2, 10, 16);
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            metalness: 0.6,
            roughness: 0.5
        });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.y = 5;
        pillar.castShadow = true;
        group.add(pillar);

        group.position.set(x, y, z);
        this.scene.add(group);
        this.structures.push({ type: 'gear', position: new THREE.Vector3(x, y, z), group });
    }

    generateScatteredProps() {
        const propCount = 100;
        const crate = new THREE.BoxGeometry(3, 3, 3);
        const crateMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.9
        });

        for (let i = 0; i < propCount; i++) {
            const x = (Math.random() - 0.5) * this.chunkSize * this.worldSize;
            const z = (Math.random() - 0.5) * this.chunkSize * this.worldSize;
            const y = this.getTerrainHeight(x, z);

            const prop = new THREE.Mesh(crate, crateMaterial);
            prop.position.set(x, y + 1.5, z);
            prop.rotation.y = Math.random() * Math.PI * 2;
            prop.castShadow = true;
            prop.receiveShadow = true;
            this.scene.add(prop);
        }
    }

    getHeightAt(x, z) {
        return this.getTerrainHeight(x, z);
    }

    getRandomPosition() {
        const x = (Math.random() - 0.5) * this.chunkSize * this.worldSize * 0.8;
        const z = (Math.random() - 0.5) * this.chunkSize * this.worldSize * 0.8;
        const y = this.getTerrainHeight(x, z) + 2;
        return new THREE.Vector3(x, y, z);
    }
}
