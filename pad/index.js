(function() {

// start

let svgKey = undefined;
let defaultSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
    width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="100%" height="100%" fill="#fff" />
    <circle cx="512" cy="512" r="256" fill="#000" />
</svg>`;
let currentSvg = defaultSvg;

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
    svgcode.value = currentSvg;
    svgimg.src = 'data:image/svg+xml,' + encodeURIComponent(currentSvg);
};
codeToImg();

let saveSvg = () => {
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
    };
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

window.newSvg = e => {
    svgKey = undefined;
    currentSvg = defaultSvg;
    codeToImg();
    saveSvg();
    openView('editor');
};

window.openGallery = e => {
    let request = indexedDB.open(dbName, dbVersion);
    request.onsuccess = e => {
        let db = e.target.result;
        updateList(db);
    };
    openView('gallery');
};

window.exportSvg = e => {
    let a = document.createElement('a');
    a.href = 'data:image/svg+xml,' + encodeURIComponent(currentSvg);
    a.download = 'drawing.svg';
    a.click();
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

window.openView = view => {
    let views = document.getElementsByClassName('view');
    for (let i = 0; i < views.length; i++) {
        views[i].style.display = 'none';
    }
    let viewToShow = document.getElementById(view);
    viewToShow.style.display = 'block';
};

document.querySelectorAll('.custom-touch').forEach(container => {

    // two finger panning and pinch zooming

    // absolute positioned child
    let inner = container.querySelector('.custom-touch-inner');
    let left = 0;
    let top = 0;
    let updatePosition = (x, y) => {
        inner.style.left = (left + x) + 'px';
        inner.style.top = (top + y) + 'px';
    };
    updatePosition(0, 0);
    let zoom = 1;
    let lastWidth = inner.clientWidth;
    let updateScale = scale => {
        inner.style.width = (window.innerWidth * zoom * scale) + 'px';
        return inner.clientWidth - lastWidth;
    };

    let touchId1 = undefined;
    let touchId2 = undefined;
    let touch1 = undefined;
    let touch2 = undefined;
    let lastX = undefined;
    let lastY = undefined;
    let lastScale = undefined;

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
                top = Number(inner.style.top.replace('px', ''));
                left = Number(inner.style.left.replace('px', ''));
                zoom = inner.clientWidth / window.innerWidth;
            }
        }
    });
});

// end
})();
