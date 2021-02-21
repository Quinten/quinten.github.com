import colors from '../lib/color.js';

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();
    let nFramesC = 1024;
    if (nFrames > -1) {
        nFrames = 128;
        nFramesC = nFrames;
    }

    let nPrints = Math.max(6, Math.ceil(window.innerWidth / 120) + 1);
    let prints = [];

    for (let p = 0; p < nPrints; p++) {

        let extraL = 70 + Math.floor(Math.random() * 8) * 20;
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
        prints.forEach((print) => {
            ctx.fillRect(print.x - 50, 0, 100, height);
            ctx.fillRect(print.x - 66, print.y - 66, 132, 132);
        });
        ctx.fillStyle = bgColor;
        prints.forEach((print) => {
            ctx.fillRect(print.x - 48, 0, 96, height);
            ctx.fillRect(print.x - 64, print.y - 64, 128, 128);
        });
        ctx.fillStyle = strokeColor;
        prints.forEach((print) => {
            //print.y += print.speed;
            ctx.fillRect(print.x - 30, 0, 60, height);
            ctx.fillRect(print.x - 50, print.y - 50, 100, 100);
        });
        ctx.fillStyle = bgColor;
        prints.forEach((print) => {
            ctx.fillRect(print.x - 28, 0, 56, height);
            ctx.fillRect(print.x - 48, print.y - 48, 96, 96);
        });
        ctx.fillStyle = strokeColor;
        prints.forEach((print) => {
            //print.y += print.speed;
            ctx.fillRect(print.x - 10, 0, 20, height);
            ctx.fillRect(print.x - 30, print.y - 30, 60, 60);
        });
        ctx.fillStyle = bgColor;
        prints.forEach((print) => {
            ctx.fillRect(print.x - 8, 0, 16, height);
            ctx.fillRect(print.x - 28, print.y - 28, 56, 56);
        });
        ctx.restore();
    };
};

export const remove = () => {
    removeClip(myClip);
};
