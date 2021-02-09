import webgl from '../lib/webgl.js';
import matrix from '../lib/matrix.js';
import shapes from '../lib/shapes.js';
import colors from '../lib/color.js';

let deg2rad = angle => Math.PI * angle / 180;

var vshader = `
attribute vec4 position;
attribute vec4 color;
attribute vec4 normal;
uniform mat4 mvp;
uniform mat4 model;            // model matrix
uniform mat4 inverseTranspose; // inversed transposed model matrix
varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_camDistance;
void main() {

  // Apply the model matrix and the camera matrix to the vertex position
  gl_Position = mvp * position;

  // Set varying position for the fragment shader
  v_position = vec3(model * position);

  // Recompute the face normal
  v_normal = normalize(vec3(inverseTranspose * normal));

  // Set the color
  v_color = color;

  v_camDistance = vec3(mvp * position);
}`;

// Fragment shader program
var fshader = `
precision mediump float;
uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientLight;
uniform vec4 u_fogColor;
uniform float u_fogNear;
uniform float u_fogFar;
varying vec3 v_normal;
varying vec3 v_position;
varying vec4 v_color;
varying vec3 v_camDistance;
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
  vec4 color = vec4(diffuse + ambient, 1.0);

  float fogDistance = length(v_camDistance);
  float fogAmount = smoothstep(u_fogNear, u_fogFar, fogDistance);

  // apply fog
  gl_FragColor = mix(color, u_fogColor, fogAmount);
}`;

let program;

let myClip;

export const add = () => {
    let color = colors.getRandomColorScheme();
    canvas.style.backgroundColor = color.pale.hsl;

    program = webgl.compile(gl, vshader, fshader);

    // Initialize a cube
    var vertices, normals, indices;
    [vertices, normals, indices] = shapes.cube();

    // Count vertices
    var n = indices.length;

    // Set position, normal buffers
    webgl.buffer(gl, vertices, program, 'position', 3, gl.FLOAT);
    webgl.buffer(gl, normals, program, 'normal', 3, gl.FLOAT);

    // Set indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Set cube color
    var materialColor = gl.getAttribLocation(program, 'color');
    gl.vertexAttrib3f(materialColor, color.base.r, color.base.g, color.base.b);

    // Set the clear color and enable the depth test
    gl.clearColor(color.pale.r, color.pale.g, color.pale.b, 1);
    gl.enable(gl.DEPTH_TEST);

    // Set the camera
    var cameraMatrix = matrix.perspective({fov: deg2rad(30), aspect: canvas3d.width / canvas3d.height, near: 1, far: 100});
    //cameraMatrix = matrix.transform(cameraMatrix, {y: -16, z: -25});
    cameraMatrix = matrix.lookAt(cameraMatrix, 0, 16, -24, 0, 0, -12);

    // Set the point light color and position
    var lightColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3f(lightColor, color.pale.r, color.pale.g, color.pale.b);

    var lightPosition = gl.getUniformLocation(program, 'lightPosition');
    gl.uniform3f(lightPosition, -64, 128, -64);

    // Set the ambient light color
    var ambientLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3f(ambientLight, 0.4, 0.4, 0.4);

    var fogColorLocation = gl.getUniformLocation(program, "u_fogColor");
    var fogNearLocation = gl.getUniformLocation(program, "u_fogNear");
    var fogFarLocation = gl.getUniformLocation(program, "u_fogFar");
    var fogColor = [color.pale.r, color.pale.g, color.pale.b, 1];
    var settings = {
        fogNear: 2,
        fogFar: 24
    };
    gl.uniform4fv(fogColorLocation, fogColor);
    gl.uniform1f(fogNearLocation, settings.fogNear);
    gl.uniform1f(fogFarLocation, settings.fogFar);

    var cuboids = [];
    var nCuboids = 256;
    while(nCuboids > 0) {
        let cuboid = {
            x: -16 + Math.floor(nCuboids / 16) * 2,
            y: -Math.random() * 8,
            z: -24 + (nCuboids % 16) * 2,
            //ry: Math.PI / 4,
            sy: 8
        };
        cuboids.push(cuboid);
        nCuboids -= 1;
    }

    let drawCuboids = (gl, n, cameraMatrix) => {

        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.clear(gl.DEPTH_BUFFER_BIT);

        cuboids.forEach((cuboid) => {
            var modelMatrix = matrix.identity();
            cuboid.z -= 0.1;
            if (cuboid.z < -24) {
                cuboid.z += 32;
                cuboid.y = -Math.random() * 8;
            }
            modelMatrix = matrix.transform(modelMatrix, cuboid);
            shapes.drawShape(gl, program, cameraMatrix, modelMatrix, n);
        });
    }

    myClip = addClip({unshift: true});

    myClip.draw = () => {
        //cameraMatrix = matrix.transform(cameraMatrix, {rx: .00541, ry: .00181, rz: .00317});
        drawCuboids(gl, n, cameraMatrix);
        context.drawImage(canvas3d, 1024 - 1024 / height * width / 2, 0, 1024 / height * width, 1024, 0, 0, width, height);
    };
};

export const remove = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 0);
    gl.deleteProgram(program);
    removeClip(myClip);
};

export const usesWebgl = true;
