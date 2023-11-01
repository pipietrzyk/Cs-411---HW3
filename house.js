var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2( -0.5,  0.25 ),
        vec2( 0.5, 0.25 ),
        vec2( 0.5, -0.5)
    ];

    var vertices2 = [
        vec2( -0.5,  0.25 ),
        vec2( 0.5, 0.25 ),
        vec2(0, 0.5)
    ];


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Uses the buttons to determine the color to use
    // Default = red
    var colorToUse = vec4(1.0, 0, 0, 1);
    document.getElementById("Red").onclick = function() {colorToUse = vec4(1.0, 0, 0, 1);}
    document.getElementById("Blue").onclick = function() {colorToUse = vec4(0.0, 0, 1.0, 1);}
    document.getElementById("Yellow").onclick = function() {colorToUse = vec4(1.0, 1.0, 0.8, 1);}
    document.getElementById("Cyan").onclick = function() {colorToUse = vec4(0.0, 1.0, 1.0, 1);}


    canvas.addEventListener("mousedown", function(event){});


    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

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


    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3 );
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}