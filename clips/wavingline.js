import color from '../lib/color.js';

let bigSquares = [];

export const add = () => {
    bgKey = 'fill';
    canvas.style.backgroundColor = color.current[bgKey];

    if (nFrames > -1) {
        nFrames = 98;
        startFrame = 4;
    }

    bigSquares = [];
    for (let b = 0; b < 16; b++) {
        let bigSquare = addClip();
        bigSquare.phase = b / 15;
        bigSquare.draw = (time) => {
            time = (nFrames > -1) ? frameIndex * 40 : time;
            bigSquare.x = width / 2;
            bigSquare.y = height * bigSquare.phase;
            bigSquare.rotation = Math.sin((time + 1200 * bigSquare.phase) / 600) * Math.PI;
            bigSquare.rotation = Math.max(bigSquare.rotation, - Math.PI / 2);
            bigSquare.rotation = Math.min(bigSquare.rotation, Math.PI / 2);
            context.fillStyle = color.current.shade;
            context.fillRect(-height / 30, - 4, height / 15, 8);
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
