import color from '../lib/color.js';
import two from '../lib/2d.js';
import three from '../lib/3d.js';

let myClip;

export const add = () => {
    bgKey = 'bg';
    canvas.style.backgroundColor = color.current[bgKey];

    myClip = addClip({unshift: true});

    let fl = 400;

    let quads = [];
    let numQuads = 11;
    for (let i = 0; i < numQuads; i++) {
        let start = Math.random() * fl * 7;
        let length = fl + Math.random() * fl * 2;
        let rotation = Math.random() * Math.PI * 2;
        let q = { start, length, rotation };
        quads.push(q);
    }

    if (nFrames > -1) {
        nFrames = 96;
    }

    let angleZ = (nFrames > -1) ? (Math.PI * 2 / nFrames): (-0.005 + Math.random() / 100) * 2;

    myClip.draw = (time) => {

        ctx.fillStyle = color.current.stroke;

        quads.forEach((q) => {
            q.start -= (nFrames > -1) ? fl * 8 / nFrames : 20;
            if (q.start < -fl + 2) {
                q.length = (nFrames > -1) ? q.length : fl + Math.random() * fl * 2;
                q.start = q.start + fl * 8;
                q.rotation = (nFrames > -1) ? q.rotation : Math.random() * Math.PI * 2;
            }
            q.rotation = q.rotation + angleZ;
            let points = [
                {x: -10, y: 80, z: q.start},
                {x: 10, y: 80, z: q.start},
                {x: 10, y: 80, z: Math.max(q.start - q.length, -fl + 1)},
                {x: -10, y: 80, z: Math.max(q.start - q.length, -fl + 1)}
            ];

            let arg = [];
            points.forEach((p) => {
                let [x, y] = three.rotate(p.x, p.y, q.rotation);
                arg.push(...three.project(width/2, height/2, fl, x, y, p.z));
            });
            // draw
            two.quad(ctx, ...arg);
        });
    };
};

export const remove = () => {
    removeClip(myClip);
};
