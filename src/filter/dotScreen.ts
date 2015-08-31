namespace jsfx.filter {
  /**
   * @filter        Dot screen
   * @description   Simulates a CMYK halftone rendering of the image by multiplying pixel values
   *                with a four rotated 2D sine wave patterns, one each for cyan, magenta, yellow,
   *                and black.
   * @param centerX The x coordinate of the pattern origin.
   * @param centerY The y coordinate of the pattern origin.
   * @param angle   The rotation of the pattern in radians.
   * @param size    The diameter of a dot in pixels.
   */
  export class DotScreen extends jsfx.js2glslFilter {
    constructor(protected centerX : number, protected centerY : number, angle : number, size : number) {
	super();

	this.properties.angle = Filter.clamp(0, angle, Math.PI / 2);
	this.properties.scale = Math.PI / size;	
	this.properties.center = [this.centerX, this.centerY];
    }

      public pattern(angle : number) {
	  var s : number = Math.sin(angle);
	  var c : number = Math.cos(angle);
	  var scale : number = this.uniforms.scale; 
	  var tX : number = this.varyings.texCoord[0] * this.uniforms.texSize[0] - this.uniforms.center[0];
	  var tY : number = this.varyings.texCoord[1] * this.uniforms.texSize[1] - this.uniforms.center[1];

	  return (Math.sin((c * tX - s * tY) * scale) * Math.sin((s * tX + c * tY) * scale)) * 4;
      }

      public FragmentColor(builtIns : any ) : [number,number,number] {
	  var rgba = builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord); 
	  var average : number = (rgba[0] + rgba[1] + rgba[2]) / 3;

	  var pValue : number = this.pattern(this.uniforms.angle);
	  var value : number = average * 10 - 5 + pValue;
	  
	  return [value,value,value];
    }
  }
}
