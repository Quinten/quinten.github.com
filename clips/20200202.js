let square;

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
    events.once('pointerup', (e) => {
        console.log(e);
        nextModule();
    });
};

export const remove = () => {
    removeClip(square);
};
