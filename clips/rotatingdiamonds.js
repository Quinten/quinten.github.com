import color from '../lib/color.js';

const scaleX = Math.cos(Math.PI / 4);
const scaleY = Math.sin(Math.PI / 4); // this is actually the same

let bigSquares = [];

export const add = () => {
    bgKey = 'fill';
    canvas.style.backgroundColor = color.current[bgKey];

    if (nFrames > -1) {
        nFrames = 160;
        startFrame = 81;
    }

    bigSquares = [];
    let yes = true;
    for (let b = 0; b < 9; b++) {
        for (let c = 0; c < 9; c++) {
            yes = !yes;
            if (yes) {
            let bigSquare = addClip({unshift: true});
            bigSquare.phase = Math.random();
            bigSquare.gX = b;
            bigSquare.gY = c;
            bigSquare.draw = (time) => {
                time = (nFrames > -1) ? frameIndex * 40 : time;
                let size = Math.max(width, height);
                bigSquare.x = bigSquare.gX / 8 * size + (width - size) / 2;
                bigSquare.y = bigSquare.gY / 8 * size + (height - size) / 2;
                bigSquare.rotation = Math.sin((time + 3200 * bigSquare.phase) / 1600 * Math.PI) * Math.PI * 2;
                bigSquare.rotation = Math.max(bigSquare.rotation, - Math.PI * 3 / 4);
                bigSquare.rotation = Math.min(bigSquare.rotation, Math.PI * 3 / 4);
                context.fillStyle = color.current.shade;
                let scale = Math.abs(bigSquare.rotation / (Math.PI * 3 / 4));
                context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
            };
            bigSquares.push(bigSquare);
            }
        }
    }
};

export const remove = () => {
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};
