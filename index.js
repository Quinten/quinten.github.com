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

function addClip({
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

    clips.push(clip);

    return clip;
}

function removeClip(clip) {
    clips.splice(clips.indexOf(clip), 1);
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

var modules = [], currentModule, moduleIndex = -1;

async function nextModule() {
    if (!modules.length) {
        return;
    }
    if (currentModule && currentModule.remove) {
        currentModule.remove();
    }
    moduleIndex++;
    if (moduleIndex >= modules.length) {
        moduleIndex = 0;
    }
    var newModule = await import(
        './clips/' + modules[moduleIndex]
    );
    newModule.add();
    currentModule = newModule;
};

fetch('./clips.json').then((response) => {
    return response.json();
}).then((data) => {
    modules = data;
    nextModule();
});

// tmp
canvas.addEventListener('click', function () {
    nextModule();
});
