let skipToMenu = e => {
    e.preventDefault();
    menu.scrollIntoView({behavior: 'smooth'});
};
document.querySelector('[href="#menu"]').addEventListener('click', skipToMenu);
