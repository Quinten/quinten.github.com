let clip = window.location.search.substr(1);
if (clip.length) {
    (async () => {
        let newModule = await import('./clips/' + clip + '.js');
        newModule.add();
    })();
}
