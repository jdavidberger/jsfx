/// <reference path="dotScreen.ts" />

namespace jsfx.filter {
  /**
   * @filter        Color Halftone
   * @description   Simulates a CMYK halftone rendering of the image by multiplying pixel values
   *                with a four rotated 2D sine wave patterns, one each for cyan, magenta, yellow,
   *                and black.
   * @param centerX The x coordinate of the pattern origin.
   * @param centerY The y coordinate of the pattern origin.
   * @param angle   The rotation of the pattern in radians.
   * @param size    The diameter of a dot in pixels.
   */
  export class ColorHalfTone extends jsfx.filter.DotScreen {
      constructor(protected centerX : number, protected centerY : number, angle : number, size : number) {
	  super(centerX, centerY, angle, size);
	  
	  // set properties
	  this.properties.angle = Filter.clamp(0, angle, Math.PI / 2);
	  this.properties.scale = Math.PI / size;
      }

      public FragmentColor(builtIns : any ) : [number,number,number] {
          var rgba = builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord);
	  var angle = this.uniforms.angle;
          var k = Math.min(1-rgba[0], Math.min(1-rgba[1], 1-rgba[2]));
          var cmy = [(1.0 - rgba[0] - k) / (1.0 - k), 
		     (1.0 - rgba[1] - k) / (1.0 - k),
		     (1.0 - rgba[2] - k) / (1.0 - k)];
          k = builtIns.clamp(k * 10.0 - 5.0 + this.pattern(angle + 0.78539), 0.0, 1.0);
	  var angles = [ angle + 0.26179,
			 angle + 1.30899,
			 angle ];
	  for(var i = 0;i < 3;i++) {
	      cmy[i] = builtIns.clamp(cmy[i] * 10.0 - 3.0 + this.pattern(angles[i]), 0.0, 1.0);
	      cmy[i] = 1.0 - cmy[i] - k; 
	  }
	  return [cmy[0], cmy[1], cmy[2], rgba[3]];
      }
      
  }
}
