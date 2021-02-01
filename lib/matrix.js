// Create an identity mat4
let identity = () => {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};

// Compute the multiplication of two mat4 (c = a x b)
let multMat4Mat4 = (a, b) => {
    var i, e, a, b, ai0, ai1, ai2, ai3;
    var c = new Float32Array(16);
    for (i = 0; i < 4; i++) {
        ai0 = a[i];
        ai1 = a[i+4];
        ai2 = a[i+8];
        ai3 = a[i+12];
        c[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
        c[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
        c[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
        c[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return c;
};

// Get the transposed of a mat4
let transpose = m => {
    return new Float32Array([
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
    ]);
};

// Transform a mat4
// options: x/y/z (translate), rx/ry/rz (rotate), sx/sy/sz (scale)
let transform = (mat, options) => {
    var out = new Float32Array(mat);
    var x = options.x || 0, y = options.y || 0, z = options.z || 0;
    var sx = options.sx || 1, sy = options.sy || 1, sz = options.sz || 1;
    var rx = options.rx, ry = options.ry, rz = options.rz;

    // translate
    if (x || y || z) {
        out[12] += out[0] * x + out[4] * y + out[8]  * z;
        out[13] += out[1] * x + out[5] * y + out[9]  * z;
        out[14] += out[2] * x + out[6] * y + out[10] * z;
        out[15] += out[3] * x + out[7] * y + out[11] * z;
    }

    // Rotate
    if (rx) {
        out.set(multMat4Mat4(out, new Float32Array([
            1, 0, 0, 0,
            0, Math.cos(rx), Math.sin(rx), 0,
            0, -Math.sin(rx), Math.cos(rx), 0,
            0, 0, 0, 1
        ])));
    }
    if (ry) {
        out.set(multMat4Mat4(out, new Float32Array([
            Math.cos(ry), 0, -Math.sin(ry), 0,
            0, 1, 0, 0,
            Math.sin(ry), 0, Math.cos(ry), 0,
            0, 0, 0, 1
        ])));
    }
    if (rz) {
        out.set(multMat4Mat4(out, new Float32Array([
            Math.cos(rz), Math.sin(rz), 0, 0,
            -Math.sin(rz), Math.cos(rz), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])));
    }

    // Scale
    if (sx !== 1) {
        out[0] *= sx, out[1] *= sx, out[2] *= sx, out[3] *= sx;
    }
    if (sy !== 1) {
        out[4] *= sy, out[5] *= sy, out[6] *= sy, out[7] *= sy;
    }
    if (sz !== 1) {
        out[8] *= sz, out[9] *= sz, out[10] *= sz, out[11] *= sz;
    }

    return out;
};

// Create a perspective matrix
// options: fov, aspect, near, far
let perspective = options => {
    var fov = options.fov || 1.5;
    var aspect = options.aspect || 1; // (`canvas.width / canvas.height` if the canvas is rectangle)
    var near = options.near || 0.01; // can't be 0
    var far = options.far || 100;
    var f = 1 / Math.tan(fov);
    var nf = 1 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * near * far) * nf, 0
    ]);
};

// Place a camera at the position [cameraX, cameraY, cameraZ], make it look at the point [targetX, targetY, targetZ].
// Optional: a "up" vector can be defined to tilt the camera on one side (vertical by default).
let lookAt = (mat, cameraX, cameraY, cameraZ, targetX, targetY, targetZ, upX = 0, upY = 1, upZ = 0) => {
    var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
    fx = targetX - cameraX;
    fy = targetY - cameraY;
    fz = targetZ - cameraZ;
    rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;
    sx = fy * upZ - fz * upY;
    sy = fz * upX - fx * upZ;
    sz = fx * upY - fy * upX;
    rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;
    ux = sy * fz - sz * fy;
    uy = sz * fx - sx * fz;
    uz = sx * fy - sy * fx;
    var l = new Float32Array([
        sx, ux, -fx, 0,
        sy, uy, -fy, 0,
        sz, uz, -fz, 0,
        0,  0,  0,   1
    ]);
    l = transform(l, {x: -cameraX, y: -cameraY, z: -cameraZ});
    return multMat4Mat4(mat, l);
};

// Create an orthogonal matrix
// options: top, bottom, left, right, near, far
let orthogonal = options => {
    var top = options.top;
    var bottom = options.bottom;
    var left = options.left;
    var right = options.right;
    var near = options.near || 0;
    var far = options.far || 100;
    var rw = 1 / (right - left);
    var rh = 1 / (top - bottom);
    var rd = 1 / (far - near);
    return new Float32Array([
        2 * rw, 0, 0, 0,
        0, 2 * rh, 0, 0,
        0, 0, -2 * rd, 0,
        -(right + left) * rw, -(top + bottom) * rh, -(far + near) * rd, 1
    ]);
};

// Get the inverse of a mat4
// The mat4 is not modified, a new mat4 is returned
let inverse = m => {
  var inv = new Float32Array([
     m[5]*m[10]*m[15] - m[5]*m[11]*m[14] - m[9]*m[6]*m[15] + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10],
    -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10],
     m[1]*m[6]*m[15]  - m[1]*m[7]*m[14]  - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7]  - m[13]*m[3]*m[6],
    -m[1]*m[6]*m[11]  + m[1]*m[7]*m[10]  + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7]   + m[9]*m[3]*m[6],
    -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10],
     m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10],
    -m[0]*m[6]*m[15]  + m[0]*m[7]*m[14]  + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7]  + m[12]*m[3]*m[6],
     m[0]*m[6]*m[11]  - m[0]*m[7]*m[10]  - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7]   - m[8]*m[3]*m[6],
     m[4]*m[9]*m[15]  - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9],
    -m[0]*m[9]*m[15]  + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9],
     m[0]*m[5]*m[15]  - m[0]*m[7]*m[13]  - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7]  - m[12]*m[3]*m[5],
    -m[0]*m[5]*m[11]  + m[0]*m[7]*m[9]   + m[4]*m[1]*m[11] - m[4]*m[3]*m[9]  - m[8]*m[1]*m[7]   + m[8]*m[3]*m[5],
    -m[4]*m[9]*m[14]  + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9],
     m[0]*m[9]*m[14]  - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9],
    -m[0]*m[5]*m[14]  + m[0]*m[6]*m[13]  + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6]  + m[12]*m[2]*m[5],
     m[0]*m[5]*m[10]  - m[0]*m[6]*m[9]   - m[4]*m[1]*m[10] + m[4]*m[2]*m[9]  + m[8]*m[1]*m[6]   - m[8]*m[2]*m[5]
  ]);
  let det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
  if(!det) return m;
  det = 1 / det;
  for(var i = 0; i < 16; i++) {
    inv[i] *= det;
  }
  return inv;
};

// Get the inverse transpose of a mat4
let inverseTranspose = m => transpose(inverse(m));

export default {
    identity,
    multMat4Mat4,
    transpose,
    transform,
    perspective,
    lookAt,
    orthogonal,
    inverse,
    inverseTranspose
};
