// Compile a WebGL program from a vertex shader and a fragment shader
let compile = (gl, vshader, fshader) => {

    // Compile vertex shader
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    // Compile fragment shader
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);

    // Create and launch the WebGL program
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Log errors (optional)
    //console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
    //console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
    //console.log('program:', gl.getProgramInfoLog(program) || 'OK');

    return program;
};

// Bind a data buffer to an attribute, fill it with data and enable it
let buffer = (gl, data, program, attribute, size, type) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let a = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a, size, type, false, 0, 0);
    gl.enableVertexAttribArray(a);
};

export default {
    compile,
    buffer
};
