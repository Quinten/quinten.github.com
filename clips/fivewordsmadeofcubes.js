import webgl from '../lib/webgl.js';
import matrix from '../lib/matrix.js';
import shapes from '../lib/shapes.js';
import charCube from '../lib/charCube.js';
import fontArr from '../lib/fieldFont9by11Matrix.js';
import color from '../lib/color.js';

let deg2rad = angle => Math.PI * angle / 180;

let vshader = `
attribute vec4 position;
attribute vec4 color;
attribute vec4 normal;
uniform mat4 mvp;
uniform mat4 model;            // model matrix
uniform mat4 inverseTranspose; // inversed transposed model matrix
varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;
void main() {

  // Apply the model matrix and the camera matrix to the vertex position
  gl_Position = mvp * position;

  // Set varying position for the fragment shader
  v_position = vec3(model * position);

  // Recompute the face normal
  v_normal = normalize(vec3(inverseTranspose * normal));

  // Set the color
  v_color = color;
}`;

// Fragment shader program
let fshader = `
precision mediump float;
uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientLight;
varying vec3 v_normal;
varying vec3 v_position;
varying vec4 v_color;
void main() {

  // Compute direction between the light and the current point
  vec3 lightDirection = normalize(lightPosition - v_position);

  // Compute angle between the normal and that direction
  float nDotL = max(dot(lightDirection, v_normal), 0.0);

  // Compute diffuse light proportional to this angle
  vec3 diffuse = lightColor * v_color.rgb * nDotL;

  // Compute ambient light
  vec3 ambient = ambientLight * v_color.rgb;

  // Compute total light (diffuse + ambient)
  gl_FragColor = vec4(diffuse + ambient, 1.0);
}`;

let program;

let myClip;

//let sentence = '_ five words made of cubes _';
let sentence = 'five words made of cubes';
let word = sentence.split(' ');
let currentWord = 0;
let changeTO = undefined;

export const add = () => {
    if (nFrames > -1) {
        nFrames = 256;
        sentence = 'cubes';
        word = sentence.split(' ');
    }
    bgKey = 'bg';
    canvas.style.backgroundColor = color.current[bgKey];

    program = webgl.compile(gl, vshader, fshader);

    // Initialize a cube
    let vertices, normals, indices;
    [vertices, normals, indices] = shapes.cube();

    // Count vertices
    let n = indices.length;

    // Set position, normal buffers
    webgl.buffer(gl, vertices, program, 'position', 3, gl.FLOAT);
    webgl.buffer(gl, normals, program, 'normal', 3, gl.FLOAT);

    // Set indices
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Set cube color
    let materialColor = gl.getAttribLocation(program, 'color');
    gl.vertexAttrib3f(materialColor, color.current.base.r, color.current.base.g, color.current.base.b);

    // Set the clear color and enable the depth test
    //gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // Set the camera
    let cameraMatrix = matrix.perspective({fov: deg2rad(30), aspect: canvas3d.width / canvas3d.height, near: 1, far: 100});
    cameraMatrix = matrix.transform(cameraMatrix, {z: -65});

    // Set the point light color and position
    let lightColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3f(lightColor, color.current.pale.r, color.current.pale.g, color.current.pale.b);

    let lightPosition = gl.getUniformLocation(program, 'lightPosition');
    gl.uniform3f(lightPosition, 65, 65, 65);

    // Set the ambient light color
    let ambientLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3f(ambientLight, 0.4, 0.4, 0.4);
    let charcube = [];
    let nCharCubes = 5;
    let gridSize = 2;
    let gridWidth = 7;
    let gridDepth = 9;
    let zOffset = 0;

    for (let c = 0; c < nCharCubes; c++) {
        charcube[c] = charCube.create();
        charcube[c].x = (c - ((nCharCubes - 1) / 2)) * gridSize * gridWidth;
        charcube[c].z = ((gridDepth / 2) * gridSize) - zOffset;
    }

    let morfCharCubes = (...args) => {
        let fontShape = (fontArr[args[1]]) ? fontArr[args[1]] : [[4,5]];
        args[0].changeChar(fontShape);
    }

    let changeWord = () => {
        for (let c = 0; c < nCharCubes; c++ ) {
            let charKey = word[currentWord].substr(c, 1);
            createTimeout(morfCharCubes, c * 300, charcube[c], charKey);
        }
        currentWord = (currentWord < (word.length - 1)) ? (currentWord + 1) : 0;
        changeTO = createTimeout(changeWord, 4500);
    }
    changeWord();

    let drawCuboids = (gl, n, cameraMatrix) => {

        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        charcube.forEach((char) => {
            char.contract();
            char.cube.forEach((cuboid) => {
                let modelMatrix = matrix.identity();
                modelMatrix = matrix.transform(modelMatrix, char);
                modelMatrix = matrix.transform(modelMatrix, cuboid);
                shapes.drawShape(gl, program, cameraMatrix, modelMatrix, n);
            });
        });
    }

    myClip = addClip();

    myClip.draw = () => {
        gl.vertexAttrib3f(materialColor, color.current.base.r, color.current.base.g, color.current.base.b);
        gl.uniform3f(lightColor, color.current.pale.r, color.current.pale.g, color.current.pale.b);
        drawCuboids(gl, n, cameraMatrix);
        context.drawImage(canvas3d, 1024 - 1024 / height * width / 2, 0, 1024 / height * width, 1024, 0, 0, width, height);
    };
};

export const remove = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.deleteProgram(program);
    removeClip(myClip);
    destroyTimeout(changeTO);
};

export const usesWebgl = true;
