let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 2 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

let bigSquares = [];

export const add = () => {
    canvas.style.backgroundColor = "#16a085";

    bigSquares = [];
    for (let b = 0; b < 16; b++) {
        let bigSquare = addClip();
        bigSquare.phase = b / 15;
        bigSquare.draw = function (time) {
            this.x = width / 2;
            this.y = height * this.phase;
            this.rotation = Math.sin((time + 1200 * this.phase) / 600) * Math.PI;
            this.rotation = Math.max(this.rotation, - Math.PI / 2);
            this.rotation = Math.min(this.rotation, Math.PI / 2);
            context.fillStyle = '#1abc9c';
            context.fillRect(-height / 30, - 8, height / 15, 16);
        };
        bigSquares.push(bigSquare);
    }

    /*
    square = addClip();
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
    */

    events.on('pointerup', listener);
};

export const remove = () => {
    //events.off('pointerup', listener);
    //removeClip(square);
    bigSquares.forEach((bigSquare) => {
        removeClip(bigSquare);
    });
    bigSquares = [];
};
