let square;
let sx = 0;
let sy = 0;
let listener = (e) => {
    let dx = sx - e.x;
    let dy = sy - e.y;
    let d = Math.sqrt( dx * dx + dy * dy );
    if (d < 48) {
        nextModule();
    }
};

export const add = () => {
    canvas.style.backgroundColor = "#2c3e50";
    square = addClip();
    square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        this.rotation = Math.sin(-time / 600) * Math.PI;
        sx = this.x + 134 * Math.cos(this.rotation);
        sy = this.y + 134 * Math.sin(this.rotation);
        context.fillStyle = '#869496';
        context.strokeStyle = '#869496';
        context.strokeRect(-16, -16, 32, 32);
        context.fillRect(128, -16, 32, 32);
    };
    events.on('pointerup', listener);
};

export const remove = () => {
    events.off('pointerup', listener);
    removeClip(square);
};
