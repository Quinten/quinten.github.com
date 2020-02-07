let square;
let listener = (e) => {
    let dx = width / 2 - e.x;
    let dy = height / 2 - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

export const add = () => {
    canvas.style.backgroundColor = "#8e44ad";
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        this.rotation = Math.sin(-time / 600) * Math.PI;
        context.fillStyle = '#f39c12';
        context.strokeStyle = '#f39c12';
        context.fillRect(-16, -16, 32, 32);
        context.strokeRect(128, -16, 32, 32);
    };
    events.on('pointerup', listener);
};

export const remove = () => {
    events.off('pointerup', listener);
    removeClip(square);
};
