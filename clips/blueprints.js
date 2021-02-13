import colors from '../lib/color.js';

let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height * 3 / 4 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;
    //canvas.style.backgroundColor = '#003554';

    myClip = addClip();

    /*
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height * 3 / 4;
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

    let nPrints = Math.floor(Math.hypot(window.innerWidth * 2, height) / 32), prints = [];

    for (let p = 0; p < nPrints; p++) {

        let dir = Math.random() * Math.PI;
        let speed = 1 + Math.random();

        let print = {
            x: Math.floor(Math.random() * (window.innerWidth * 2 + 64)) - 32,
            y: Math.floor(Math.random() * (height + 64)) - 32,
            w: (32 + (Math.floor(Math.random() * 24) * 16)),
            h: (32 + (Math.floor(Math.random() * 24) * 16)),
            vx: Math.cos(dir) * speed,
            vy: Math.sin(dir) * speed
        };

        prints.push(print);
    }

    myClip.draw = function (time) {

        let width = window.innerWidth * 2;

        context.fillStyle = strokeColor;
        prints.forEach((print) => {
            print.x += print.vx;
            print.y += print.vy;
            if (print.x + 12 + print.w < 0) {
                print.x += width + 24 + print.w;
            }
            if (print.y + 12 + print.h < 0) {
                print.y += height + 24 + print.h;
            }
            if (print.x - 12 > width) {
                print.x -= width + 24 + print.w;
            }
            if (print.y - 12 > height) {
                print.y -= height + 24 + print.h;
            }
            context.fillRect(print.x, print.y, print.w, print.h);
        });
        context.fillStyle = bgColor;
        prints.forEach((print) => {
            context.fillRect(print.x + 2, print.y + 2, print.w - 4, print.h - 4);
        });
        context.fillStyle = strokeColor;
        prints.forEach((print) => {
            context.fillRect(print.x + 12, print.y + 12, print.w - 24, print.h - 24);
        });
        context.fillStyle = bgColor;
        prints.forEach((print) => {
            context.fillRect(print.x + 14, print.y + 14, print.w - 28, print.h - 28);
        });
    };


};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    removeClip(myClip);
};