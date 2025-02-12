let canvas, context, ctx, width, height, clips;

canvas = document.querySelector('.index-canvas');

context = canvas.getContext('2d');
ctx = context; // alias
// documentation
//console.log(context);

let canvas3d = document.querySelector('.webgl-canvas');
canvas3d.width = 2048;
canvas3d.height = 1024;

let gl = canvas3d.getContext('webgl', { preserveDrawingBuffer: true });

let nFrames = -1;
let frameIndex = 0;
let startFrame = 0;

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

    frameIndex = frameIndex + 1;
    globalTime = time;
    for (let t = timeouts.length - 1; t >= 0; t--) {
        if (timeouts[t] !== undefined && timeouts[t].end <= globalTime) {
            timeouts[t].callback(...timeouts[t].args);
            destroyTimeout(timeouts[t]);
        }
    }

    clips.forEach((clip) => {
        clip.step(time);
    });

    clips.forEach((clip) => {
        clip.render(time);
    });

    window.requestAnimationFrame(onF);
};
onF(0);

let bgKey = 'bg';

import('./lib/color.js').then((color) => {
    let updateColor = () => {
        color.default.updateCurrent();
        canvas.style.backgroundColor = color.default.current[bgKey];
        createTimeout(updateColor, 5000);
    };
    updateColor();
});

let addClip = ({
    x = 0,
    y = 0,
    rotation = 0,
    unshift = false
} = {}) => {

    let clip = {x, y, rotation};

    clip.step = () => {};

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

let expanded = false;
let expander = document.querySelector('.expander');

if (expander) {
    expander.addEventListener('click', () => {
        expanded = !expanded;
        if (expanded) {
            expander.setAttribute('title', 'Fold');
            expander.classList.remove('icon-expand');
            expander.classList.add('icon-fold');
            canvas.classList.add('expanded');
        } else {
            expander.setAttribute('title', 'Expand');
            expander.classList.remove('icon-fold');
            expander.classList.add('icon-expand');
            canvas.classList.remove('expanded');
        }
    });
}

let skipper = document.querySelector('.skipper');

if (skipper) {
    skipper.addEventListener('click', () => {
        if (chaosMode) {
            chaoser.style.display = 'block';
            giffer.style.display = 'block';
            destroyTimeout(chaosTO);
            chaosMode = false;
        }
        nextModule();
    });
}

let fullscreener = document.querySelector('.fullscreener');

if (fullscreener) {
    if (document.fullscreenEnabled) {
        fullscreener.addEventListener('click', () => {
            canvas.requestFullscreen().catch((err) => {});
        });
    } else {
        fullscreener.style.display = 'none';
        document.body.classList.add('no-fullscreen');
    }
}

let modules = [], moduleIndex = -1;

let nextModule = async () => {
    if (!modules.length) {
        return;
    }

    purgeShuffles();

    moduleIndex++;
    if (moduleIndex >= modules.length) {
        moduleIndex = 0;
    }
    let newModule = await import(
        './clips/' + modules[moduleIndex]
    );
    if (newModule.usesWebgl) {
        webglContextBusy = true;
    }
    newModule.add();
    shuffles = [newModule];
    if (giffer) {
        giffer.setAttribute('href', '/makegif.html?' + modules[moduleIndex].substr(0, modules[moduleIndex].length - 3));
    }
};

if (skipper || expander) {
    fetch('./clips.json').then((response) => {
        return response.json();
    }).then((data) => {
        modules = data;
        moduleIndex = Math.floor(Math.random() * modules.length);
        nextModule();
    });
}

let shuffleInterval = 4000;
let shuffles = [];
let webglContextBusy = false;
let chaosMode = false;
let chaosTO;

let purgeShuffles = (max = 1) => {
    while (shuffles.length >= max) {
        let oldest = shuffles.shift();
        if (oldest.remove) {
            if (oldest.usesWebgl) {
                webglContextBusy = false;
            }
            oldest.remove();
        }
    }
};

let shuffleModule = async () => {
    if (!modules.length) {
        return;
    }

    purgeShuffles(3);

    let randomIndex = Math.floor(Math.random() * modules.length);
    let newModule = await import(
        './clips/' + modules[randomIndex]
    );
    if (!chaosMode) {
        return;
    }
    if (shuffles.indexOf(newModule) === -1 && !(newModule.usesWebgl && webglContextBusy)) {
        newModule.add();
        if (newModule.usesWebgl) {
            webglContextBusy = true;
        }
        shuffles.push(newModule);
    }

    chaosTO = createTimeout(shuffleModule, shuffleInterval);
};

let chaoser = document.querySelector('.chaoser');

if (chaoser) {
    chaoser.addEventListener('click', () => {
        chaosMode = true;
        shuffleModule();
        chaoser.style.display = 'none';
        giffer.style.display = 'none';
    });
}

let giffer = document.querySelector('.giffer');

// press f for fullscreen canvas
window.addEventListener('keyup', e => {
    if (e.keyCode === 70) {
        canvas.requestFullscreen();
    }
});
