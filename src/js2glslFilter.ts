/// <reference path="../node_modules/js2glsl/js2glsl.d.ts" /> 

namespace jsfx {
    
    export class js2glslFilter extends js2glsl.ShaderSpecification<any,any,any> implements jsfx.IterableFilterInterface {
	protected properties : any = {};
	private vertexSource : string; 
	private fragmentSource : string; 
	
	constructor() {
	    super();
	    var shaders = this.ShaderSource(); 
	    this.vertexSource = shaders.vertex; 
	    this.fragmentSource = shaders.fragment; 
	    this.varyings = {}; 
	}

	public iterateCanvas(helper : jsfx.util.ImageDataHelper) : void {
	    var imageData = helper.getImageData();
	    var width = imageData.width;
	    var height = imageData.height;
	    var x = (helper.getIndex() / 4) % width;
	    var y = Math.floor((helper.getIndex() / 4) / width);
	    var w = width;
	    var h = height; 

	    this.varyings.texCoord = [ x/w, (h-y-1)/h  ]; 
	    this.varyings.texCoord = [ x/w, y/h  ]; 
	    this.uniforms = this.properties; 
	    this.uniforms.texture = new js2glsl.Sampler2D(imageData.data, w, h); 
	    this.uniforms.texSize = [w, h];
	    var rgba = this.FragmentColor(js2glsl.builtIns);

	    helper.r = rgba[0] || 0;
	    helper.g = rgba[1] || 0;
	    helper.b = rgba[2] || 0;
	    helper.a = rgba[3] || 255; 
	}

	public getVertexSource() : string {
	    return this.vertexSource;
	}

	public getFragmentSource() : string {
	    return this.fragmentSource;
	}

	public getProperties() : any {
	    return this.properties; 
	}

	public drawCanvas(renderer : jsfx.canvas.Renderer) : void {
	    return IterableFilter.drawCanvas([this], renderer);
	}

	public drawWebGL(renderer : jsfx.webgl.Renderer) : void {
	    var shader = renderer.getShader(this);
	    var properties = this.getProperties();

	    properties.texSize = [renderer.getSource().width, renderer.getSource().height];

	    renderer.getTexture().use();
	    renderer.getNextTexture().drawTo(function () {
		shader.uniforms(properties).drawRect();
	    });
	}

	VertexPosition(): number[] {
	    this.varyings.texCoord = this.attributes._texCoord; 
	    var xy = this.attributes.vertex; 
	    return [ xy[0]*2 - 1, xy[1]*2 - 1 ]; 
	}
        FragmentColor(builtIns : any): number[] {
	    return builtIns.texture2D(this.uniforms.texture, this.varyings.texCoord); 
	}
    }

}
