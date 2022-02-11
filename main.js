import {VertexAttributes} from './vertex-attributes';
import {ShaderProgram} from './shader-program';
import {VertexArray} from './vertex-array';
import {Vector3} from './vector';

let canvas;
let attributes;
let shaderProgram;
let vao;
let nInput;
let radiusInput;



function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 0.5, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  shaderProgram.bind();
  //shaderProgram.setUniform3f('color', 1, 0, 0);
  vao.bind();
  vao.drawIndexed(gl.TRIANGLES);
  vao.unbind();
  shaderProgram.unbind();
}

function onResizeWindow() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  render();
}
async function initialize() {
  canvas = document.getElementById('canvas');
  window.gl = canvas.getContext('webgl2');


  const positions = [
    -1,  1, 0,
     1, -1, 0,
    -1, -1, 0,
     //0.7,  0.5, 0.0,
     1, 1, 0
  ];

  const indices = [
    2, 0, 1,
    3, 1, 0
  ];

  const colors = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    1, 0, 1
  ];

  
  // VAO, VBO, shader program setup...

  const vertexSource = `
  in vec3 position;
  in vec3 color;
  out vec3 mixColor;
  
  vec3 f() {
    return vec3 (1,0,1);
  }
  
  void main() {
    gl_Position = vec4(position, 1.0);
    mixColor = f();
  }
  `;

  const fragmentSource = `
  in vec3 mixColor;
  out vec4 fragmentColor;
  
  void main() {
    fragmentColor = vec4(mixColor, 1.0);
  }
  `;
  shaderProgram = new ShaderProgram(vertexSource, fragmentSource);

  const attributes = new VertexAttributes();
  attributes.addAttribute('position', 4, 3, positions);
  attributes.addAttribute('color', 4, 3, colors);
  attributes.addIndices(indices);


  vao = new VertexArray(shaderProgram, attributes);

  //generateCircle(50, 1);

  // Event listeners
  window.addEventListener('resize', onResizeWindow);
    // other event listeners...
    //nInput.addEventListener('input', synchronize);
    //radiusInput.addEventListener('input', synchronize);
  onResizeWindow();
}




window.addEventListener('load', initialize);