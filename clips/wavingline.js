import colors from '../lib/color.js';

let bigSquares = [];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = color.lite.hsl;
    let strokeColor = color.base.hsl;
    canvas.style.backgroundColor = bgColor;

    bigSquares = [];
    for (let b = 0; b < 16; b++) {
        let bigSquare = addClip();
        bigSquare.phase = b / 15;
        bigSquare.draw = (time) => {
            bigSquare.x = width / 2;
            bigSquare.y = height * bigSquare.phase;
            bigSquare.rotation = Math.sin((time + 1200 * bigSquare.phase) / 600) * Math.PI;
            bigSquare.rotation = Math.max(bigSquare.rotation, - Math.PI / 2);
            bigSquare.rotation = Math.min(bigSquare.rotation, Math.PI / 2);
            context.fillStyle = strokeColor;
            context.fillRect(-height / 30, - 8, height / 15, 16);
        };
        bigSquares.push(bigSquare);
    }
};

export const remove = () => {
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};
