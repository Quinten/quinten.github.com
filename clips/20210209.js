import colors from '../lib/color.js';

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();

    let p = [];
    let numPoints = 512;
    let lineSize = 48;
    let Lx = 0, Ly = 0, sq = false, hsl;
    function plotOn() {
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

    myClip.draw = function (time) {

        context.strokeStyle = strokeColor;
        context.lineWidth = 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < numPoints; i++) {
            p[i]._x = vpX + p[i].x;
            p[i]._y = vpY + p[i].y;
        }

        let prevP = p[0];
        for (let i = 1; i < numPoints; i++) {
            line(prevP._x, prevP._y, p[i]._x, p[i]._y);
            if (p[i].sq) {
                ctx.fillStyle = p[i].c;
                ctx.fillRect(p[i]._x, p[i]._y, lineSize, lineSize);
            }
            prevP = p[i];
        }
        prevP = p.shift();
        plotOn();
        prevP.x =  Lx;
        prevP.y = Ly;
        prevP.sq = sq;
        prevP.c = hsl;
        p.push(prevP);
    };
};

export const remove = () => {
    removeClip(myClip);
};
