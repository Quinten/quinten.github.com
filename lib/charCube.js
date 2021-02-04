let deg2rad = angle => Math.PI * angle / 180;

function create() {

    let cubeSizeInt = 2; //50?

    let cube = [];
    let nCubes = 36;
    let gridSize = cubeSizeInt;
    let gridWidth = 9;
    let gridHeight = 11;
    let gridDepth = 9;
    let xOffset = 0;
    let yOffset = 0;
    let  zOffset = 0;

    let fFace = ['front2left', 'left2back', 'back2right', 'right2front'];
    let currentfFace = 0;
    let stepOne = 0;
    let stepTwo = 0;
    let stepThree = 0;

    let rotXhome = 0;
    let rotYhome = 0;
    let rotZhome = 0;

    let springiness = 0.2;
    let decay = 0.6;

    let charCube = {

        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,

        cube

    };

    xOffset = gridWidth / 2 * cubeSizeInt;
    yOffset = gridHeight / 2 * cubeSizeInt;
    zOffset = gridDepth / 2 * cubeSizeInt;

    for (let c = 0; c < nCubes; c++ ) {
        cube[c] = {};
        cube[c].x = (Math.floor(Math.random() * gridWidth) * cubeSizeInt) - xOffset;
        cube[c].y = (Math.floor(Math.random() * gridHeight) * cubeSizeInt) - yOffset;
        cube[c].z = (Math.floor(Math.random() * gridDepth) * cubeSizeInt) - zOffset;
        let extraObj = {};
        extraObj.xhome = (Math.floor(Math.random() * gridWidth) * cubeSizeInt) - xOffset;
        extraObj.yhome = (Math.floor(Math.random() * gridHeight) * cubeSizeInt) - yOffset;
        extraObj.zhome = (Math.floor(Math.random() * gridDepth) * cubeSizeInt) - zOffset;
        extraObj.xchange = 0;
        extraObj.ychange = 0;
        extraObj.zchange = 0;
        cube[c].extra = extraObj;
    }

    function levelX () {
        for (var c = 0; c < nCubes; c++ ) {
            cube[c].extra.xhome = arguments[0];
        }
        rotationStep();
    }

    function levelZ () {
        for (var c = 0; c < nCubes; c++ ) {
            cube[c].extra.zhome = arguments[0];
        }
        rotationStep();
    }

    function spreadX () {
        var spreadIndex = 0;
        for (var c = 0; c < nCubes; c++ ) {
            cube[c].extra.xhome = (xOffset - (arguments[0][spreadIndex][0] * gridSize)) * arguments[1];
            spreadIndex = (spreadIndex < (arguments[0].length - 1)) ? (spreadIndex + 1) : 0;
        }
        rotationStep();
    }

    function spreadY () {
        var spreadIndex = 0;
        for (var c = 0; c < nCubes; c++ ) {
            cube[c].extra.yhome = yOffset - (arguments[0][spreadIndex][1] * gridSize);
            spreadIndex = (spreadIndex < (arguments[0].length - 1)) ? (spreadIndex + 1) : 0;
        }
        rotationStep();
    }

    function spreadZ () {
        var spreadIndex = 0;
        for (var c = 0; c < nCubes; c++ ) {
            cube[c].extra.zhome = (zOffset - (arguments[0][spreadIndex][0] * gridSize)) * arguments[1];
            spreadIndex = (spreadIndex < (arguments[0].length - 1)) ? (spreadIndex + 1) : 0;
        }
        rotationStep();
    }

    function rotationStep () {
        rotXhome -= deg2rad(120);
        rotYhome -= deg2rad(30);
        rotZhome -= deg2rad(120);
    }

    charCube.changeChar = function (fPos) {
        switch(fFace[currentfFace]) {
            case 'front2left':
                createTimeout(spreadZ, 40, fPos, 1);
                createTimeout(spreadY, 1000, fPos);
                createTimeout(levelX, 2000, (-xOffset));
                break;
            case 'left2back':
                createTimeout(spreadX, 40, fPos, 1);
                createTimeout(spreadY, 1000, fPos);
                createTimeout(levelZ, 2000, zOffset);
                break;
            case 'back2right':
                createTimeout(spreadZ, 40, fPos, -1);
                createTimeout(spreadY, 1000, fPos);
                createTimeout(levelX, 2000, xOffset);
                break;
            case 'right2front':
                createTimeout(spreadX, 40, fPos, -1);
                createTimeout(spreadY, 1000, fPos);
                createTimeout(levelZ, 2000, (-zOffset));
                break;
        }
        currentfFace = (currentfFace < (fFace.length - 1)) ? (currentfFace + 1) : 0;
    };

    charCube.contract = function () {
        charCube.rx += (rotXhome - charCube.rx) / 15;
        charCube.ry += (rotYhome - charCube.ry) / 15;
        charCube.rz += (rotZhome - charCube.rz) / 15;

        for (var c = 0; c < nCubes; c++ )
        {
            cube[c].extra.xchange = ((cube[c].extra.xhome - cube[c].x) * springiness) + (cube[c].extra.xchange * decay);
            cube[c].x += cube[c].extra.xchange;
            cube[c].extra.ychange = ((cube[c].extra.yhome - cube[c].y) * springiness) + (cube[c].extra.ychange * decay);
            cube[c].y += cube[c].extra.ychange;
            cube[c].extra.zchange = ((cube[c].extra.zhome - cube[c].z) * springiness) + (cube[c].extra.zchange * decay);
            cube[c].z += cube[c].extra.zchange;
        }
    };

    return charCube;
}

export default {
    create: create
};
