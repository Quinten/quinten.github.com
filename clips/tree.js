import colors from '../lib/color.js';

let myClip;

let rotate = (a, b, angle, cos = Math.cos(angle), sin = Math.sin(angle)) => [
    cos * a - sin * b,
    sin * a + cos * b
];

let project = (vpX, vpY, fl, x, y, z, scale = 1, p = fl / (fl + z) * scale) => [
    vpX + x * p,
    vpY + y * p
];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();

    let fl = 400;

    let p = [];
    let s = [];

    p.push({x: 0, y: -40, z: 0});
    p.push({x: 0, y: 200, z: 0});
    s.push({a: 0, b: 1});

    p.push({x: 0, y: -48, z: 12});
    s.push({a: 0, b: 2});
    p.push({x: 0, y: -58, z: 12});
    s.push({a: 2, b: 3});

    p.push({x: 0, y: 0, z: 0});
    p.push({x: 18, y: -20, z: -6});
    s.push({a: 4, b: 5});
    p.push({x: 18, y: -46, z: -6});
    s.push({a: 5, b: 6});
    p.push({x: 27, y: -34, z: -9});
    s.push({a: 5, b: 7});

    p.push({x: 0, y: 50, z: 0});
    p.push({x: 6, y: 26, z: -21});
    s.push({a: 8, b: 9});
    p.push({x: 6, y: -16, z: -21});
    s.push({a: 9, b: 10});
    p.push({x: 9, y: 10, z: -33});
    s.push({a: 9, b: 11});
    p.push({x: 9, y: -34, z: -33});
    s.push({a: 11, b: 12});

    p.push({x: 0, y: 80, z: 0});
    p.push({x: -16, y: 70, z: 6});
    s.push({a: 13, b: 14});
    p.push({x: -16, y: 40, z: 6});
    s.push({a: 14, b: 15});
    p.push({x: -28, y: 60, z: 9});
    s.push({a: 14, b: 16});
    p.push({x: -28, y: 20, z: 9});
    s.push({a: 16, b: 17});
    p.push({x: -40, y: 50, z: 12});
    s.push({a: 16, b: 18});
    p.push({x: -40, y: 35, z: 12});
    s.push({a: 18, b: 19});

    let angleY = (nFrames > -1) ? Math.PI * 2 / nFrames : -0.05;

    myClip.draw = (time) => {

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (nFrames > -1) ? 1 : 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < p.length; i++) {

            let [x1, z1] = rotate(p[i].x, p[i].z, angleY);

            p[i].x = x1;
            p[i].z = z1;

            let [_x, _y] = project(vpX, vpY, fl, p[i].x, p[i].y, p[i].z, (nFrames > -1) ? 1 : 2);
            p[i]._x = _x;
            p[i]._y = _y;
        }

        for (let i = 0; i < s.length; i++) {
            let a = p[s[i].a];
            let b = p[s[i].b];
            if (
            //a.z < fl) && (b.z < fl) &&
            (a.z > -fl) && (b.z > -fl) &&
            !(((b._x < 0) && (a._x > width))
            || ((b._x > width) && (a._x < 0))
            || ((b._y < 0) && (a._y > height))
            || ((b._y > height) && (a._y < 0))))
            {
                line(b._x, b._y, a._x, a._y);
            }
        }
    };
};

export const remove = () => {
    removeClip(myClip);
};
