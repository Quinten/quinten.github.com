import colors from '../lib/color.js';
import two from '../lib/2d.js';

let bigSquares = [];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = (!color.invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (color.invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    if (nFrames > -1) {
        nFrames = 128;
    }

    let left = -width / 2;
    let right = width * 3 / 2;
    let top = -height / 2;
    let bottom = height * 3 / 2;

    let nSquares = (nFrames > -1) ? 16 : 64;
    bigSquares = [];
    for (let b = 0; b < nSquares; b++) {
        let bigSquare = addClip();
        let dir = Math.random() * Math.PI * 2;
        bigSquare.dir = dir;
        bigSquare.x = left + Math.random() * width * 2;
        bigSquare.y = top + Math.random() * height * 2;
        bigSquare.dist = width * height;
        bigSquare.top = bigSquare.x - (bigSquare.y - top) / Math.sin(dir) * Math.sin(Math.PI / 2 - dir);
        bigSquare.bottom = bigSquare.x + (bottom - bigSquare.y) / Math.sin(dir) * Math.sin(Math.PI / 2 - dir);
        bigSquare.left = bigSquare.y - (bigSquare.x - left) / Math.sin(Math.PI / 2 - dir) * Math.sin(dir);
        bigSquare.right = bigSquare.y + (right - bigSquare.x) / Math.sin(Math.PI / 2 - dir) * Math.sin(dir);
        bigSquare.pathLength = 0;
        if (dir < Math.PI / 2) {
            bigSquare.pathLength = Math.min(
                    Math.hypot(right - bigSquare.x, bigSquare.right - bigSquare.y),
                    Math.hypot(bigSquare.bottom - bigSquare.x, bottom - bigSquare.y)
                ) + Math.min(
                    Math.hypot(bigSquare.x - left, bigSquare.left - bigSquare.y),
                    Math.hypot(bigSquare.x - bigSquare.top, bigSquare.y - top)
            );
        } else if (dir < Math.PI) {
            bigSquare.pathLength = Math.min(
                    Math.hypot(bigSquare.x - left, bigSquare.left - bigSquare.y),
                    Math.hypot(bigSquare.bottom - bigSquare.x, bottom - bigSquare.y)
                ) + Math.min(
                    Math.hypot(right - bigSquare.x, bigSquare.right - bigSquare.y),
                    Math.hypot(bigSquare.x - bigSquare.top, bigSquare.y - top)
            );
        } else if (dir < Math.PI * 1.5) {
            bigSquare.pathLength = Math.min(
                    Math.hypot(right - bigSquare.x, bigSquare.right - bigSquare.y),
                    Math.hypot(bigSquare.bottom - bigSquare.x, bottom - bigSquare.y)
                ) + Math.min(
                    Math.hypot(bigSquare.x - left, bigSquare.left - bigSquare.y),
                    Math.hypot(bigSquare.x - bigSquare.top, bigSquare.y - top)
            );
        } else {
            bigSquare.pathLength = Math.min(
                    Math.hypot(bigSquare.x - left, bigSquare.left - bigSquare.y),
                    Math.hypot(bigSquare.bottom - bigSquare.x, bottom - bigSquare.y)
                ) + Math.min(
                    Math.hypot(right - bigSquare.x, bigSquare.right - bigSquare.y),
                    Math.hypot(bigSquare.x - bigSquare.top, bigSquare.y - top)
            );
        }
        bigSquare.speed = (nFrames > -1) ? (bigSquare.pathLength / nFrames) : (1 + Math.random());
        bigSquare.vx = Math.cos(bigSquare.dir) * bigSquare.speed;
        bigSquare.vy = Math.sin(bigSquare.dir) * bigSquare.speed;
        bigSquare.quad = [
            24 - Math.random() * 8,
            -4 + Math.random() * 8,
            -4 + Math.random() * 8,
            -24 + Math.random() * 8,
            -24 + Math.random() * 8,
            -4 + Math.random() * 8,
            -4 + Math.random() * 8,
            24 - Math.random() * 8
        ];
        if (nFrames > -1) {
            bigSquare.quad.forEach((point, index) => {
                bigSquare.quad[index] = point / 2;
            });
        }
        bigSquare.step = (time) => {
            bigSquare.x = bigSquare.x + bigSquare.vx;
            if (bigSquare.x < left) {
                bigSquare.x = right;
                if (nFrames > -1) {
                    bigSquare.y = bigSquare.right;
                }
            }
            if (bigSquare.x > right) {
                bigSquare.x = left;
                if (nFrames > -1) {
                    bigSquare.y = bigSquare.left;
                }
            }
            bigSquare.y = bigSquare.y + bigSquare.vy;
            if (bigSquare.y < top) {
                bigSquare.y = bottom;
                if (nFrames > -1) {
                    bigSquare.x = bigSquare.bottom;
                }
            }
            if (bigSquare.y > bottom) {
                bigSquare.y = top;
                if (nFrames > -1) {
                    bigSquare.x = bigSquare.top;
                }
            }
        };
        bigSquare.draw = (time) => {
            ctx.fillStyle = strokeColor;
            two.quad(ctx, ...bigSquare.quad);
            bigSquares.forEach((s) => {
                s.dist = Math.hypot(bigSquare.x - s.x, bigSquare.y - s.y);
            });
            let copySquares = [];
            copySquares.push(...bigSquares);
            copySquares.sort((a, b) => {
                if (a.dist > b.dist) {
                    return 1;
                }
                return -1;
            });
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = (nFrames > -1) ? 1 : 2;
            if (copySquares[1]) {
                two.line(ctx, 0, 0, copySquares[1].x - bigSquare.x, copySquares[1].y - bigSquare.y);
            }
            if (copySquares[2]) {
                two.line(ctx, 0, 0, copySquares[2].x - bigSquare.x, copySquares[2].y - bigSquare.y);
            }
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
