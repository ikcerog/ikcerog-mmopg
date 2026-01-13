export class InputManager {
    constructor(player, dialogSystem) {
        this.player = player;
        this.dialogSystem = dialogSystem;

        this.keys = {};
        this.mouseDelta = { x: 0, y: 0 };
        this.gamepad = null;
        this.gamepadIndex = -1;

        this.setupEventListeners();
        this.pollGamepad();
    }

    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Interaction key
            if (e.code === 'KeyE') {
                this.dialogSystem.tryInteract(this.player.getPosition(), this.player.getForwardVector());
            }

            // Continue dialog
            if (e.code === 'Space' && this.dialogSystem.isDialogActive()) {
                e.preventDefault();
                this.dialogSystem.continueDialog();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse
        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                this.mouseDelta.x = e.movementX;
                this.mouseDelta.y = e.movementY;
            }
        });

        // Gamepad connection
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepad = e.gamepad;
            this.gamepadIndex = e.gamepad.index;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected');
            this.gamepad = null;
            this.gamepadIndex = -1;
        });
    }

    pollGamepad() {
        // Update gamepad state
        if (this.gamepadIndex >= 0) {
            const gamepads = navigator.getGamepads();
            this.gamepad = gamepads[this.gamepadIndex];
        }

        requestAnimationFrame(() => this.pollGamepad());
    }

    getMovementInput() {
        let x = 0;
        let z = 0;

        // Keyboard input
        if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

        // Gamepad input (left stick)
        if (this.gamepad) {
            const deadzone = 0.15;
            const gx = this.gamepad.axes[0];
            const gz = this.gamepad.axes[1];

            if (Math.abs(gx) > deadzone) x += gx;
            if (Math.abs(gz) > deadzone) z += gz;

            // Gamepad interaction button (A/Cross button)
            if (this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed) {
                if (!this.lastButtonState) {
                    if (this.dialogSystem.isDialogActive()) {
                        this.dialogSystem.continueDialog();
                    } else {
                        this.dialogSystem.tryInteract(this.player.getPosition(), this.player.getForwardVector());
                    }
                }
                this.lastButtonState = true;
            } else {
                this.lastButtonState = false;
            }

            // Gamepad camera (right stick)
            const deadzoneCam = 0.1;
            const rx = this.gamepad.axes[2];
            const ry = this.gamepad.axes[3];

            if (Math.abs(rx) > deadzoneCam || Math.abs(ry) > deadzoneCam) {
                this.mouseDelta.x = rx * 5;
                this.mouseDelta.y = ry * 5;
            }
        }

        return { x, z };
    }

    getMouseDelta() {
        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    isSprintPressed() {
        let sprint = this.keys['ShiftLeft'] || this.keys['ShiftRight'];

        // Gamepad sprint (left trigger or left bumper)
        if (this.gamepad) {
            if (this.gamepad.buttons[6] && this.gamepad.buttons[6].pressed) sprint = true;
            if (this.gamepad.buttons[4] && this.gamepad.buttons[4].pressed) sprint = true;
        }

        return sprint;
    }
}
