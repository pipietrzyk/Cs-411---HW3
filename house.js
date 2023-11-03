var gl;
var points;

var RED = vec4(1.0, 0, 0, 1.0);
var BLUE = vec4(0, 0, 1.0, 1.0);
var YELLOW = vec4(1.0, 0.91, 0.0, 1.0);
var CYAN = vec4(0.0, 1.0, 1.0, 1.0);
var GREEN = vec4(0, 1, 0, 1);
var BLACK = vec4(0,0,0,1);
var PINK = vec4(1, 0.75, 0.79, 1);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    gl.enable(gl.DEPTH_TEST);

    // Four Vertices
    
    var vertices = [
        // Door
        [
            vec2( -0.2, -0.5),
            vec2( -0.2, 0.05),
            vec2( 0.2, 0.05),
            vec2( 0.2, -0.5)
        ],

        // Walls
        [
            vec2( -0.5, -0.5 ),
            vec2( -0.5,  0.25 ),
            vec2( 0.5, 0.25 ),
            vec2( 0.5, -0.5)
        ],

        // Roof
        [
            vec2( -0.5,  0.25 ),
            vec2( 0.5, 0.25 ),
            vec2(0, 0.5)
        ]
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Each object has its own program
    var program = new Array(3);

    var color = new Array(3);
    color[0] = BLUE; // Door
    color[1] = YELLOW // Walls
    color[2] = RED; // Roof

    // Uses the buttons to determine the color to use
    var colorToUse = vec4(1,0,0,1);
    document.getElementById("Red").onclick = function() {colorToUse = RED;}
    document.getElementById("Blue").onclick = function() {colorToUse = BLUE;}
    document.getElementById("Yellow").onclick = function() {colorToUse = YELLOW;}
    document.getElementById("Cyan").onclick = function() {colorToUse = CYAN;}
    document.getElementById("Green").onclick = function() {colorToUse = GREEN;}
    document.getElementById("Black").onclick = function() {colorToUse = BLACK;}
    document.getElementById("Pink").onclick = function() {colorToUse = PINK;}

    drawScreen(program, color, vertices);

    canvas.addEventListener("mousedown", function(event){
        var x = (event.clientX / 256) - 1;
        var y = ((canvas.height - event.clientY) / 256) - 1;

        if (x >= -0.5 && x <= 0.5 && y >= 0.25) { // ROOF
            color[2] = colorToUse;
            drawScreen(program, color, vertices);
        } else if (x > -0.2 && x < 0.2 && y > -0.5 && y < 0.05) { // DOOR
            color[0] = colorToUse;
            drawScreen(program, color, vertices);
        } else { // WALLS
            color[1] = colorToUse;
            drawScreen(program, color, vertices);
        }
    });

};


function render(vertices, fColor, color) {

    gl.uniform4fv(fColor, color);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices );
}

function drawScreen(program, color, vertices) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    for (let i = 0; i < program.length; i++) {
        program[i] = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program[i] );

        var vbuff = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vbuff );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices[i]), gl.STATIC_DRAW );
        var vPosition = gl.getAttribLocation( program[i], "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );


        var fColor = gl.getUniformLocation(program[i], "fColor");

        var numVertices = 4;
        if (i == 2) {
            numVertices = 3;
        }

        render(numVertices, fColor, color[i]);
    }
}