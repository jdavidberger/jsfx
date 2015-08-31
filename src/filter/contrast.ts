namespace jsfx.filter {
  /**
   * @filter           Contrast
   * @description      Provides multiplicative contrast control.
   * @param contrast   -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
   */
  export class Contrast extends jsfx.js2glslFilter {
    constructor(contrast? : number) {
	super();
      // set properties
      this.properties.contrast = jsfx.Filter.clamp(-1, contrast, 1) || 0;
    }

      public FragmentColor(builtIns : any): number[] {
	  var rgba = builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord); 
	  var contrast = this.uniforms.contrast; 
	  var m = contrast > 0 ? 1 / (1-contrast) : (1+contrast);
	  return [(rgba[0]-0.5) * m + 0.5,
		  (rgba[1]-0.5) * m + 0.5,
		  (rgba[2]-0.5) * m + 0.5]

      }

  }
}
