fetch('./transmissions.json').then((response) => {
    return response.json();
}).then((data) => {
    modules = data;
    modules.sort();
    import('./lib/timeline.js').then((module) => {
        let timeline = module.default;
        let currentClip = null;
        let previousClip = null;
        let updateClip = async () => {
            let TOLength = 0;
            if (previousClip != null) {
                TOLength = 8000;
            }
            let newClip = timeline.getPresentElement(modules);
            if (newClip != currentClip) {
                previousClip = currentClip;
                currentClip = newClip;
                let newModule = await import('./clips/' + currentClip);
                while (clips.length > 0) {
                    let oldClip = clips.pop();
                    if (oldClip.remove) {
                        oldClip.remove();
                    }
                }
                newModule.add();
            }
            createTimeout(updateClip, TOLength);
        };
        updateClip();
    });
});
