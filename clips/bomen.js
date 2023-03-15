import color from '../lib/color.js';
import two from '../lib/2d.js';
import three from '../lib/3d.js';

let myClip;

export const add = () => {
    bgKey = 'bg';
    canvas.style.backgroundColor = color.current[bgKey];

    myClip = addClip({unshift: true});

    let fl = 400;
    let bgDropWidth = Math.max(width, 4096);
    let bgDropHeight = -height / 2;

    let quads = [];
    let peakX = -bgDropWidth;
    let peakY = bgDropHeight;
    let z = 200;
    let n = 0;
    while (peakX < bgDropWidth) {
        let q = {peakX, peakY, z, n};
        quads.push(q);
        let dx = bgDropWidth / 16 + Math.random() * bgDropWidth / 8;
        peakX = peakX + dx;
        let dy = Math.random() * dx / 4 + dx / 4;
        if (peakY > -bgDropHeight) {
            peakY = peakY - dy;
        }
        else if (peakY < bgDropHeight) {
            peakY = peakY + dy;
        }
        else {
            peakY = peakY + (Math.random() > 0.5 ? dy : -dy);
        }
        n = Math.round(Math.random() * 3) + 1;
    }

    let fquads = [];
    peakX = -bgDropWidth;
    bgDropHeight = bgDropHeight / 2;
    peakY = bgDropHeight;
    z = 100;
    n = 0;
    while (peakX < bgDropWidth) {
        let q = {peakX, peakY, z, n};
        fquads.push(q);
        let dx = bgDropWidth / 16 + Math.random() * bgDropWidth / 8;
        peakX = peakX + dx;
        let dy = Math.random() * dx / 4 + dx / 4;
        if (peakY > -bgDropHeight) {
            peakY = peakY - dy;
        }
        else if (peakY < bgDropHeight) {
            peakY = peakY + dy;
        }
        else {
            peakY = peakY + (Math.random() > 0.5 ? dy : -dy);
        }
        n = Math.round(Math.random() * 3) + 1;
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
            item.quads.forEach((q, index) => {
                let points = [
                    {x: prevPeakX, y: prevPeakY, z: q.z},
                    {x: q.peakX, y: q.peakY, z: q.z},
                    {x: q.peakX, y: height, z: q.z},
                    {x: prevPeakX, y: height, z: q.z}
                ];

                let arg = [];
                points.forEach((p) => {
                    arg.push(...three.project(width/2, height/2, fl, p.x, p.y, p.z));
                });
                arg = arg.map((a) => Math.round(a));
                // draw
                two.quad(ctx, ...arg);
                // create an array with 1, 2, 3 or 4 points between the two peaks
                let {n} = q;
                points = [];
                for (let i = 0; i < n; i++) {
                    let x = prevPeakX + (q.peakX - prevPeakX) * (i + 1) / (n + 1);
                    let y = prevPeakY + (q.peakY - prevPeakY) * (i + 1) / (n + 1);
                    points.push({x, y, z: q.z});
                }
                points.forEach((p) => {
                    let [x, y] = three.project(width/2, height/2, fl, p.x, p.y, p.z);
                    x = Math.round(x);
                    y = Math.round(y);
                    ctx.fillRect(x - 2, y - 20, 4, 20);
                    ctx.fillRect(x - 8, y - 68, 16, 48);
                });

                prevPeakX = q.peakX;
                prevPeakY = q.peakY;
            });
        });
    };
};

export const remove = () => {
    removeClip(myClip);
};
