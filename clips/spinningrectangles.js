import color from '../lib/color.js';

let bigSquares = [];

export const add = () => {
    bgKey = 'fill';
    canvas.style.backgroundColor = color.current[bgKey];

    if (nFrames > -1) {
        nFrames = 34;
        startFrame = 4;
    }

    bigSquares = [];
    for (let b = 0; b < 16; b++) {
        let bigSquare = addClip();
        bigSquare.phase = b / 15;
        bigSquare.twist = Math.random();
        bigSquare.draw = (time) => {
            time = (nFrames > -1) ? frameIndex * 40 : time;
            bigSquare.x = width / 2;
            bigSquare.y = height * bigSquare.phase;
            context.fillStyle = color.current.shade;
            context.fillRect(
                Math.abs(Math.sin((time + 1200 * bigSquare.twist) / 1200 * Math.PI)) *  -width / 4,
                -height / 30,
                Math.abs(Math.sin((time + 1200 * bigSquare.twist) / 1200 * Math.PI)) *  width / 2,
                height / 15
            );
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
