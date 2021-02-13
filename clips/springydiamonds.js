import colors from '../lib/color.js';

let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 2 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

const scaleX = Math.cos(Math.PI / 4);
const scaleY = Math.sin(Math.PI / 4); // this is actually the same

const springiness = .1;
const decay = .8;

let bigSquares = [];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = color.lite.hsl;
    let strokeColor = color.base.hsl;
    canvas.style.backgroundColor = bgColor;
    //canvas.style.backgroundColor = '#e74c3c';

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
            bigSquare.draw = function (time) {
            let size = Math.max(width, height);
                this.x = this.gX / 8 * size + (width - size) / 2;
                this.y = this.gY / 8 * size + (height - size) / 2;
                //this.rotation = Math.sin((time + 1200 * this.phase) / 600) * Math.PI * 2;
                //this.rotation = Math.max(this.rotation, - Math.PI * 3 / 4);
                //this.rotation = Math.min(this.rotation, Math.PI * 3 / 4);
                let step = Math.round(((time + this.phase * 3200) % 3200) / 3200);
                let scale = 1;
                let homeA = 0;
                let homeB = 0;
                if (step) {
                    this.scaleA = 0;
                    homeB = 1;
                    context.fillStyle = strokeColor;
                    context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
                    this.changeA = ((homeA - this.scaleA) * springiness) + (this.changeA * decay);
                    this.scaleA += this.changeA;
                    this.changeB = ((homeB - this.scaleB) * springiness) + (this.changeB * decay);
                    this.scaleB += this.changeB;
                    context.fillStyle = bgColor;
                    context.fillRect(-size / 8 * scaleX * this.scaleB, - size / 8 * scaleY * this.scaleB, size / 4 * scaleX * this.scaleB, size / 4 * scaleY * this.scaleB);
                } else {
                    this.scaleB = 0;
                    homeA = 1;
                    context.fillStyle = bgColor;
                    context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
                    this.changeA = ((homeA - this.scaleA) * springiness) + (this.changeA * decay);
                    this.scaleA += this.changeA;
                    this.changeB = ((homeB - this.scaleB) * springiness) + (this.changeB * decay);
                    this.scaleB += this.changeB;
                    context.fillStyle = strokeColor;
                    context.fillRect(-size / 8 * scaleX * this.scaleA, - size / 8 * scaleY * this.scaleA, size / 4 * scaleX * this.scaleA, size / 4 * scaleY * this.scaleA);
                }

            };
            bigSquares.push(bigSquare);
            }
        }
    }

    /*
    square = addClip();
    square.rotation = Math.PI / 4;
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
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
    */
};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};
