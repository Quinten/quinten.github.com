let skipToMenu = () => {
    menu.scrollIntoView({'behavior': 'smooth'});
    firstmenulink.focus();
};
document.querySelector('[href="#menu"]').setAttribute('href', 'javascript:skipToMenu()');
