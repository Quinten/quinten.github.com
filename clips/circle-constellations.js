import colors from '../lib/color.js';

let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 4 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

let myClip;

export const add = () => {
    let nFrames = 512;
    let frameIndex = 0;
    let progress = 0; // 0 -> 1
    let bounce = 0; // 0 -> 1 -> 0

    let color = colors.getRandomColorScheme();
    let invert = !!(Math.round(Math.random()));
    let bgColor = (invert) ? color.pale.hsl : color.dark.hsl;
    let strokeColor = (!invert) ? color.pale.hsl : color.dark.hsl;
    canvas.style.backgroundColor = bgColor;

    myClip = addClip();

    /*
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 4;
        context.fillStyle = '#ecf0f1';
        context.fillRect(-16, -16, 32, 32);
        context.strokeStyle = '#ecf0f1';
        let pulse = time % 2000;
        pulse = pulse * pulse / 4000000;
        context.globalAlpha = 1 - pulse;
        pulse = 16 + pulse * 24;
        context.strokeRect(-pulse, -pulse, pulse * 2, pulse * 2);
    };

    events.on('pointerup', listener);
    */

    function intersection(x0, y0, r0, x1, y1, r1) {
        // https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
        let a, dx, dy, d, h, rx, ry;
        let x2, y2;

        dx = x1 - x0;
        dy = y1 - y0;

        d = Math.sqrt((dy*dy) + (dx*dx));

        if (d > (r0 + r1)) {
            // no solution. circles do not intersect.
            return false;
        }
        if (d < Math.abs(r0 - r1)) {
            // no solution. one circle is contained in the other
            return false;
        }

        a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

        x2 = x0 + (dx * a/d);
        y2 = y0 + (dy * a/d);

        h = Math.sqrt((r0*r0) - (a*a));

        rx = -dy * (h/d);
        ry = dx * (h/d);

        let xi = x2 + rx;
        let xi_prime = x2 - rx;
        let yi = y2 + ry;
        let yi_prime = y2 - ry;

        return [xi, xi_prime, yi, yi_prime];
    }

    let center1 = {
        x: width / 2 - (Math.random() * width / 4),
        y: height / 2 - (Math.random() * height / 4)
    };

    let center2 = {
        x: width / 2 + (Math.random() * width / 3),
        y: height / 2 + (Math.random() * height / 3)
    };

    myClip.draw = function (time) {
        frameIndex = frameIndex + 1;
        if (frameIndex > nFrames) {
            frameIndex = 0;
        }
        progress = frameIndex / nFrames;
        bounce = 1 - Math.abs(1 - progress * 2);

        ctx.save();

        let r = Math.sqrt(height * height + width * width) / 3;

        let circles = [
            {
                x: width / 2 + (center1.x - width / 2) * Math.cos(progress * Math.PI * 2),
                y: height / 2 + (center1.y - height / 2) * Math.sin(progress * Math.PI * 2),
                r: r
            },
            {
                x: width / 2 + (center2.x - width / 2) * Math.sin(progress * Math.PI * 2),
                y: height / 2 + (center2.y - height / 2) * Math.cos(progress * Math.PI * 2),
                r: r
            }
        ];

        for (let c = 0; c < 3; c++) {
            r = r / 3;
            let newCircles = [];
            for (let t = circles.length - 1; t > 0; t--) {
                for (let d = t - 1; d >= 0; d--) {
                    var newPoints = intersection(circles[t].x, circles[t].y, circles[t].r, circles[d].x, circles[d].y, circles[d].r);

                    if (newPoints) {
                        newCircles.push({x: newPoints[0], y: newPoints[2], r: r});
                        newCircles.push({x: newPoints[1], y: newPoints[3], r: r});
                    }
                }
            }
            circles = circles.concat(newCircles);
        }

        ctx.strokeStyle = strokeColor;
        for (let circle of circles) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.r, 0 , Math.PI * 2, false)
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();

    };
};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    removeClip(myClip);
};