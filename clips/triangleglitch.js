import colors from '../lib/color.js';

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    let bgColor = (!color.invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (color.invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    if (nFrames > -1) {
        nFrames = 128;
    }

    myClip = addClip({unshift: true});

    let angleZ = (nFrames === -1) ? ((-0.005 + Math.random() / 100) * 2) : Math.PI * 2 / nFrames;
    let cosZ = Math.cos(angleZ);
    let sinZ = Math.sin(angleZ);

    let fl = 400;

    let p = [];
    let numPoints = 512;
    let lineSize = 80;
    let Lx = 0, Ly = 0, Lz = 0;
    let plotOn = () => {
        let d = Math.round(Math.random()) ? lineSize : -lineSize;
        let r = Math.random() * 3;
        if (r > 2) {
            Lx = (Lx + d > fl || Lx + d < -fl) ? Lx - d : Lx + d;
        }
        if (r < 1) {
            Ly = (Ly + d > fl || Ly + d < -fl) ? Ly - d : Ly + d;
        }
        if (r < 2 && r > 1) {
            Lz = (Lz + d > fl || Lz + d < -fl) ? Lz - d : Lz + d;
        }
    };
    for (let i = 0; i < numPoints; i++) {
        p[i] = {};
        plotOn();
        p[i].x =  Lx;
        p[i].y = Ly;
        p[i].z = Lz;
    }

    myClip.draw = (time) => {

        context.fillStyle = strokeColor;
        context.strokeStyle = strokeColor;
        context.lineWidth = 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < numPoints; i++) {

            let x1 = p[i].x * cosZ + p[i].y * sinZ;
            let y1 = p[i].y * cosZ - p[i].x * sinZ;

            p[i].x = x1;
            p[i].y = y1;
            p[i].z = p[i].z - ((nFrames > -1) ? 6 : 1);
            if (p[i].z < -fl) {
                p[i].z = fl;
            }

            let scale = fl / (fl + p[i].z);
            p[i]._x = vpX + p[i].x * scale;
            p[i]._y = vpY + p[i].y * scale;
        }

        let prevP = p[0];
        for (let i = 3; i < numPoints; i++) {
            if (
            (p[i].z > -fl) && (prevP.z > -fl) &&
            !(((prevP._x < 0) && (p[i]._x > width))
            || ((prevP._x > width) && (p[i]._x < 0))
            || ((prevP._y < 0) && (p[i]._y > height))
            || ((prevP._y > height) && (p[i]._y < 0))))
            {
                quad(p[i]._x, p[i]._y, p[i - 1]._x, p[i - 1]._y, p[i - 2]._x, p[i - 2]._y, p[i - 3]._x, p[i - 3]._y);
            }
            prevP = p[i];
        }
        if (nFrames === -1) {
            prevP = p.shift();
            plotOn();
            prevP.x =  Lx;
            prevP.y = Ly;
            prevP.z = Lz;
            p.push(prevP);
        }
    };
};

export const remove = () => {
    removeClip(myClip);
};
