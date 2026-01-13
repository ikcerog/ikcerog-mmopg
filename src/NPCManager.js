import * as THREE from 'three';

export class NPCManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.npcs = [];
    }

    spawnNPCs(count) {
        const names = ['Cogsworth', 'Gearhart', 'Steamwhistle', 'Brasswick', 'Ironside', 'Copperfield',
                       'Valvina', 'Rivetina', 'Piston', 'Sprocket', 'Boiler', 'Gauge', 'Wrenchley',
                       'Tinker', 'Steamson', 'Brassmith', 'Coalburn', 'Gearston', 'Mechanique', 'Boltsworth'];

        for (let i = 0; i < count; i++) {
            const pos = this.world.getRandomPosition();
            const npc = this.createNPC(names[i] || `NPC-${i}`, pos);
            this.npcs.push(npc);
        }
    }

    createNPC(name, position) {
        const group = new THREE.Group();

        // Body
        const body = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 1.2, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0x8b6914, metalness: 0.6, roughness: 0.4 })
        );
        body.castShadow = true;
        group.add(body);

        // Hat (steampunk top hat)
        const hat = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.35, 0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.3, roughness: 0.7 })
        );
        hat.position.y = 1.2;
        hat.castShadow = true;
        group.add(hat);

        group.position.copy(position);
        this.scene.add(group);

        return { name, position: position.clone(), group, dialogIndex: 0 };
    }

    update(delta, playerPos) {
        // Simple idle animation
        this.npcs.forEach((npc, i) => {
            npc.group.rotation.y = Math.sin(Date.now() * 0.001 + i) * 0.3;
        });
    }

    getNearbyNPCs(position, radius) {
        return this.npcs.filter(npc => npc.position.distanceTo(position) < radius);
    }

    getNPCInView(position, forward, maxDistance = 10) {
        for (const npc of this.npcs) {
            const toNPC = npc.position.clone().sub(position);
            const distance = toNPC.length();

            if (distance < maxDistance) {
                toNPC.normalize();
                const dot = forward.dot(toNPC);
                if (dot > 0.7) return npc;
            }
        }
        return null;
    }
}
