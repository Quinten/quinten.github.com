(function() {

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

})();
