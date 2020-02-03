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
        context.fillRect(-8, -8, 16, 16);
        context.strokeRect(64, -8, 16, 16);
    };
};

export const remove = () => {
    removeClip(square);
};
