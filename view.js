let clip = window.location.search.substr(1);
if (clip.length) {
    (async () => {
        var newModule = await import('./clips/' + clip + '.js');
        newModule.add();
    })();
}
