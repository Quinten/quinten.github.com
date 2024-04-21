let defaultSvg = `<svg
    version="1.1" xmlns="http://www.w3.org/2000/svg"
    width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="#fff" />
</svg>`;

let filterSvg = content => {
    // remove xml declaration
    content = content.replace(/<\?[^>]*\?>\s*/g, '');
    // remove paths with only M and Z commands, and no L or C or S or Q or T commands, or any other
    // alphabet letter commands
    content = content.replace(/<path d="M[^A-Z]*Z"[^<]*(<\/path>|\/>){1}\s*/g, '');
    return content;
};

export let connect = options => {

    let {dbName, dbVersion, objectsName, defaultContent, onConnected} = options;

    if (!dbName) {
        dbName = 'pad';
    }
    if (!dbVersion) {
        dbVersion = 1;
    }
    if (!objectsName) {
        objectsName = 'drawings';
    }
    if (!defaultContent) {
        defaultContent = defaultSvg;
    }

    let openKey = undefined;
    let openContent = undefined;

    let init = () => {
        let request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = e => {
            // v1
            let db = e.target.result;
            let objectStore = db.createObjectStore(objectsName, { autoIncrement: true });
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("content", "content", { unique: false });
        };
        request.onsuccess = onConnected;
    };
    init();

    let open = options => {
        let {key, onOpened} = options;
        openKey = key;
        let request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = e => {
            let db = e.target.result;
            let transaction = db.transaction(objectsName, "readwrite");
            let objectStore = transaction.objectStore(objectsName);
            let getRequest = objectStore.get(key);
            getRequest.onsuccess = e => {
                openContent = getRequest.result.content;
                if (onOpened) {
                    onOpened(openContent);
                }
            };
        };
    };

    let save = options => {
        let {content, name, onSaved} = options;
        if (!name) {
            name = "Untitled";
        }
        let request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = e => {
            let db = e.target.result;
            let transaction = db.transaction(objectsName, "readwrite");
            let objectStore = transaction.objectStore(objectsName);
            if (openKey) {
                if (!content) {
                    content = openContent;
                }
                content = filterSvg(content);
                objectStore.put({name, content}, openKey);
                openContent = content;
                if (onSaved) {
                    onSaved(content);
                }
            } else {
                if (!content) {
                    content = defaultContent;
                }
                content = filterSvg(content);
                let addRequest = objectStore.add({name, content});
                addRequest.onsuccess = e => {
                    openKey = addRequest.result;
                    openContent = content;
                    if (onSaved) {
                        onSaved(content);
                    }
                };
            }
        };
    };

    let list = options => {
        let {onItem, onCompleted} = options;
        let request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = e => {
            let db = e.target.result;
            let transaction = db.transaction(objectsName, "readwrite");
            let objectStore = transaction.objectStore(objectsName);
            objectStore.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    if (onItem) {
                        onItem(cursor);
                    }
                    cursor.continue();
                } else {
                    if (onCompleted) {
                        onCompleted();
                    }
                }
            }
        };
    };

    let create = options => {
        let {name, content, onCreated} = options;
        openKey = undefined;
        save({name, content, onSaved: onCreated});
    };

    let importItem = options => {
        let {accept, onImported} = options;
        if (!accept) {
            accept = '.svg';
        }
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = e => {
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = e => {
                create({
                    name: file.name,
                    content: reader.result,
                    onCreated: onImported
                });
            };
            reader.readAsText(file);
        };
        input.click();
    };

    let exportItem = () => {
        let a = document.createElement('a');
        a.href = 'data:image/svg+xml,' + encodeURIComponent(openContent);
        a.download = 'drawing.svg';
        a.click();
    };

    return {save, list, open, create, importItem, exportItem};
};
