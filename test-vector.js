import {Vector3} from './vector.js';

const vector = new Vector3(1, 2, 3);
console.log(vector.x, vector.y, vector.z);

vector.x = 0;
vector.z = vector.y;
console.log(vector.x, vector.y, vector.z);