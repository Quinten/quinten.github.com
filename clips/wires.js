import colors from '../lib/color.js';

let myClip;

let project = (vpX, vpY, fl, x, y, z, scale = 1, p = fl / (fl + z) * scale) => [
    vpX + x * p,
    vpY + y * p
];

export const remove = () => {
    removeClip(myClip);
};

export const add = () => {

    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();

    let fl = 512;

    let p = [];
    let s = [];
    let c = [];

    let addPole = (x, z) => {

        s.push({a: p.length, b: p.length + 1});
        p.push({x: x, y: -100, z: z});
        p.push({x: x, y: 100, z: z});

        s.push({a: p.length, b: p.length + 1});
        p.push({x: x - 20, y: -100, z: z});
        p.push({x: x + 20, y: -100, z: z});
        s.push({a: p.length, b: p.length - 2 });
        p.push({x: x - 20, y: -95, z: z});
        s.push({a: p.length, b: p.length - 2 });
        p.push({x: x + 20, y: -95, z: z});
        c.push({a: p.length - 2, b: p.length + 2, c: p.length, d: p.length + 1});

        p.push({x: x - 120, y: -35, z: z + 100});
        p.push({x: x - 176, y: -35, z: z + 156});
        p.push({x: x - 276, y: -95, z: z + 256});
        c.push({a: p.length - 4, b: p.length + 2, c: p.length, d: p.length + 1});

        p.push({x: x - 80, y: -35, z: z + 100});
        p.push({x: x - 136, y: -35, z: z + 156});
        p.push({x: x - 236, y: -95, z: z + 256});

        s.push({a: p.length, b: p.length + 1});
        p.push({x: x - 20, y: -80, z: z});
        p.push({x: x + 20, y: -80, z: z});
        s.push({a: p.length, b: p.length - 2 });
        p.push({x: x - 20, y: -75, z: z});
        s.push({a: p.length, b: p.length - 2 });
        p.push({x: x + 20, y: -75, z: z});
        c.push({a: p.length - 2, b: p.length + 2, c: p.length, d: p.length + 1});

        p.push({x: x - 120, y: -15, z: z + 100});
        p.push({x: x - 176, y: -15, z: z + 156});
        p.push({x: x - 276, y: -75, z: z + 256});
        c.push({a: p.length - 4, b: p.length + 2, c: p.length, d: p.length + 1});

        p.push({x: x - 80, y: -15, z: z + 100});
        p.push({x: x - 136, y: -15, z: z + 156});
        p.push({x: x - 236, y: -75, z: z + 256});
    };

    addPole(256, -256);
    addPole(0, 0);
    addPole(-256, 256);
    addPole(-512, 512);
    addPole(-768, 768);

    let speedX = 256 / ((nFrames > -1) ? nFrames : 256);
    let speedZ = - 256 / ((nFrames > -1) ? nFrames : 256);

    myClip.draw = (time) => {

        let extraX = 0;
        let extraZ = 0;
        if (frameIndex > ((nFrames > -1) ? nFrames : 256)) {
            frameIndex = 0;
            extraX = -256;
            extraZ = 256;
        }

        ctx.save();
        ctx.strokeStyle = strokeColor;

        let vpX = width / 2;
        let vpY = height / 2;
        let scale = width / fl;

        for (let i = 0; i < p.length; i++) {

            p[i].x = p[i].x + speedX + extraX;
            p[i].y = p[i].y;
            p[i].z = p[i].z + speedZ + extraZ;

            let [_x, _y] = project(vpX, vpY, fl, p[i].x, p[i].y, p[i].z, scale);
            p[i]._x = _x;
            p[i]._y = _y;
        }

        ctx.lineWidth = 1;

        for (let i = 0; i < c.length; i++) {
            let a = p[c[i].a];
            let b = p[c[i].b];
            let cp = p[c[i].c];
            let d = p[c[i].d];
            if (((a.z * scale > -fl * scale) || (b.z * scale > -fl * scale)) && (b._x < a._x)) {
                curve(a._x, a._y, cp._x, cp._y, d._x, d._y, b._x, b._y);
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i < s.length; i++) {
            let a = p[s[i].a];
            let b = p[s[i].b];
            if ((a.z * scale > -fl * scale) || (b.z * scale > -fl * scale)) {
                line(b._x, b._y, a._x, a._y);
            }
        }

        ctx.restore();
    };
};
