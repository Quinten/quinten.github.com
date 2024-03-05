let skipToMenu = e => {
    e.preventDefault();
    menu.scrollIntoView({behavior: 'smooth'});
    setTimeout(_ => {
        firstmenulink.focus();
    }, 750);
};
document.querySelector('[href="#menu"]').addEventListener('click', skipToMenu);
