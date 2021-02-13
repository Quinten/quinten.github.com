import colors from '../lib/color.js';

let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 3 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

let myClip;

export const add = () => {
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
        this.y = height / 3;
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

    let angleY = (-0.005 + Math.random() / 100) * 2;

    let cosY = Math.cos(angleY);
    let sinY = Math.sin(angleY);

    let angleX = (-0.005 + Math.random() / 100) * 2;
    let cosX = Math.cos(angleX);
    let sinX = Math.sin(angleX);

    let fl = 400;

    let p = [];
    let numPoints = 256;
    let lineSize = 40;
    var Lx = 0, Ly = 0, Lz = 0;
    function plotOn() {
        let d = Math.round(Math.random()) ? lineSize : -lineSize;
        let r = Math.random() * 3;
        //if (r > 2) Lx = Lx + d;
        //if (r < 1) Ly = Ly + d;
        //if (r < 2 && r > 1) Lz = Lz + d;

        if(r>2)Lx=(Lx+d>fl||Lx+d<-fl)?Lx-d:Lx+d;
        if(r<1)Ly=(Ly+d>fl||Ly+d<-fl)?Ly-d:Ly+d;
        if(r<2&&r>1)Lz=(Lz+d>fl||Lz+d<-fl)?Lz-d:Lz+d;
    };
    for (let i = 0; i < numPoints; i++) {
        p[i] = {};
        plotOn();
        p[i].x =  Lx;
        p[i].y = Ly;
        p[i].z = Lz;
    }

    myClip.draw = function (time) {

        context.strokeStyle = strokeColor;
        context.lineWidth = 2;

        let vpX = width / 2;
        let vpY = height / 2;
        for (let i = 0; i < numPoints; i++) {

            let x1 = p[i].x * cosY - p[i].z * sinY;
            let z1 = p[i].z * cosY + p[i].x * sinY;

            let y1 = p[i].y * cosX - z1 * sinX;
            let z2 = z1 * cosX + p[i].y * sinX;

            p[i].x = x1;
            p[i].y = y1;
            p[i].z = z2;

            let scale = fl / (fl + p[i].z);
            p[i]._x = vpX + p[i].x * scale;
            p[i]._y = vpY + p[i].y * scale;
        }

        let prevP = p[0];
        for (let i = 1; i < numPoints; i++) {
            if (
            //(p[i].z < fl) && (prevP.z < fl) &&
            (p[i].z > -fl) && (prevP.z > -fl) &&
            !(((prevP._x < 0) && (p[i]._x > width))
            || ((prevP._x > width) && (p[i]._x < 0))
            || ((prevP._y < 0) && (p[i]._y > height))
            || ((prevP._y > height) && (p[i]._y < 0))))
            {
                line(prevP._x, prevP._y, p[i]._x, p[i]._y);
            }
            prevP = p[i];
        }
        prevP = p.shift();
        plotOn();
        prevP.x =  Lx;
        prevP.y = Ly;
        prevP.z = Lz;
        p.push(prevP);
    };


};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    removeClip(myClip);
};
