import colors from '../lib/color.js';
import two from '../lib/2d.js';

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = (!color.invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (color.invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();

    if (nFrames > -1) {
        nFrames = 128;
    }

    let p = [];
    let numPoints = (nFrames > -1) ? nFrames : 512;
    let lineSize = 48;
    let Lx = 0, Ly = 0, sq = false, hsl;
    let plotOn = () => {
        let d = Math.round(Math.random()) ? lineSize : -lineSize;
        let r = Math.random() * 2;
        sq = (Math.random() > 0.9);
        hsl = 'hsl(' + color.pale.h + ',' + Math.floor(color.pale.s * 100) + '%,' + Math.floor(Math.random() * 100) + '%)';
        if (r < 1) {
            Lx = Lx + d;
            if (Lx + d > width / 2) {
                Lx = Lx - d * 2;
                sq = false;
            }
            if (Lx < -width / 2) {
                Lx = Lx - d * 2;
            }
        }
        if (r >= 1) {
            Ly = Ly + d;
            if (Ly + d > height / 2) {
                Ly = Ly - d * 2;
                sq = false;
            }
            if (Ly < -height / 2) {
                Ly = Ly - d * 2;
            }
        }
    };
    for (let i = 0; i < numPoints; i++) {
        p[i] = {};
        plotOn();
        p[i].x = Lx;
        p[i].y = Ly;
        p[i].sq = sq;
        p[i].c = hsl;
    }

    myClip.draw = (time) => {

        context.strokeStyle = strokeColor;
        context.lineWidth = 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < numPoints; i++) {
            p[i]._x = vpX + p[i].x;
            p[i]._y = vpY + p[i].y;
        }

        let startP = (nFrames > -1) ? Math.floor(numPoints / 2) : 0;
        let prevP = p[startP];
        for (let i = startP + 1; i < numPoints; i++) {
            if (prevP._x === p[i]._x || prevP._y === p[i]._y) {
                two.line(ctx, prevP._x, prevP._y, p[i]._x, p[i]._y);
            }
            if (p[i].sq) {
                ctx.fillStyle = p[i].c;
                ctx.fillRect(p[i]._x, p[i]._y, lineSize, lineSize);
            }
            prevP = p[i];
        }
        prevP = p.shift();
        if (nFrames === -1) {
            plotOn();
            prevP.x =  Lx;
            prevP.y = Ly;
            prevP.sq = sq;
            prevP.c = hsl;
        }
        p.push(prevP);
    };
};

export const remove = () => {
    removeClip(myClip);
};
