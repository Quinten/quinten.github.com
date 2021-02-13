import colors from '../lib/color.js';

let bigSquares = [];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    bigSquares = [];
    for (let b = 0; b < 64; b++) {
        let bigSquare = addClip();
        bigSquare.phase = b / 15;
        bigSquare.twist = Math.random();
        bigSquare.dir = Math.random() * Math.PI;
        bigSquare.speed = 1 + Math.random();
        bigSquare.vx = Math.cos(bigSquare.dir) * bigSquare.speed;
        bigSquare.vy = Math.sin(bigSquare.dir) * bigSquare.speed;
        bigSquare.x = -width + Math.random() * width * 3;
        bigSquare.y = -height + Math.random() * height * 3;
        bigSquare.dist = width * height;
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
        bigSquare.draw = function (time) {
            this.x = this.x + this.vx;
            if (this.x < -width / 2) {
                this.x = width * 3 /2;
            }
            if (this.x > width * 3 / 2) {
                this.x = -width / 2;
            }
            this.y = this.y + this.vy;
            if (this.y < -height / 2) {
                this.y = height * 3 / 2;
            }
            if (this.y > height * 3 / 2) {
                this.y = -height / 2;
            }
            context.fillStyle = strokeColor;
            quad(...bigSquare.quad);
            bigSquares.forEach((s) => {
                s.dist = Math.hypot(bigSquare.x - s.x, bigSquare.y - s.y);
            });
            bigSquares.sort((a, b) => {
                if (a.dist > b.dist) {
                    return 1;
                }
                return -1;
            });
            context.strokeStyle = strokeColor;
            context.lineWidth = 2;
            context.translate(-bigSquare.x, -bigSquare.y);
            if (bigSquares[1] && bigSquares[2]) {
                line(bigSquare.x, bigSquare.y, bigSquares[1].x, bigSquares[1].y);
                line(bigSquare.x, bigSquare.y, bigSquares[2].x, bigSquares[2].y);
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
