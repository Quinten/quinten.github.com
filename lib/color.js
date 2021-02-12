let hsl2rgb = (h, s, l) => {
    let a = s * Math.min(l, 1 - l);
    let f = (n , k = ( n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)];
};

let rgb2hsl = (r, g, b) => {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b), f = (1 - Math.abs(v + v - c - 1));
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return [60 * (h < 0 ? h + 6 : h), f ? c / f : 0, (v + v - c) / 2];
};

let getColor = (h, s, l) => {
    let [r, g, b] = hsl2rgb(h, s, l);
    return {
        h, s, l, r, g, b,
        hsl: 'hsl(' + h + ',' + Math.floor(s * 100) + '%,' + Math.floor(l * 100) + '%)'
    };
};

let getRandomColorScheme = () => {
    let h = Math.floor(Math.random() * 361);
    return {
        base: getColor(h, 0.63, 0.44),
        lite: getColor(h, 0.63, 0.53),
        dark: getColor(h, 0.63, 0.13),
        pale: getColor(h, 0.63, 0.84)
    };
};

export default {
    getRandomColorScheme
};
