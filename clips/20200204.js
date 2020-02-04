let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 2 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 20) {
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
            this.x = width * this.phase;
            this.y = height / 2;
            context.fillStyle = '#1abc9c';
            context.fillRect(-8, - width / 30, 16, width / 15);
        };
        bigSquares.push(bigSquare);
    }

    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        context.fillStyle = '#ecf0f1';
        context.fillRect(-16, -16, 32, 32);
    };

    events.on('pointerup', listener);
};

export const remove = () => {
    events.off('pointerup', listener);
    removeClip(square);
};
