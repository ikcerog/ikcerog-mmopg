import * as THREE from 'three';

export class TextureGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Simple noise function
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }

    // Perlin-style noise approximation
    perlinNoise(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }

    // Generate terrain texture with dirt/grass variation
    createTerrainTexture(size = 512) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                // Multi-octave noise for variation
                const n = this.perlinNoise(x / 50, y / 50, 4, 0.5);
                const detail = this.perlinNoise(x / 10, y / 10, 2, 0.3);

                // Mix brown dirt and greenish tones
                const t = n * 0.7 + detail * 0.3;

                data[i] = 100 + t * 80;      // R: brownish
                data[i + 1] = 80 + t * 70;   // G: more variation
                data[i + 2] = 50 + t * 40;   // B: less blue
                data[i + 3] = 255;            // A: opaque
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }

    // Generate normal map for terrain
    createTerrainNormalMap(size = 512) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                // Sample height at neighboring pixels
                const hL = this.perlinNoise((x - 1) / 30, y / 30, 3, 0.5);
                const hR = this.perlinNoise((x + 1) / 30, y / 30, 3, 0.5);
                const hD = this.perlinNoise(x / 30, (y - 1) / 30, 3, 0.5);
                const hU = this.perlinNoise(x / 30, (y + 1) / 30, 3, 0.5);

                // Calculate normal
                const nx = (hL - hR) * 0.5 + 0.5;
                const ny = (hD - hU) * 0.5 + 0.5;
                const nz = 1.0;

                data[i] = nx * 255;
                data[i + 1] = ny * 255;
                data[i + 2] = nz * 128 + 127;
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }

    // Generate rusty metal texture
    createMetalTexture(baseColor = 0x8b7355, size = 256) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        const r = (baseColor >> 16) & 255;
        const g = (baseColor >> 8) & 255;
        const b = baseColor & 255;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                const n = this.perlinNoise(x / 20, y / 20, 3, 0.5);
                const rust = this.perlinNoise(x / 40, y / 40, 2, 0.6);
                const scratches = this.noise(x / 5, y / 200) * 0.3;

                const variation = n * 0.6 + rust * 0.3 + scratches;

                data[i] = r * (0.7 + variation * 0.6);
                data[i + 1] = g * (0.7 + variation * 0.6);
                data[i + 2] = b * (0.7 + variation * 0.6);
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Generate brass texture
    createBrassTexture(size = 256) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                const n = this.perlinNoise(x / 30, y / 30, 3, 0.5);
                const detail = this.perlinNoise(x / 8, y / 8, 2, 0.4);
                const patina = this.noise(x / 50, y / 50);

                const brightness = 0.6 + n * 0.3 + detail * 0.1;

                data[i] = 200 * brightness;      // R: gold/brass
                data[i + 1] = 170 * brightness;  // G: brass tone
                data[i + 2] = 100 * (brightness * 0.8 + patina * 0.2); // B: less blue, patina
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Generate wood texture
    createWoodTexture(size = 256) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                // Wood grain pattern
                const grain = Math.sin(x / 8 + this.noise(x / 40, y / 40) * 10) * 0.5 + 0.5;
                const rings = Math.sin(x / 15) * 0.3 + 0.7;
                const noise = this.perlinNoise(x / 20, y / 20, 2, 0.5);

                const wood = grain * 0.4 + rings * 0.3 + noise * 0.3;

                data[i] = 100 + wood * 80;      // R: brown
                data[i + 1] = 60 + wood * 50;   // G: darker
                data[i + 2] = 30 + wood * 30;   // B: minimal
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Generate concrete/stone texture
    createStoneTexture(size = 256) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                const n = this.perlinNoise(x / 40, y / 40, 4, 0.5);
                const cracks = this.noise(x / 3, y / 100) * 0.2;
                const spots = this.noise(x / 10, y / 10) * 0.15;

                const value = (n * 0.7 + cracks + spots) * 0.8;

                const gray = 80 + value * 100;

                data[i] = gray;
                data[i + 1] = gray * 0.95;
                data[i + 2] = gray * 0.9;
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(this.canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Generate roughness map
    createRoughnessMap(size = 256, baseRoughness = 0.8) {
        this.canvas.width = size;
        this.canvas.height = size;
        const imageData = this.ctx.createImageData(size, size);
        const data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;

                const n = this.perlinNoise(x / 30, y / 30, 2, 0.5);
                const roughness = baseRoughness + n * 0.2;
                const value = roughness * 255;

                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
        return new THREE.CanvasTexture(this.canvas);
    }
}
