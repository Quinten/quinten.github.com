let rotate = (a, b, angle, cos = Math.cos(angle), sin = Math.sin(angle)) => [
    cos * a - sin * b,
    sin * a + cos * b
];

let project = (vpX, vpY, fl, x, y, z, scale = 1, p = fl / (fl + z) * scale) => [
    vpX + x * p,
    vpY + y * p
];

export default {
    rotate,
    project
};
