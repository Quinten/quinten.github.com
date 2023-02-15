import color from '../lib/color.js';
import two from '../lib/2d.js';
import three from '../lib/3d.js';

let myClip;

export const add = () => {
    bgKey = 'bg';
    canvas.style.backgroundColor = color.current[bgKey];

    myClip = addClip({unshift: true});

    let fl = 400;
    let bgDropWidth = width;
    let bgDropHeight = -height / 2;

    let quads = [];
    let peakX = -bgDropWidth;
    let peakY = bgDropHeight;
    let z = 200;
    while (peakX < bgDropWidth) {
        let q = {peakX, peakY, z};
        quads.push(q);
        peakX = peakX + bgDropWidth / 16 + Math.random() * bgDropWidth / 8;
        peakY = Math.random() * bgDropHeight;
    }

    let fquads = [];
    peakX = -bgDropWidth;
    peakY = bgDropHeight / 2;
    z = 100;
    while (peakX < bgDropWidth) {
        let q = {peakX, peakY, z};
        fquads.push(q);
        peakX = peakX + bgDropWidth / 16 + Math.random() * bgDropWidth / 8;
        peakY = -bgDropHeight / 2 + Math.random() * bgDropHeight / 2;
    }

    let renderItems = [
        {quads, color: color.current.fill},
        {quads: fquads, color: color.current.shade}
    ];

    if (nFrames > -1) {
        nFrames = 96;
    }

    let delta = 1;
    let prevTime = 0;

    myClip.draw = (time) => {
        delta = Math.min(time - prevTime, 40);
        prevTime = time;
        renderItems.forEach((item) => {
            item.quads.forEach((q) => {
                q.peakX = q.peakX - 5 * delta / 17;
                if (q.peakX < -bgDropWidth) {
                    q.peakX = bgDropWidth;
                }
            });
            item.quads.sort((a, b) => a.peakX - b.peakX);
            ctx.fillStyle = item.color;
            let prevPeakX = -bgDropWidth;
            let prevPeakY = bgDropHeight;
            item.quads.forEach((q) => {
                let points = [
                    {x: prevPeakX, y: prevPeakY, z: q.z},
                    {x: q.peakX, y: q.peakY, z: q.z},
                    {x: q.peakX, y: height, z: q.z},
                    {x: prevPeakX, y: height, z: q.z}
                ];
                prevPeakX = q.peakX;
                prevPeakY = q.peakY;

                let arg = [];
                points.forEach((p) => {
                    arg.push(...three.project(width/2, height/2, fl, p.x, p.y, p.z));
                });
                arg = arg.map((a) => Math.round(a));
                // draw
                two.quad(ctx, ...arg);
            });
        });
    };
};

export const remove = () => {
    removeClip(myClip);
};
