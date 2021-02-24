import colors from '../lib/color.js';

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = (!color.invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (color.invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = color.base.hsl;

    let printb = (prints, s) => {
        let x1, x2, y1, y2, w1, w2, h1, h2;
        ctx.fillStyle = strokeColor;
        prints.forEach((print) => {
            x1 = print.x - 10 - s * 20;
            x2 = x1 - 20;
            y1 = print.y - 187;
            y2 = print.y - 30 - s * 20;
            w1 = 20 + s * 40;
            w2 = w1 + 40;
            h1 = 374;
            h2 = w2;

            ctx.fillRect(x1 - 1, Math.floor(y1), w1 + 2, h1);
            ctx.fillRect(x2 - 1, Math.floor(y2 - 1), w2 + 2, h2 + 2);
        });
        ctx.fillStyle = bgColor;
        prints.forEach((print) => {
            x1 = print.x - 10 - s * 20;
            x2 = x1 - 20;
            y1 = print.y - 187;
            y2 = print.y - 30 - s * 20;
            w1 = 20 + s * 40;
            w2 = w1 + 40;
            h1 = 374;
            h2 = w2;

            ctx.fillRect(x1 + 1, Math.floor(y1), w1 - 2, h1);
            ctx.fillRect(x2 + 1, Math.floor(y2 + 1), w2 - 2, h2 - 2);
        });
    };

    myClip = addClip({unshift: true});
    let nFramesC = 1024;
    if (nFrames > -1) {
        nFrames = 128;
        nFramesC = nFrames;
    }

    let nPrints = Math.max(6, Math.ceil(window.innerWidth / 120) + 1);
    let prints = [];

    for (let p = 0; p < nPrints; p++) {

        let extraL = 250 + Math.floor(Math.random() * 8) * 50;
        let L = height + extraL * 2;
        let dir = (Math.round(Math.random())) ? 1 : -1;
        let speed = L / nFramesC * dir;
        let x = p * 120;
        let y = - extraL + Math.floor (Math.random() * L);
        let print = {
            x, y, extraL, L, dir, speed
        };

        prints.push(print);
    }

    myClip.draw = function (time) {
        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        if (nFrames === -1) {
            ctx.scale(2, 2);
        }
        prints.forEach((print) => {
            print.y += print.speed;
            if (print.y < -print.extraL) {
                print.y += print.L;
            }
            if (print.y > height + print.extraL) {
                print.y -= print.L;
            }
        });
        ctx.fillStyle = strokeColor;
        let x = 10;
        while (x < width) {
            ctx.fillRect(x - 1, 0, 2, height);
            x += 20;
        }

        printb(prints, 7);
        printb(prints, 6);
        printb(prints, 5);
        printb(prints, 4);
        printb(prints, 3);
        printb(prints, 2);
        printb(prints, 1);
        printb(prints, 0);
        ctx.restore();
    };
};

export const remove = () => {
    removeClip(myClip);
};
