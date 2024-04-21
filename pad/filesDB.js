export let connect = options => {

    let {dbName, dbVersion, objectsName, onConnected} = options;

    if (!dbName) {
        dbName = 'pad';
    }
    if (!dbVersion) {
        dbVersion = 1;
    }
    if (!objectsName) {
        objectsName = 'drawings';
    }

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

    let save = options => {
        let {content, key, name, onSaved} = options;
        if (!name) {
            name = "Untitled";
        }
        if (!content) {
            content = "";
        }
        let request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = e => {
            let db = e.target.result;
            let transaction = db.transaction(objectsName, "readwrite");
            let objectStore = transaction.objectStore(objectsName);
            if (key) {
                objectStore.put({name, content}, key);
                if (onSaved) {
                    onSaved(key);
                }
            } else {
                let addRequest = objectStore.add({name, content});
                addRequest.onsuccess = e => {
                    key = addRequest.result;
                    if (onSaved) {
                        onSaved(key);
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

    return {save, list};
};
