namespace jsfx.filter {
  /**
   * @filter           Brightness
   * @description      Provides additive brightness control.
   * @param brightness -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
   */
  export class Brightness extends jsfx.js2glslFilter {
    constructor(brightness? : number) {
	super(); 
      // set properties
      this.properties.brightness = jsfx.Filter.clamp(-1, brightness, 1) || 0;
    }

      public FragmentColor(builtIns : any): number[] {
	  var rgba = builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord); 
	  return [rgba[0] + this.uniforms.brightness,
		  rgba[1] + this.uniforms.brightness,
		  rgba[2] + this.uniforms.brightness ]; 
      }
  }
}
