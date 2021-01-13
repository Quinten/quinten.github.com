let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height * 2 / 3 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

let bigSquares = [];

export const add = () => {
    canvas.style.backgroundColor = '#2c3e50';

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
            context.fillStyle = '#34495e';
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
            context.strokeStyle = '#34495e';
            context.lineWidth = 2;
            context.translate(-bigSquare.x, -bigSquare.y);
            line(bigSquare.x, bigSquare.y, bigSquares[1].x, bigSquares[1].y);
            line(bigSquare.x, bigSquare.y, bigSquares[2].x, bigSquares[2].y);
        };
        bigSquares.push(bigSquare);
    }

    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height * 2 / 3;
        context.fillStyle = '#ecf0f1';
        context.fillRect(-16, -16, 32, 32);
        context.strokeStyle = '#ecf0f1';
        let pulse = time % 2000;
        pulse = pulse * pulse / 4000000;
        context.globalAlpha = 1 - pulse;
        pulse = 16 + pulse * 24;
        context.strokeRect(-pulse, -pulse, pulse * 2, pulse * 2);
    };

    events.on('pointerup', listener);
};

export const remove = () => {
    events.off('pointerup', listener);
    removeClip(square);
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};