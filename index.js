var canvas, context, ctx, width, height, clips;

canvas = document.querySelector('.index-canvas');

context = canvas.getContext('2d');
ctx = context; // alias

var canvas3d = document.querySelector('.webgl-canvas');
canvas3d.width = window.innerWidth * 2;
canvas3d.height = window.innerHeight * 2;
window.addEventListener('resize', () => {
    canvas3d.width = window.innerWidth * 2;
    canvas3d.height = window.innerHeight * 2;
});

var gl = canvas3d.getContext('webgl');

// documentation
//console.log(context);

clips = [];

function onF(time) {
    width = canvas.width = canvas.clientWidth * 2;
    height = canvas.height = canvas.clientHeight * 2;
    context.clearRect(0, 0, width, height);
    clips.forEach(function(clip) {
        clip.render(time);
    });
    context.drawImage(canvas3d, window.innerWidth - width / 2, 0, width, height, 0, 0, width, height);
    window.requestAnimationFrame(onF);
}
onF(0);

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

function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.lineTo(x4, y4);
    context.closePath();
    context.fill();
}

function line(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
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

var skipper = document.querySelector('.skipper');

skipper.addEventListener('click', () => {
    nextModule();
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

var events = {
    listeners: {},
    on: function (type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(
            callback
        );
    },
    once: function (type, callback) {
        var disposableCallback = (e) => {
            callback(e);
            this.off(type, disposableCallback);
        };
        this.on(type, disposableCallback);
    },
    off: function (type, callback) {
        if (!this.listeners[type]) {
            return;
        }
        if (!callback) {
            this.listeners[type] = [];
        }
        this.listeners[type].splice(
            this.listeners[type]
                .indexOf(callback),
            1
        );
    },
    emit: function (type, e) {
        if (!this.listeners[type]) {
            return;
        }
        this.listeners[type].forEach(
            (callback) => {
                callback(e);
        });
    }
};

canvas.addEventListener('mouseup', function (e) {
    let rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * 2;
    let y = (e.clientY - rect.top) * 2;
    events.emit('pointerup', {x, y});
});
