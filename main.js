  import {VertexAttributes} from './vertex-attributes';
  import {ShaderProgram} from './shader-program';
  import {VertexArray} from './vertex-array';
  import {Vector3} from './vector';

  let canvas;
  let attributes;
  let shaderProgram;
  let vao;
  let userFunctionInput;
  let mousePosX;
  let mousePosY;
  let pageStartTime;

  function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clearColor(1, 0.5, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    shaderProgram.bind();
    shaderProgram.setUniform2f ('dimensions', canvas.width.toFixed(2), canvas.height.toFixed(2));
    shaderProgram.setUniform3f ('mouse', mousePosX, mousePosY, 0);
    shaderProgram.setUniform3f ('colors', 0.0, 1.0, 1.0);
    shaderProgram.setUniform1f ('time', getTime());
    vao.bind();
    vao.drawIndexed(gl.TRIANGLES);
    vao.unbind();
    shaderProgram.unbind();
  }


  // get time function/math found online
  // https://stackoverflow.com/questions/41632942/how-to-measure-time-elapsed-on-javascript
  function getTime () {
    var endTime = new Date();
    var timeDiff = endTime - pageStartTime; //in ms
    // turn into seconds
    timeDiff /= 1000;
    // return unrounded seconds
    return timeDiff;
  }

  function onResizeWindow() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    render();
  }
  async function initialize() {
    canvas = document.getElementById('canvas');
    window.gl = canvas.getContext('webgl2');
    pageStartTime = new Date();

    // pretty sure this is depcriated 
    const positions = [
      -1,  1, 0,
       1, -1, 0,
      -1, -1, 0,
       1,  1, 0
    ];

    const indices = [
      2, 0, 1,
      3, 1, 0
    ];

    const colors = [
      1, 0, 0,
      0, 1, 0,
      0, 1, 1,
      1, 0, 1
    ];

    // done so there is a none blank screen on start up
    userFunctionInput = 'vec3 color = vec3(1,0,1);'
    
    const attributes = new VertexAttributes();
    attributes.addAttribute('position', 4, 3, positions);
    attributes.addIndices(indices);
    shaderProgramHelper(attributes);

    // Event listeners
    window.addEventListener('resize', onResizeWindow);
    window.addEventListener('keydown', pressEnter);
    window.addEventListener('mousemove', mouseTracker)
    window.setInterval (onResizeWindow, 100);

    onResizeWindow();
    render()
  }

  function mouseTracker (event) {
    mousePosX = event.clientX
    mousePosY = event.clientY
    render()
  }

  // basic function to take in user input
  function pressEnter(event) {
    if (event.key === 'Enter') {
      userFunctionInput = document.getElementById('input').value
      console.log (userFunctionInput)
      shaderProgram = shaderProgramHelper(vao.attributes);
      // DO SOMETHING
      render()
    }
  }

  // helper function to redefine shader program
  function shaderProgramHelper (attributes) {
    const vertexSource = `
    in vec3 position;
    out vec3 mixColor;
    
    
    void main() {
      gl_Position = vec4(position, 1.0);
      mixColor = vec3 (0,1,1);
    }
    `;

    const fragmentSource = `


    uniform vec2 dimensions;
    uniform vec3 mouse;
    uniform float time;
    uniform vec3 colors;
    in vec3 mixColor;
    out vec4 fragmentColor;
    
    vec3 f() {
      ${userFunctionInput}
      return color; 
    }

    void main() {
      fragmentColor = vec4(f(), 1.0);
    } 
    `;
    shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
    vao = new VertexArray(shaderProgram, attributes);
    return shaderProgram; 
  }

  window.addEventListener('load', initialize);