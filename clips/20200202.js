export const add = () => {
    console.log('add');
    let square = createClip();
square.draw = function (time) {
        this.x = width / 2;
        this.y = height / 2;
        this.rotation = Math.sin(-time / 600) * Math.PI;
        context.fillRect(-8, -8, 16, 16);
        context.strokeRect(64, -8, 16, 16);
    };
    clips.push(square);
};

export const remove = () => {
};

export default () => {
    console.log('Js works?');
};

