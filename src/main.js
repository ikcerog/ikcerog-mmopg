import { Game } from './Game.js';

let game;

window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.init();
});

window.addEventListener('resize', () => {
    if (game) {
        game.onResize();
    }
});
