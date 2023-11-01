var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    gl.enable(gl.DEPTH_TEST);

    // Four Vertices
    
    var vertices = [
        // House base
        [
            vec2( -0.5, -0.5 ),
            vec2( -0.5,  0.25 ),
            vec2( 0.5, 0.25 ),
            vec2( 0.5, -0.5)
        ],

        // Door
        [
            vec2( -0.2, -0.5),
            vec2( -0.2, 0.15),
            vec2( 0.2, 0.15),
            vec2( 0.2, -0.5)
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


    //var program = initShaders( gl, "vertex-shader", "fragment-shader" ); //
    //gl.useProgram( program ); //
    
    // Uses the buttons to determine the color to use
    // Default color = red
    var colorToUse = vec4(1.0, 0, 0, 0.0, 1.0);
    document.getElementById("Red").onclick = function() {colorToUse = vec4(1.0, 0, 0, 1.0);}
    document.getElementById("Blue").onclick = function() {colorToUse = vec4(0.0, 0, 1.0, 1.0);}
    document.getElementById("Yellow").onclick = function() {colorToUse = vec4(1.0, 1.0, 0.8, 1.0);}
    document.getElementById("Cyan").onclick = function() {colorToUse = vec4(0.0, 1.0, 1.0, 1.0);}


    canvas.addEventListener("mousedown", function(event){});

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
                colorToUse = vec4(0.0, 0, 1.0, 1.0);
                break;
            case 1:
                colorToUse = vec4(1.0, 1.0, 0.8, 1.0);
                break;
            case 2:
                colorToUse = vec4(1.0, 0, 0, 1.0);
        }

        /*var cbuff = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cbuff );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colorToUse), gl.STATIC_DRAW );*/

        var fColor = gl.getUniformLocation(program[i], 'fColor'); // Gets the location of the variable in the vertex shader
        console.log(fColor)
        
        //gl.vertexAttribPointer(fColor, 3, gl.FLOAT, false, 0, 0);
        //gl.enableVertexAttribArray(fColor);


        var numVertices = 4;
        if (i == 2) {
            numVertices = 3;
        }

        //render(numVertices, fColor);
        render(numVertices, fColor, colorToUse);
    }


    // Load the data into the GPU
    
    //var bufferId = gl.createBuffer(); //
    //gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); //
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); //

    // Associate out shader variables with our data buffer
    
    //var vPosition = gl.getAttribLocation( program, "vPosition" );
    //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition );

    /*render();

    //New
    var program2 = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program2 );

    var bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition2 = gl.getAttribLocation( program2, "vPosition" );
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition2 );


    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3 );*/
};


function render(vertices, fColor, colorToUse) {
    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices );
    gl.uniform4fv(fColor, colorToUse);
}