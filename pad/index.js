(function() {
// start

let svgKey = undefined;
let defaultSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
    width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="100%" height="100%" fill="#fff" />
    <circle cx="512" cy="512" r="256" fill="#000" />
</svg>`;
let currentSvg = defaultSvg;
let currentPad = undefined;

let dbName = "pad";
let dbVersion = 1;
let request = indexedDB.open(dbName, dbVersion);
request.onupgradeneeded = e => {
    // v1
    let db = e.target.result;
    let objectStore = db.createObjectStore("drawings", { autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("content", "content", { unique: false });
};
let updateList = db => {
    let transaction = db.transaction("drawings", "readwrite");
    let objectStore = transaction.objectStore("drawings");
    let list = document.getElementById('list');
    list.innerHTML = '';
    objectStore.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            let drawing = cursor.value;
            let img = document.createElement('img');
            img.src = 'data:image/svg+xml,' + encodeURIComponent(drawing.content);
            img.dataset.key = cursor.key;
            img.onclick = e => {
                svgKey = Number(e.target.dataset.key);
                currentSvg = drawing.content;
                codeToImg();
                openView('editor');
            };
            list.prepend(img);
            cursor.continue();
        }
    };
};
request.onsuccess = e => {
    let db = e.target.result;
    updateList(db);
};

let codeToImg = () => {
    let svgimg = document.getElementById('svgimg');
    let svgcode = document.getElementById('svgcode');
    currentSvg = currentSvg.replace(/<\?[^>]*\?>/g, '');
    svgcode.value = currentSvg;
    //svgimg.src = 'data:image/svg+xml,' + encodeURIComponent(currentSvg);
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
    currentSvg = svgimg.innerHTML;
    svgcode.value = currentSvg;
};

let saveSvg = callback => {
    let request = indexedDB.open(dbName, dbVersion);
    request.onsuccess = e => {
        let db = e.target.result;
        let transaction = db.transaction("drawings", "readwrite");
        let objectStore = transaction.objectStore("drawings");
        if (svgKey) {
            objectStore.put({
                name: "Untitled",
                content: currentSvg
            }, svgKey);
        } else {
            let addRequest = objectStore.add({
                name: "Untitled",
                content: currentSvg
            });
            addRequest.onsuccess = e => {
                svgKey = addRequest.result;
            };
        }
        if (callback) {
            callback();
        }
    };
};

// button actions

window.newSvg = e => {
    svgKey = undefined;
    currentSvg = defaultSvg;
    codeToImg();
    saveSvg();
    openView('editor');
};

window.importSvg = e => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';
    input.onchange = e => {
        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = e => {
            svgKey = undefined;
            currentSvg = reader.result;
            saveSvg();
            codeToImg();
            openView('editor');
        };
        reader.readAsText(file);
    };
    input.click();
};

window.openGallery = e => {
    imgToCode();
    saveSvg(() => {
        let request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = e => {
            let db = e.target.result;
            updateList(db);
            openView('gallery');
        };
    });
};

window.openSource = () => {
    imgToCode();
    saveSvg(() => {
        openView('source');
    });
};

window.exportSvg = e => {
    let a = document.createElement('a');
    a.href = 'data:image/svg+xml,' + encodeURIComponent(currentSvg);
    a.download = 'drawing.svg';
    a.click();
};

window.applySource = () => {
    let svgcode = document.getElementById('svgcode');
    currentSvg = svgcode.value;
    codeToImg();
    saveSvg();
    openView('editor');
};

window.discardSource = () => {
    codeToImg();
    openView('editor');
};

window.onViewOpen = e => {};

window.openView = view => {
    let views = document.getElementsByClassName('view');
    for (let i = 0; i < views.length; i++) {
        views[i].style.display = 'none';
    }
    let viewToShow = document.getElementById(view);
    viewToShow.style.display = 'block';
    window.onViewOpen({view});
};

let selectedElements = [];
let selectedCursors = [];
let deselectAllElements = () => {
    while (selectedElements.length > 0) {
        selectedElements.pop();
        selectedCursors.pop().remove();
    }
    document.querySelectorAll('.select-action').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.default-action').forEach(el => {
        el.style.display = 'inline-block';
    });
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
    } else {
        deselectAllElements();
    }
    document.querySelectorAll('.select-action').forEach(el => {
        el.style.display = selectedElements.length > 0 ? 'inline-block' : 'none';
    });
    document.querySelectorAll('.default-action').forEach(el => {
        el.style.display = selectedElements.length > 0 ? 'none' : 'inline-block';
    });
};

window.removeElements = () => {
    selectedElements.forEach(el => {
        el.remove();
    });
    deselectAllElements();
    imgToCode();
    saveSvg();
};

document.querySelectorAll('.custom-touch').forEach(container => {

    let handleTaps = e => {
        nTaps++;
        if (nTaps === 1) {
            setTimeout(() => {
                let svgcursors = document.getElementById('svgcursors').querySelector('svg');
                if (nTaps === 1) {
                    if (selectedElements.length === 0 && !touchId2) {
                        let x = 0;
                        let y = 0;
                        if (e.touches) {
                            x = e.touches[0].clientX;
                            y = e.touches[0].clientY;
                        } else {
                            x = e.clientX;
                            y = e.clientY;
                        }
                        let svgimg = document.getElementById('svgimg');
                        let imgsvg = svgimg.querySelector('svg');
                        let width = imgsvg.getAttribute('width');
                        if (!width) {
                            let viewBox = imgsvg.getAttribute('viewBox');
                            if (viewBox) {
                                width = viewBox.split(' ')[2];
                            }
                        }
                        let offsetX = imgsvg.getBoundingClientRect().left;
                        let offsetY = imgsvg.getBoundingClientRect().top;
                        x -= offsetX;
                        y -= offsetY;
                        width = Number(width);
                        let zoom = width / svgimg.clientWidth;
                        x = x * zoom;
                        y = y * zoom;
                        if (currentPad === undefined) { 
                            currentPad = "M " + x + " " + y;
                            svgcursors.innerHTML = '<path d="' + currentPad + ' L ' + (x + 4) + ' ' + (y + 4) + ' Z" />';
                        } else {
                            currentPad += " L " + x + " " + y;
                            svgcursors.innerHTML = '<path d="' + currentPad + ' Z" />';
                        }
                    }
                }
                if (nTaps === 2) {
                    if (currentPad !== undefined) {
                        currentPad += " Z";
                        currentSvg = currentSvg.replace(/<\/svg>/, '<path d="' + currentPad + '" fill="#000" /></svg>');
                        currentPad = undefined;
                        codeToImg();
                        saveSvg();
                        svgcursors.innerHTML = '';
                    } else {
                        let el = e.target;
                        selectElement(el);
                    }
                }
                nTaps = 0;
            }, 300);
        }
    };

    // two finger panning and pinch zooming

    let inner = container.querySelector('.custom-touch-inner');
    let left = 0;
    let top = 0;
    let updatePosition = (x, y) => {
        inner.style.left = (left + x) + 'px';
        inner.style.top = (top + y) + 'px';
    };
    updatePosition(0, 0);
    let zoom = inner.clientWidth / window.innerWidth;
    let lastWidth = inner.clientWidth;
    let updateScale = scale => {
        inner.style.width = (window.innerWidth * zoom * scale) + 'px';
        return inner.clientWidth - lastWidth;
    };
    updateScale(1);

    let oldOnViewOpen = window.onViewOpen;
    window.onViewOpen = e => {
        oldOnViewOpen(e);
        if (e.view === 'editor') {
            left = 0;
            top = 0;
            updatePosition(0, 0);
            zoom = 1;
            updateScale(1);
        } else {
            deselectAllElements();
        }
    };

    let touchId1 = undefined;
    let touchId2 = undefined;
    let touch1 = undefined;
    let touch2 = undefined;
    let lastX = undefined;
    let lastY = undefined;
    let lastScale = undefined;

    let nTaps = 0;

    container.addEventListener('touchstart', e => {
        e.preventDefault();
        let touches = e.touches;
        if (touches.length > 1 && touchId1 === undefined && touchId2 === undefined) {
            touchId1 = touches[0].identifier;
            touchId2 = touches[1].identifier;
            touch1 = touches[0];
            touch2 = touches[1];
            lastX = touch1.screenX + (touch2.screenX - touch1.screenX) / 2;
            lastY = touch1.screenY + (touch2.screenY - touch1.screenY) / 2;
            lastScale = Math.hypot(touch2.screenX - touch1.screenX, touch2.screenY - touch1.screenY);
            lastWidth = inner.clientWidth;
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
            let scale = Math.hypot(touch2.screenX - touch1.screenX, touch2.screenY - touch1.screenY);
            let dScale = scale / lastScale;
            let dW = updateScale(dScale);
            let x = touch1.screenX + (touch2.screenX - touch1.screenX) / 2;
            let y = touch1.screenY + (touch2.screenY - touch1.screenY) / 2;
            let dX = x - lastX - dW / 2;
            let dY = y - lastY - dW / 2;
            updatePosition(dX, dY);
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
                left = Number(inner.style.left.replace('px', ''));
                top = Number(inner.style.top.replace('px', ''));
                zoom = inner.clientWidth / window.innerWidth;
            }
        }
    });

    // desktop
    let spaceDown = false;
    let panStarted = false;
    window.addEventListener('keydown', e => {
        if (e.keyCode === 32) {
            spaceDown = true;
            container.style.cursor = 'grab';
        }
    });
    window.addEventListener('keyup', e => {
        if (e.keyCode === 32) {
            spaceDown = false;
            container.style.cursor = 'auto';
        }
    });
    container.addEventListener('mousedown', e => {
        e.preventDefault();
        if (spaceDown) {
            lastX = e.screenX;
            lastY = e.screenY;
            panStarted = true;
            container.style.cursor = 'grabbing';
        } else {
            handleTaps(e);
        }
    });
    container.addEventListener('mousemove', e => {
        e.preventDefault();
        if (spaceDown && panStarted) {
            let dX = e.screenX - lastX;
            let dY = e.screenY - lastY;
            updatePosition(dX, dY);
        }
    });
    container.addEventListener('mouseup', e => {
        e.preventDefault();
        if (panStarted) {
            top = Number(inner.style.top.replace('px', ''));
            left = Number(inner.style.left.replace('px', ''));
            panStarted = false;
            container.style.cursor = spaceDown ? 'grab' : 'auto';
        }
    });
    container.addEventListener('mouseleave', e => {
        e.preventDefault();
        if (panStarted) {
            top = Number(inner.style.top.replace('px', ''));
            left = Number(inner.style.left.replace('px', ''));
            panStarted = false;
            container.style.cursor = spaceDown ? 'grab' : 'auto';
        }
    });
    let wheelTO = undefined;
    container.addEventListener('wheel', e => {
        e.preventDefault();
        if (e.ctrlKey) {
            if (wheelTO) {
                clearTimeout(wheelTO);
            } else {
                lastScale = 1;
                lastWidth = inner.clientWidth;
            }
            lastScale -= e.deltaY / 100;
            let dW = updateScale(lastScale);
            updatePosition(-dW / 2, -dW / 2);
            wheelTO = setTimeout(() => {
                left = Number(inner.style.left.replace('px', ''));
                top = Number(inner.style.top.replace('px', ''));
                zoom = inner.clientWidth / window.innerWidth;
                wheelTO = undefined;
            }, 100);
        }
    });
});

// end
})();
