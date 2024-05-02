import {connect} from './collection.js';

let updateList = () => {
    let list = document.getElementById('list');
    list.innerHTML = '';
    collection.list({
        onItem: item => {
            let {key, value} = item;
            let {content} = value;
            let img = document.createElement('img');
            img.src = 'data:image/svg+xml,' + encodeURIComponent(content);
            img.dataset.key = key;
            img.onclick = e => {
                collection.open({
                    key: Number(e.target.dataset.key),
                    onOpened: svgContent => {
                        codeToImg(svgContent);
                        openView('editor');
                    }
                });
            };
            list.prepend(img);
        }
    });
};

let collection = connect({onConnected: updateList});

let autoSave = () => {
    collection.save({content: imgToCode()});
};

let codeToImg = (currentSvg) => {
    let svgimg = document.getElementById('svgimg');
    let svgcode = document.getElementById('svgcode');
    svgcode.value = currentSvg;
    svgimg.innerHTML = currentSvg;
    let cursorsvg = document.getElementById('svgcursors').querySelector('svg');
    let imgsvg = svgimg.querySelector('svg');
    let width = imgsvg.getAttribute('width');
    let height = imgsvg.getAttribute('height');
    let viewBox = imgsvg.getAttribute('viewBox');
    if (width) {
        cursorsvg.setAttribute('width', width);
    }
    if (height) {
        cursorsvg.setAttribute('height', height);
    }
    if (viewBox) {
        cursorsvg.setAttribute('viewBox', viewBox);
    }
};

let imgToCode = () => {
    let svgimg = document.getElementById('svgimg');
    let svgcode = document.getElementById('svgcode');
    svgcode.value = svgimg.innerHTML;
    return svgcode.value;
};

// button actions

window.newSvg = e => {
    collection.create({
        onCreated: content => {
            codeToImg(content);
            openView('editor');
        }
   });
};

window.importSvg = e => {
    collection.importItem({
        onImported: content => {
            codeToImg(content);
            openView('editor');
        }
   });
};

window.openGallery = e => {
    collection.save({
        content: imgToCode(),
        onSaved: () => {
            updateList();
            openView('gallery');
        }
    });
};

window.exportSvg = e => {
    collection.exportItem();
};

window.openSource = () => {
    collection.save({
        content: imgToCode(),
        onSaved: () => {
            openView('source');
        }
    });
};

window.applySource = () => {
    collection.save({
        content: document.getElementById('svgcode').value,
        onSaved: content => {
            codeToImg(content);
            openView('editor');
        }
    });
};

window.discardSource = () => {
    openView('editor');
};

let toggleToEl = id => {
    let elToShow = document.getElementById(id);
    let siblingSel = '.' + elToShow.className.split(' ').join('.');
    let siblings = elToShow.parentElement.querySelectorAll(siblingSel);
    siblings.forEach(sibling => {
        sibling.style.display = sibling === elToShow ? 'block' : 'none';
    });
};

window.onViewOpen = e => {};

window.openView = view => {
    toggleToEl(view);
    window.onViewOpen({view});
};

// select actions

let selectedElements = [];
let selectedCursors = [];
let deselectAllElements = () => {
    while (selectedElements.length > 0) {
        selectedElements.pop();
        selectedCursors.pop().remove();
    }
    toggleToEl('svgtools');
};
let selectElement = el => {
    let svgcursors = document.getElementById('svgcursors').querySelector('svg');
    if (el.closest('#svgimg') && el.tagName !== 'svg') {
        if (selectedElements.includes(el)) {
            let i = selectedElements.indexOf(el);
            selectedElements.splice(i, 1);
            selectedCursors[i].remove();
            selectedCursors.splice(i, 1);
        } else {
            selectedElements.push(el);
            let cursor = el.cloneNode(true);
            svgcursors.appendChild(cursor);
            selectedCursors.push(cursor);
        }
        if (selectedElements.length === 1) {
            let sel = selectedElements[0];
            let fill = sel.getAttribute('fill');
            let stroke = sel.getAttribute('stroke');
            let width = sel.getAttribute('stroke-width');
            if (fill) {
                document.getElementById('fillcolor').value = fill;
            }
            if (stroke) {
                document.getElementById('strokecolor').value = stroke;
            }
            if (width) {
                document.getElementById('strokewidth').value = width;
            }
        }
    } else {
        deselectAllElements();
    }
    toggleToEl(selectedElements.length > 0 ? 'pathtools' : 'svgtools');
};

window.removeElements = () => {
    selectedElements.forEach(el => {
        el.remove();
    });
    deselectAllElements();
    autoSave();
};

window.raiseElements = () => {
    let allElements = Array.from(document.getElementById('svgimg').querySelector('svg').children);
    let highestSibling = allElements[0];
    let moveUp = [...selectedElements];
    moveUp.sort((a, b) => {
        return allElements.indexOf(a) - allElements.indexOf(b);
    });
    highestSibling = allElements.reduce((acc, el) => {
        if (moveUp.includes(el)) {
            if (el.nextElementSibling && !moveUp.includes(el.nextElementSibling)) {
                return el.nextElementSibling;
            } else {
                return el;
            }
        } else {
            return acc;
        }
    }, highestSibling);
    if (!moveUp.includes(highestSibling)) {
        moveUp.reverse().forEach(el => {
            highestSibling.after(el);
        });
    }
    autoSave();
};

window.lowerElements = () => {
    let allElements = Array.from(document.getElementById('svgimg').querySelector('svg').children);
    let lowestSibling = allElements[allElements.length - 1];
    let moveDown = [...selectedElements];
    moveDown.sort((a, b) => {
        return allElements.indexOf(b) - allElements.indexOf(a);
    });
    lowestSibling = allElements.reverse().reduce((acc, el) => {
        if (moveDown.includes(el)) {
            if (el.previousElementSibling && !moveDown.includes(el.previousElementSibling)) {
                return el.previousElementSibling;
            } else {
                return el;
            }
        } else {
            return acc;
        }
    }, lowestSibling);
    if (!moveDown.includes(lowestSibling)) {
        moveDown.reverse().forEach(el => {
            lowestSibling.before(el);
        });
    }
    autoSave();
};

window.fillElements = () => {
    selectedElements.forEach(el => {
        el.setAttribute('fill', document.getElementById('fillcolor').value);
    });
    autoSave();
};

window.strokeElements = () => {
    let stroke = document.getElementById('strokecolor').value;
    let width = document.getElementById('strokewidth').value;
    if (Number(width) && Number(width) > 0) {
        selectedElements.forEach(el => {
            el.setAttribute('stroke', stroke);
            el.setAttribute('stroke-width', width);
        });
    } else {
        selectedElements.forEach(el => {
            el.removeAttribute('stroke');
            el.removeAttribute('stroke-width');
        });
    }
    autoSave();
};

let rounding = 32;

let drawGridDots = () => {
    let svgcursors = document.getElementById('svgcursors').querySelector('svg');
    svgcursors.style.background = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + rounding + ' ' + rounding + '"><circle cx="' + (rounding - 1) + '" cy="' + (rounding - 1) + '" r="1" fill="black" /></svg>') + '")';
    let zoom = svgcursors.clientWidth / svgcursors.viewBox.baseVal.width;
    svgcursors.style.backgroundSize = (rounding * zoom) + 'px ' + (rounding * zoom) + 'px';
    svgcursors.style.backgroundRepeat = 'repeat';
};
drawGridDots();

window.updateRounding = () => {
    rounding = Number(document.getElementById('rounding').value);
    drawGridDots();
};

// editor

document.querySelectorAll('.custom-touch').forEach(container => {

    let currentPad = undefined;
    let drawPath = (e) => {
        if (selectedElements.length > 0) {
            return;
        }
        let cursorsvg = document.getElementById('svgcursors').querySelector('svg');
        let imgsvg = document.getElementById('svgimg').querySelector('svg');
        let width = imgsvg.getAttribute('width');
        if (!width) {
            let viewBox = imgsvg.getAttribute('viewBox');
            if (viewBox) {
                width = viewBox.split(' ')[2];
            }
        }
        let x = 0;
        let y = 0;
        if (e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        let offsetX = imgsvg.getBoundingClientRect().left;
        let offsetY = imgsvg.getBoundingClientRect().top;
        x -= offsetX;
        y -= offsetY;
        width = Number(width);
        let zoom = width / imgsvg.clientWidth;
        x = x * zoom;
        y = y * zoom;
        x = x - (x % rounding);
        y = y - (y % rounding);
        if (currentPad === undefined) { 
            currentPad = "M " + x + " " + y;
            cursorsvg.innerHTML = '<path d="' + currentPad + ' L ' + (x + 4) + ' ' + (y + 4) + ' Z" />';
        } else {
            currentPad += " L " + x + " " + y;
            cursorsvg.innerHTML = '<path d="' + currentPad + ' Z" />';
        }
    };
    let endPath = (e) => {
        if (currentPad !== undefined) {
            let cursorsvg = document.getElementById('svgcursors').querySelector('svg');
            let imgsvg = document.getElementById('svgimg').querySelector('svg');
            currentPad += " Z";
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', currentPad);
            imgsvg.appendChild(path);
            currentPad = undefined;
            cursorsvg.innerHTML = '';
            selectElement(path);
            fillElements();
            strokeElements();
        } else {
            let el = e.target;
            selectElement(el);
        }
    };

    let nTaps = 0;
    let handleTaps = e => {
        nTaps++;
        if (nTaps === 1) {
            setTimeout(() => {
                if (nTaps === 1 && !touchId2) {
                    drawPath(e);
                }
                if (nTaps === 2 && !touchId2) {
                    endPath(e);
                }
                nTaps = 0;
            }, 300);
        }
    };

    let inner = container.querySelector('.custom-touch-inner');
    let left = 0;
    let top = 0;
    let startWidth = inner.clientWidth;
    let panStarted = false;
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    let startScale = 1;

    let prePanning = () => {
        if (panStarted) {
            return;
        }
        container.style.cursor = 'grab';
    };
    let startPanning = (x, y, scale) => {
        startX = x;
        startY = y;
        startScale = scale;
        panStarted = true;
    };
    let updatePanning = (x, y, scale) => {
        if (!panStarted) {
            return;
        }
        let dScale = scale / startScale;
        let dX = (x - startX);
        let dY = (y - startY);
        dX = dX + (left - startX) * (dScale - 1);
        dY = dY + (top - startY) * (dScale - 1);
        inner.style.left = (left + dX) + 'px';
        inner.style.top = (top + dY) + 'px';
        inner.style.width = (startWidth * dScale) + 'px';
        let cursor = dScale > 1 ? 'zoom-in' : dScale < 1 ? 'zoom-out' : 'grabbing';
        container.style.cursor = cursor;
        drawGridDots();
    };
    let stopPanning = () => {
        top = Number(inner.style.top.replace('px', ''));
        left = Number(inner.style.left.replace('px', ''));
        startWidth = inner.clientWidth;
        container.style.cursor = 'auto';
        panStarted = false;
    };
    let resetPanning = () => {
        left = 0;
        top = 0;
        startWidth = window.innerWidth;
        startPanning(0, 0, 1);
        updatePanning(0, 0, 1);
        stopPanning();
    };
    resetPanning();

    let oldOnViewOpen = window.onViewOpen;
    window.onViewOpen = e => {
        oldOnViewOpen(e);
        if (e.view === 'editor') {
            resetPanning();
        } else {
            deselectAllElements();
        }
    };

    // touch

    let touchId1 = undefined;
    let touchId2 = undefined;
    let touch1 = undefined;
    let touch2 = undefined;

    container.addEventListener('touchstart', e => {
        e.preventDefault();
        let touches = e.touches;
        if (touches.length > 1 && touchId1 === undefined && touchId2 === undefined) {
            touchId1 = touches[0].identifier;
            touchId2 = touches[1].identifier;
            touch1 = touches[0];
            touch2 = touches[1];
            let x = touch1.screenX + (touch2.screenX - touch1.screenX) / 2;
            let y = touch1.screenY + (touch2.screenY - touch1.screenY) / 2;
            let scale = Math.hypot(touch2.screenX - touch1.screenX, touch2.screenY - touch1.screenY);
            startPanning(x, y, scale);
        }
        if (touches.length === 1) {
            handleTaps(e);  
        }
    });
    container.addEventListener('touchmove', e => {
        e.preventDefault();
        let touches = e.touches;
        if (touches.length > 1 && touchId1 !== undefined && touchId2 !== undefined) {
            for (let i = 0; i < touches.length; i++) {
                let touch = touches[i];
                if (touch.identifier === touchId1) {
                    touch1 = touch;
                } else if (touch.identifier === touchId2) {
                    touch2 = touch;
                }
            }
            let x = touch1.screenX + (touch2.screenX - touch1.screenX) / 2;
            let y = touch1.screenY + (touch2.screenY - touch1.screenY) / 2;
            let scale = Math.hypot(touch2.screenX - touch1.screenX, touch2.screenY - touch1.screenY);
            updatePanning(x, y, scale);
        }
    });
    container.addEventListener('touchend', e => {
        e.preventDefault();
        let touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let touch = touches[i];
            if (touch.identifier === touchId1 || touch.identifier === touchId2) {
                touchId1 = undefined;
                touchId2 = undefined;
                stopPanning();
            }
        }
    });

    // desktop
    let spaceDown = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    window.addEventListener('keydown', e => {
        if (e.keyCode === 32) {
            spaceDown = true;
            prePanning();
        }
    });
    window.addEventListener('keyup', e => {
        if (e.keyCode === 32) {
            spaceDown = false;
            stopPanning();
        }
    });
    container.addEventListener('mousedown', e => {
        e.preventDefault();
        if (spaceDown) {
            let x = e.screenX;
            let y = e.screenY;
            startPanning(x, y, 1);
        } else {
            handleTaps(e);
        }
    });
    container.addEventListener('mousemove', e => {
        e.preventDefault();
        mouseX = e.screenX;
        mouseY = e.screenY;
        updatePanning(mouseX, mouseY, 1);
    });
    container.addEventListener('mouseup', e => {
        stopPanning();
    });
    container.addEventListener('mouseleave', e => {
        stopPanning();
    });
    let wheelTO = undefined;
    let wheelScale = 1;
    container.addEventListener('wheel', e => {
        e.preventDefault();
        if (e.ctrlKey) {
            if (!wheelTO) {
                wheelScale = 1;
                startPanning(mouseX, mouseY, wheelScale);
            } else {
                clearTimeout(wheelTO);
                wheelScale -= e.deltaY / 750;
                wheelScale = Math.max(0.1, wheelScale);
                updatePanning(mouseX, mouseY, wheelScale);
            }
            wheelTO = setTimeout(() => {
                stopPanning();
                wheelTO = undefined;
            }, 100);
        }
    });
});
