import color from '../lib/color.js';
import two from '../lib/2d.js';
import three from '../lib/3d.js';

let myClip;

export const add = () => {
    bgKey = 'fill';
    canvas.style.backgroundColor = color.current[bgKey];

    if (nFrames > -1) {
        nFrames = 100;
    }

    let angleY = 0;
    let angleX = 0;

    let fl = 400;

    let p = [];
    let s = [];

    let addStick = () => {

        let pt = [];
        pt.push({x: 0, y: 0, z: 0});
        pt.push({x: 0, y: 0, z: 200});
        pt.push({x: -5, y: 0, z: 200});
        pt.push({x: 5, y: 0, z: 200});

        let i = p.length;
        s.push({a: i, b: i + 1});
        s.push({a: i + 2, b: i + 3});

        angleX = Math.PI * 2 * Math.random();
        angleY = Math.PI * 2 * Math.random();

        pt.forEach(function (t) {

            let [x1, z1] = three.rotate(t.x, t.z, angleY);
            let [y1, z2] = three.rotate(t.y, z1, angleX);

            t.x = x1;
            t.y = y1;
            t.z = z2;
            p.push(t);
        });
    }

    for (let g = 0; g < 200; g++) {
        addStick();
    }

    angleX = (nFrames > -1) ? 4.5 / nFrames : 0.02;
    angleY = (nFrames > -1) ? 4.5 / nFrames : 0.02;

    myClip = addClip();
    myClip.draw = (time) => {
        ctx.save();
        ctx.strokeStyle = color.current.shade;
        ctx.lineWidth = (nFrames > -1) ? 1 : 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < p.length; i++) {

            let [x1, z1] = three.rotate(p[i].x, p[i].z, angleY);
            let [y1, z2] = three.rotate(p[i].y, z1, angleX);

            p[i].x = x1;
            p[i].y = y1;
            p[i].z = z2;

            let [_x, _y] = three.project(vpX, vpY, fl, p[i].x, p[i].y, p[i].z, (nFrames > -1) ? 1 : 2);
            p[i]._x = _x;
            p[i]._y = _y;
        }

        for (let i = 0; i < s.length; i++) {
            let a = p[s[i].a];
            let b = p[s[i].b];
            if (
            (a.z > -fl) && (b.z > -fl) &&
            !(((b._x < 0) && (a._x > width))
            || ((b._x > width) && (a._x < 0))
            || ((b._y < 0) && (a._y > height))
            || ((b._y > height) && (a._y < 0))))
            {
                two.line(ctx, b._x, b._y, a._x, a._y);
            }
        }

        ctx.fillStyle = color.current.shade;
        ctx.beginPath();
        ctx.arc(vpX, vpY, 150 * ((nFrames > -1) ? 1 : 2), 0, Math.PI * 2, false)
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
};

export const remove = () => {
    removeClip(myClip);
};
