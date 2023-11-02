var gl;
var points;

var RED = vec4(1.0, 0, 0, 1.0);
var BLUE = vec4(0, 0, 1.0, 1.0);
var YELLOW = vec4(1.0, 0.91, 0.0, 1.0);
var CYAN = vec4(0.0, 1.0, 1.0, 1.0);

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
    
    //  Load shaders and initialize attribute buffers
    
    var program = new Array(3);

    
    // Uses the buttons to determine the color to use
    // Default color = red
    var colorToUse = vec4(1.0, 0, 0, 0.0, 1.0);
    document.getElementById("Red").onclick = function() {colorToUse = RED;}
    document.getElementById("Blue").onclick = function() {colorToUse = BLUE;}
    document.getElementById("Yellow").onclick = function() {colorToUse = YELLOW;}
    document.getElementById("Cyan").onclick = function() {colorToUse = CYAN;}


    canvas.addEventListener("mousedown", function(event){
        //const rect = canvas.getBoundingClientRect();
        //const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
        //const y = (event.clientY - rect.top) / canvas.height * 2;
        var x = (event.clientX / 256) - 1;
        var y = ((canvas.height - event.clientY) / 256) - 1;

        if (x >= -0.5 && x <= 0.5 && y >= 0.25) {
            console.log("ROOF");
            console.log(x,y);
        } else if (x > -0.2 && x < 0.2 && y > -0.5 && y < 0.05) {
            console.log("DOOR");
            console.log(x,y);
        } else {
            console.log("WALL");
            console.log(x,y);
        }
    });

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

        switch (i) {
            case 0:
                colorToUse = BLUE;
                break;
            case 1:
                colorToUse = YELLOW;
                break;
            case 2:
                colorToUse = RED;
        }

        /*var cbuff = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cbuff );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colorToUse), gl.STATIC_DRAW );*/

        var fColor = gl.getUniformLocation(program[i], "fColor"); // Gets the location of the variable in the vertex shader
        console.log(fColor)
        
        //gl.vertexAttribPointer(fColor, 3, gl.FLOAT, false, 0, 0);
        //gl.enableVertexAttribArray(fColor);


        var numVertices = 4;
        if (i == 2) {
            numVertices = 3;
        }

        render(numVertices, fColor, colorToUse);
    }

};


function render(vertices, fColor, colorToUse) {

    gl.uniform4fv(fColor, colorToUse);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices );
}