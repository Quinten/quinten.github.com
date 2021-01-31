let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 2 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

const scaleX = Math.cos(Math.PI / 4);
const scaleY = Math.sin(Math.PI / 4); // this is actually the same

let bigSquares = [];

export const add = () => {
    canvas.style.backgroundColor = '#3498db';
    bigSquares = [];
    let yes = true;
    for (let b = 0; b < 9; b++) {
        for (let c = 0; c < 9; c++) {
            yes = !yes;
            if (yes) {
            let bigSquare = addClip();
            bigSquare.phase = Math.random();
            bigSquare.gX = b;
            bigSquare.gY = c;
            bigSquare.draw = function (time) {
            let size = Math.max(width, height);
                this.x = this.gX / 8 * size + (width - size) / 2;
                this.y = this.gY / 8 * size + (height - size) / 2;
                //this.rotation = - Math.PI * 3 / 4;
                this.rotation = Math.sin((time + 1200 * this.phase) / 600) * Math.PI * 2;
                this.rotation = Math.max(this.rotation, - Math.PI * 3 / 4);
                this.rotation = Math.min(this.rotation, Math.PI * 3 / 4);
                context.fillStyle = '#2980b9';
                let scale = Math.abs(this.rotation / (Math.PI * 3 / 4));
                context.fillRect(-size / 8 * scaleX * scale, - size / 8 * scaleY * scale, size / 4 * scaleX * scale, size / 4 * scaleY * scale);
            };
            bigSquares.push(bigSquare);
            }
        }
    }

    /*
    square = addClip();
    square.rotation = Math.PI / 4;
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
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
};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};
