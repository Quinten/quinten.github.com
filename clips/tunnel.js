import colors from '../lib/color.js';

let myClip;

let rotate = (a, b, angle) => [
    Math.cos(angle) * a - Math.sin(angle) * b,
    Math.sin(angle) * a + Math.cos(angle) * b
];

let project = (vpX, vpY, fl, x, y, z) => [
    vpX + x * fl / (fl + z),
    vpY + y * fl / (fl + z)
];

export const add = () => {
    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

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

    let angleZ = (-0.005 + Math.random() / 100) * 2;

    myClip.draw = function (time) {

        context.fillStyle = strokeColor;

        quads.forEach((q) => {
            q.start -= 20;
            if (q.start < -fl + 2) {
                q.length = fl + Math.random() * fl * 2;
                q.start = q.start + fl * 8;
                q.rotation = Math.random() * Math.PI * 2;
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
                let [x, y] = rotate(p.x, p.y, q.rotation);
                arg.push(...project(width/2, height/2, fl, x, y, p.z));
            });
            // draw
            quad(...arg);
        });
    };
};

export const remove = () => {
    removeClip(myClip);
};
