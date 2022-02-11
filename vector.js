export class Vector3 {
    constructor(x, y, z) {
      this.coordinates = [x, y, z];
    }
  
    toString() {
      return `[${this.coordinates[0]}, ${this.coordinates[1]}, ${this.coordinates[2]}]`;
    }
    get x() {
        return this.coordinates[0];
      }
      
      get y() {
        return this.coordinates[1];
      }
      
      get z() {
        return this.coordinates[2];
      }
      
      set x(value) {
        this.coordinates[0] = value;
      }
      
      set y(value) {
        this.coordinates[1] = value;
      }
      
      set z(value) {
        this.coordinates[2] = value;
      }
  }