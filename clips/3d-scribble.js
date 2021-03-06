import color from '../lib/color.js';
import two from '../lib/2d.js';
import three from '../lib/3d.js';

let myClip;

export const add = () => {
    bgKey = 'bg';
    canvas.style.backgroundColor = color.current[bgKey];

    myClip = addClip();

    let angleY = (-0.005 + Math.random() / 100) * 2;
    let angleX = (-0.005 + Math.random() / 100) * 2;

    if (nFrames > -1) {
        nFrames = 100;
        angleX = -Math.PI * 2 * Math.random();
        angleY = -Math.PI * 2 * Math.random();
    }

    let fl = 400;

    let p = [];
    let numPoints = (nFrames > -1) ? nFrames : 256;
    let lineSize = 40;
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
        p[i].i = i;
        plotOn();
        p[i].x = Lx;
        p[i].y = Ly;
        p[i].z = Lz;
    }
    for (let i = 0; i < numPoints; i++) {
        let [x1, z1] = three.rotate(p[i].x, p[i].z, angleY);
        let [y1, z2] = three.rotate(p[i].y, z1, angleX);
        p[i].x = x1;
        p[i].y = y1;
        p[i].z = z2;
    }
    if (nFrames > -1) {
        angleX = 4.5 / nFrames;
        angleY = 4.5 / nFrames;
    }

    myClip.draw = (time) => {
        ctx.strokeStyle = color.current.stroke;
        ctx.lineWidth = (nFrames > -1) ? 1 : 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < numPoints; i++) {

            let [x1, z1] = three.rotate(p[i].x, p[i].z, angleY);
            let [y1, z2] = three.rotate(p[i].y, z1, angleX);

            p[i].x = x1;
            p[i].y = y1;
            p[i].z = z2;

            let [_x, _y] = three.project(vpX, vpY, fl, p[i].x, p[i].y, p[i].z);
            p[i]._x = _x;
            p[i]._y = _y;
        }

        let startP = (nFrames > -1) ? Math.floor(numPoints / 2) : 0;
        let prevP = p[startP];
        for (let i = startP + 1; i < numPoints; i++) {
            if (
            p[i].i !== 0 &&
            (p[i].z > -fl) && (prevP.z > -fl) &&
            !(((prevP._x < 0) && (p[i]._x > width))
            || ((prevP._x > width) && (p[i]._x < 0))
            || ((prevP._y < 0) && (p[i]._y > height))
            || ((prevP._y > height) && (p[i]._y < 0))))
            {
                two.line(ctx, prevP._x, prevP._y, p[i]._x, p[i]._y);
            }
            prevP = p[i];
        }
        prevP = p.shift();
        if (nFrames === -1) {
            plotOn();
            prevP.x =  Lx;
            prevP.y = Ly;
            prevP.z = Lz;
        }
        p.push(prevP);
    };
};

export const remove = () => {
    removeClip(myClip);
};
