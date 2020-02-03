let square;

export const add = () => {
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        this.rotation = Math.sin(-time / 600) * Math.PI;
        context.fillRect(-8, -8, 16, 16);
        context.strokeRect(64, -8, 16, 16);
    };
};

export const remove = () => {
    removeClip(square);
};
