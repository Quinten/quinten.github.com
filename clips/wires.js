import colors from '../lib/color.js';

let myClip;

export const remove = () => {
    removeClip(myClip);
};

export const add = () => {
    let nFrames = 256;
    let frameIndex = 0;
    let progress = 0; // 0 -> 1
    let bounce = 0; // 0 -> 1 -> 0

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

    let line = (x1, y1, x2, y2) => {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    let curve = (x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2) => {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
        ctx.stroke();
    };

    let speedX = 256 / nFrames;
    let speedZ = - 256 / nFrames;

    myClip.draw = (time) => {
        let extraX = 0;
        let extraZ = 0;
        frameIndex = frameIndex + 1;
        if (frameIndex > nFrames) {
            frameIndex = 0;
            extraX = -256;
            extraZ = 256;
        }
        progress = frameIndex / nFrames;
        bounce = 1 - Math.abs(1 - progress * 2);

        let sceneScale = width / fl;

        ctx.save();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < p.length; i++) {
            p[i].x = p[i].x + speedX + extraX;
            p[i].y = p[i].y;
            p[i].z = p[i].z + speedZ + extraZ;

            let scale = fl * sceneScale / (fl * sceneScale + p[i].z * sceneScale);
            p[i]._x = vpX + p[i].x * sceneScale * scale;
            p[i]._y = vpY + p[i].y * sceneScale * scale;
        }

        for (let i = 0; i < c.length; i++) {
            let a = p[c[i].a];
            let b = p[c[i].b];
            let cp = p[c[i].c];
            let d = p[c[i].d];
            if (
            //a.z < fl) && (b.z < fl) &&
            ((a.z * sceneScale > -fl * sceneScale) || (b.z * sceneScale > -fl * sceneScale))
            && (b._x < a._x)
            /*
            ((a.z * sceneScale > -fl * sceneScale) || (b.z * sceneScale > -fl * sceneScale)) &&
            !(((b._x < 0) && (a._x > width))
            || ((b._x > width) && (a._x > width))
            || ((b._x < 0) && (a._x < 0))
            || ((b._x > width) && (a._x < 0))
            || ((b._y < 0) && (a._y > height))
            || ((b._y < 0) && (a._y < 0))
            || ((b._y > height) && (a._y > height))
            || ((b._y > height) && (a._y < 0)))
            && ((b._x > 0) && (a._x > 0))
            */
            ) {
                curve(a._x, a._y, cp._x, cp._y, d._x, d._y, b._x, b._y);
            }
        }

        for (let i = 0; i < s.length; i++) {
            let a = p[s[i].a];
            let b = p[s[i].b];
            if (
            //a.z < fl) && (b.z < fl) &&
            ((a.z * sceneScale > -fl * sceneScale) || (b.z * sceneScale > -fl * sceneScale))
            /*
            ((a.z * sceneScale > -fl * sceneScale) || (b.z * sceneScale > -fl * sceneScale)) &&
            !(((b._x < 0) && (a._x > width))
            || ((b._x > width) && (a._x > width))
            || ((b._x < 0) && (a._x < 0))
            || ((b._x > width) && (a._x < 0))
            || ((b._y < 0) && (a._y > height))
            || ((b._y < 0) && (a._y < 0))
            || ((b._y > height) && (a._y > height))
            || ((b._y > height) && (a._y < 0)))
            */
            ) {
                line(b._x, b._y, a._x, a._y);
            }
        }

        ctx.restore();
    };
};
