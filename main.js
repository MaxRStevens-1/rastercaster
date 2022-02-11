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
  vao.drawSequence(gl.TRIANGLES);
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
    -0.7, -0.5, 0,
     0.7, -0.5, 0,
     0.0,  0.5, 0,
  ];

  const colors = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ];

  
  // VAO, VBO, shader program setup...

  const vertexSource = `
  in vec3 position;
  in vec3 color;
  out vec3 mixColor;
  uniform vec3 offset;
  
  void main() {
    gl_Position = vec4(position, 1.0);
    mixColor = color;
    vec3 translatedPosition = position + offset;
    gl_Position = vec4(translatedPosition, 1.0);
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
  shaderProgram.setUniform3f('offset', 0.1, 0.3, 0);

  const attributes = new VertexAttributes();
  attributes.addAttribute('position', 3, 3, positions);
  attributes.addAttribute('color', 3, 3, colors);


  vao = new VertexArray(shaderProgram, attributes);

  //generateCircle(50, 1);

  // Event listeners
  window.addEventListener('resize', onResizeWindow);
    // other event listeners...
    //nInput.addEventListener('input', synchronize);
    //radiusInput.addEventListener('input', synchronize);
  onResizeWindow();
}
function generateCircle(n, radius) 
{
  var positions = new Array();
  var radChunks = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++)  
  {
    positions.push (radius * Math.cos(radChunks * i),
      radius * Math.sin(radChunks * i), 0)
  }
  const attributes = new VertexAttributes();
  attributes.addAttribute('position', n, 3, positions);
  vao = new VertexArray(shaderProgram, attributes);

  render();
}

window.addEventListener('load', initialize);


function synchronize() {
  // Release any previous VAO and VBOs.
  vao?.destroy();
  attributes?.destroy();

  const n = parseInt(nInput.value);
  const radius = parseFloat(radiusInput.value);
  console.log(n, radius);
  // TODO: regenerate circle and redraw.
  generateCircle (n, radius);
}