var canvas, context, width, height, clips;

canvas = document.querySelector('canvas');

context = canvas.getContext('2d');

// documentation
console.log(context);

clips = [];

function onF(time) {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
    context.fillStyle = '#869496';
    context.strokeStyle = '#869496';
    context.clearRect(0, 0, width, height);
    clips.forEach(function(clip) {
        clip.render(time);
    });
    window.requestAnimationFrame(onF);
}
window.requestAnimationFrame(onF);

function createClip({
    x = 0,
    y = 0,
    rotation = 0
} = {}) {

    var clip = {x, y, rotation};

    clip.draw = function() {};

    clip.render = function(time) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        this.draw(time);
        context.restore();
    };

    return clip;
}

var expanded = false;
var expander = document.querySelector('.expander');

expander.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
        expander.textContent = '-';
        canvas.classList.add('expanded');
    } else {
        expander.textContent = '+';
        canvas.classList.remove('expanded');
    }
});

// rotating square
var square = createClip();
square.draw = function (time) {
    this.x = width / 2;
    this.y = height / 2;
    this.rotation = Math.sin(-time / 600) * Math.PI;
    context.fillRect(64, -8, 16, 16);
    //context.strokeRect(-8, -8, 32, 32);
};
clips.push(square);