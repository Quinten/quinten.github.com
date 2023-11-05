fetch('./transmissions.json').then((response) => {
    return response.json();
}).then((data) => {
    modules = data;
    chaosMode = true;
    shuffleModule();
});