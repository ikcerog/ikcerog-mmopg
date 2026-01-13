import * as THREE from 'three';

export class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.position = new THREE.Vector3(0, 10, 0);
        this.velocity = new THREE.Vector3();
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        this.moveSpeed = 25;
        this.sprintMultiplier = 2;
        this.mouseSensitivity = 0.002;

        this.direction = new THREE.Vector3();
        this.isPointerLocked = false;

        // Create player visual (simple capsule)
        this.createPlayerMesh();

        // Setup pointer lock
        this.setupPointerLock();

        this.camera.position.copy(this.position);
    }

    createPlayerMesh() {
        // Player body - steampunk character
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b4423,
            metalness: 0.3,
            roughness: 0.7
        });
        this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);
    }

    setupPointerLock() {
        document.addEventListener('click', () => {
            if (!this.isPointerLocked) {
                document.body.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === document.body;
        });
    }

    update(delta, inputManager) {
        if (!inputManager) return;

        // Get movement input
        const input = inputManager.getMovementInput();
        const isSprinting = inputManager.isSprintPressed();

        // Calculate movement direction
        this.direction.set(input.x, 0, input.z).normalize();

        if (this.direction.length() > 0) {
            // Transform direction based on camera rotation
            const forward = new THREE.Vector3(0, 0, -1);
            forward.applyQuaternion(this.camera.quaternion);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3(1, 0, 0);
            right.applyQuaternion(this.camera.quaternion);
            right.y = 0;
            right.normalize();

            const moveDir = new THREE.Vector3();
            moveDir.addScaledVector(forward, input.z);
            moveDir.addScaledVector(right, input.x);
            moveDir.normalize();

            const speed = this.moveSpeed * (isSprinting ? this.sprintMultiplier : 1);
            this.velocity.x = moveDir.x * speed;
            this.velocity.z = moveDir.z * speed;
        } else {
            this.velocity.x = 0;
            this.velocity.z = 0;
        }

        // Apply gravity
        this.velocity.y -= 20 * delta;

        // Update position
        this.position.addScaledVector(this.velocity, delta);

        // Simple ground collision (y = 5 + terrain height approximation)
        const groundY = 5 + Math.sin(this.position.x * 0.01) * 5 + Math.cos(this.position.z * 0.01) * 5;
        if (this.position.y < groundY) {
            this.position.y = groundY;
            this.velocity.y = 0;
        }

        // Update camera rotation from mouse
        if (this.isPointerLocked) {
            const mouseInput = inputManager.getMouseDelta();
            this.rotation.y -= mouseInput.x * this.mouseSensitivity;
            this.rotation.x -= mouseInput.y * this.mouseSensitivity;

            // Clamp vertical rotation
            this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
        }

        // Update camera and mesh
        this.camera.position.copy(this.position);
        this.camera.position.y += 1.6; // Eye height
        this.camera.quaternion.setFromEuler(this.rotation);

        this.mesh.position.copy(this.position);
    }

    getPosition() {
        return this.position.clone();
    }

    getForwardVector() {
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        return forward;
    }
}
