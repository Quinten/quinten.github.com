let canvas, context, ctx, width, height, clips;

canvas = document.querySelector('.index-canvas');

context = canvas.getContext('2d');
ctx = context; // alias

let canvas3d = document.querySelector('.webgl-canvas');
canvas3d.width = 2048;
canvas3d.height = 1024;

let gl = canvas3d.getContext('webgl', { preserveDrawingBuffer: true });

// documentation
//console.log(context);

clips = [];

let globalTime = 0;
let timeouts = [];

let createTimeout = (callback, duration, ...args) => {
    let end = globalTime + duration;
    let timeout = {callback, end, args};
    timeouts.push(timeout);
    return timeout;
};

let destroyTimeout = (timeout) => {
    timeouts.splice(timeouts.indexOf(timeout), 1);
};

let onF = (time) => {
    width = canvas.width = canvas.clientWidth * 2;
    height = canvas.height = canvas.clientHeight * 2;
    context.clearRect(0, 0, width, height);

    globalTime = time;
    for (let t = timeouts.length - 1; t >= 0; t--) {
        if (timeouts[t].end <= globalTime) {
            timeouts[t].callback(...timeouts[t].args);
            destroyTimeout(timeouts[t]);
        }
    }

    clips.forEach((clip) => {
        clip.render(time);
    });

    window.requestAnimationFrame(onF);
};
onF(0);

let addClip = ({
    x = 0,
    y = 0,
    rotation = 0,
    unshift = false
} = {}) => {

    let clip = {x, y, rotation};

    clip.draw = () => {};

    clip.render = (time) => {
        context.save();
        context.translate(clip.x, clip.y);
        context.rotate(clip.rotation);
        clip.draw(time);
        context.restore();
    };

    if (unshift) {
        clips.unshift(clip);
    } else {
        clips.push(clip);
    }

    return clip;
};

let removeClip = (clip) => {
    clips.splice(clips.indexOf(clip), 1);
};

let quad = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.lineTo(x4, y4);
    context.closePath();
    context.fill();
};

let line = (x1, y1, x2, y2) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
};

let expanded = false;
let expander = document.querySelector('.expander');

if (expander) {
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
}

let skipper = document.querySelector('.skipper');

if (skipper) {
    skipper.addEventListener('click', () => {
        nextModule();
    });
}

let modules = [], currentModule, moduleIndex = -1;

let nextModule = async () => {
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
    let newModule = await import(
        './clips/' + modules[moduleIndex]
    );
    newModule.add();
    currentModule = newModule;
};

if (skipper || expander) {
    fetch('./clips.json').then((response) => {
        return response.json();
    }).then((data) => {
        modules = data;
        nextModule();
    });
}

// press f for fullscreen canvas
window.addEventListener('keyup', e => {
    if (e.keyCode === 70) {
        canvas.requestFullscreen();
    }
});
