import color from '../lib/color.js';

const scaleX = Math.cos(Math.PI / 4);
const scaleY = Math.sin(Math.PI / 4); // this is actually the same

const springiness = .1;
const decay = .8;

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
                bigSquare.rotation = Math.PI * 3 / 4;
                bigSquare.scaleA = bigSquare.scaleB = 0;
                bigSquare.changeA = bigSquare.changeB = 0;
                bigSquare.draw = (time) => {
                    time = (nFrames > -1) ? frameIndex * 40 : time;
                    let size = Math.max(width, height);
                    bigSquare.x = bigSquare.gX / 8 * size + (width - size) / 2;
                    bigSquare.y = bigSquare.gY / 8 * size + (height - size) / 2;
                    let step = Math.round(((time + bigSquare.phase * 3200) % 3200) / 3200);
                    let scale = 1;
                    let homeA = 0;
                    let homeB = 0;
                    if (step) {
                        bigSquare.scaleA = 0;
                        homeB = 1;
                        context.fillStyle = color.current.shade;
                        context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
                        bigSquare.changeA = ((homeA - bigSquare.scaleA) * springiness) + (bigSquare.changeA * decay);
                        bigSquare.scaleA += bigSquare.changeA;
                        bigSquare.changeB = ((homeB - bigSquare.scaleB) * springiness) + (bigSquare.changeB * decay);
                        bigSquare.scaleB += bigSquare.changeB;
                        context.fillStyle = color.current.fill;
                        context.fillRect(-size / 8 * scaleX * bigSquare.scaleB, - size / 8 * scaleY * bigSquare.scaleB, size / 4 * scaleX * bigSquare.scaleB, size / 4 * scaleY * bigSquare.scaleB);
                    } else {
                        bigSquare.scaleB = 0;
                        homeA = 1;
                        context.fillStyle = color.current.fill;
                        context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
                        bigSquare.changeA = ((homeA - bigSquare.scaleA) * springiness) + (bigSquare.changeA * decay);
                        bigSquare.scaleA += bigSquare.changeA;
                        bigSquare.changeB = ((homeB - bigSquare.scaleB) * springiness) + (bigSquare.changeB * decay);
                        bigSquare.scaleB += bigSquare.changeB;
                        context.fillStyle = color.current.shade;
                        context.fillRect(-size / 8 * scaleX * bigSquare.scaleA, - size / 8 * scaleY * bigSquare.scaleA, size / 4 * scaleX * bigSquare.scaleA, size / 4 * scaleY * bigSquare.scaleA);
                    }
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
