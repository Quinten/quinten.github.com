(function() {

let svgKey = undefined;

let dbName = "pad";
let request = indexedDB.open(dbName, 1);
request.onerror = e => {};
request.onupgradeneeded = e => {
    // v1
    let db = e.target.result;
    let objectStore = db.createObjectStore("drawings", { autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("content", "content", { unique: false });
    //objectStore.transaction.oncomplete = e => {};
};
let updateList = db => {
    let transaction = db.transaction("drawings", "readwrite");
    let objectStore = transaction.objectStore("drawings");
    let list = document.getElementById('list');
    let newList = document.createElement('div');
    list.parentNode.replaceChild(newList, list);
    newList.id = 'list';
    objectStore.openCursor().onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
            let drawing = cursor.value;
            let img = document.createElement('img');
            img.src = 'data:image/svg+xml,' + encodeURIComponent(drawing.content);
            img.setAttribute('width', '128');
            img.setAttribute('height', '128');
            img.dataset.key = cursor.key;
            img.onclick = e => {
                svgKey = Number(e.target.dataset.key);
                let svgcode = document.getElementById('svgcode');
                svgcode.value = drawing.content;
                codeToImg();
                openEditor();
            };
            newList.appendChild(img);
            cursor.continue();
        }
    };
};
request.onsuccess = e => {
    let db = e.target.result;
    updateList(db);
};

let svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
    width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="100%" height="100%" fill="#fff" />
    <circle cx="512" cy="512" r="256" fill="#000" />
</svg>`;

let svgimg = document.getElementById('svgimg');
let svgcode = document.getElementById('svgcode');
svgcode.value = svg;
let codeToImg = () => {
    svgimg.src = 'data:image/svg+xml,' + encodeURIComponent(svgcode.value);
};
let form = document.getElementById('codeform');
form.addEventListener('submit', e => {
    e.preventDefault();
    codeToImg();
    let request = indexedDB.open(dbName, 1);
    request.onsuccess = e => {
        let db = e.target.result;
        let transaction = db.transaction("drawings", "readwrite");
        let objectStore = transaction.objectStore("drawings");
        if (svgKey) {
            objectStore.put({
                name: "Untitled",
                content: svgcode.value
            }, svgKey);
        } else {
            let addRequest = objectStore.add({
                name: "Untitled",
                content: svgcode.value
            });
            addRequest.onsuccess = e => {
                svgKey = addRequest.result;
            };
        }
    };
});
codeToImg();

window.newSvg = e => {
    svgKey = undefined;
    svgcode.value = svg;
    codeToImg();
    openEditor();
};

window.openGallery = e => {
    let editor = document.getElementById('editor');
    let gallery = document.getElementById('gallery');
    editor.style.display = 'none';
    gallery.style.display = 'block';
    let request = indexedDB.open(dbName, 1);
    request.onsuccess = e => {
        let db = e.target.result;
        updateList(db);
    };
};

let openEditor = () => {
    let editor = document.getElementById('editor');
    let gallery = document.getElementById('gallery');
    editor.style.display = 'block';
    gallery.style.display = 'none';
};

window.downloadSvg = e => {
    let a = document.createElement('a');
    a.href = 'data:image/svg+xml,' + encodeURIComponent(svgcode.value);
    a.download = 'drawing.svg';
    a.click();
};

})();
