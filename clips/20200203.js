let square;

export const add = () => {
    canvas.style.backgroundColor = "#2c3e50";
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        this.rotation = Math.sin(-time / 600) * Math.PI;
        context.fillStyle = '#869496';
    context.strokeStyle = '#869496';
        context.strokeRect(-8, -8, 16, 16);
        context.fillRect(64, -8, 16, 16);
    };
    events.once('pointerup', (e) => {
        nextModule();
    });
};

export const remove = () => {
    removeClip(square);
};
