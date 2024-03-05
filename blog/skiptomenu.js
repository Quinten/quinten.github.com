let skipToMenu = e => {
    e.preventDefault();
    menu.scrollIntoView({behavior: 'smooth'});
    firstmenulink.focus();
};
document.querySelector('[href="#menu"]').addEventListener('click', skipToMenu);
