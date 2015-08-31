namespace jsfx.filter {
  /**
   * @filter           Hue / Saturation
   * @description      Provides multiplicative saturation control. RGB color space
   *                   can be imagined as a cube where the axes are the red, green, and blue color
   *                   values.
   *                   Saturation is implemented by scaling all color channel values either toward
   *                   or away from the average color channel value.
   * @param saturation -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
   */
  export class Saturation extends jsfx.js2glslFilter {
      constructor(saturation? : number) {
	  super();
	  // set properties
	  this.properties.saturation = jsfx.Filter.clamp(-1, saturation, 1) || 0;
      }
      
      public FragmentColor(builtIns : any): number[] {
	  var rgb = builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord);
	  var average = (rgb[0] + rgb[1] + rgb[2]) / 3.0;
	  var saturation = this.uniforms.saturation;
	  for(var i = 0;i < 4;i++) {
	      if(saturation > 0.0) {
		  rgb[i] += (average - rgb[i]) * (1.0 - 1.0 / (1.001 - saturation)); 
	      } else {
		  rgb[i] += (average - rgb[i]) * (-saturation);
	      }
	  }
	  return rgb; 
      }
  }
}
