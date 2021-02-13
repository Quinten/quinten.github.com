let shuffleInterval = 4000;

let shuffles = [];

let webglContextBusy = false;


let shuffleModule = async () => {
    if (!modules.length) {
        return;
    }

    while (shuffles.length >= 3) {
        let oldest = shuffles.shift();
        if (oldest.remove) {
            if (oldest.usesWebgl) {
                webglContextBusy = false;
            }
            oldest.remove();
        }
    }

    //console.log(clips.length);

    let randomIndex = Math.floor(Math.random() * modules.length);
    let newModule = await import(
        './clips/' + modules[randomIndex]
    );
    if (shuffles.indexOf(newModule) === -1 && !(newModule.usesWebgl && webglContextBusy)) {
        newModule.add();
        if (newModule.usesWebgl) {
            webglContextBusy = true;
        }
        shuffles.push(newModule);
    }

    createTimeout(shuffleModule, shuffleInterval);
};

fetch('./clips.json').then((response) => {
    return response.json();
}).then((data) => {
    modules = data;
    shuffleModule();
});
