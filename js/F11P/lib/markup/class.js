function $class() {

    var _self = this;
    Inherit(this, $markup);

    var _name = _self.constructor.toString().match(/function ([^\(]+)/)[1];
    
    this.element                = $("." + _name);

    // console.log('this.element');
    // console.log(this.element);
    
    this.element._useFragment   = true;
    Global[_name.toUpperCase()] = {};
    
    this.size = function(_width, _height) {
        this.element.size(_width, _height);
        return this;
    };

    this.css = function(properties) {
        this.element.css(properties);
        return this;
    };
    
    this.transform = function(properties) {
        this.element.transform(properties || this);
        return this;
    };
    
    this.tween = function(d, e, f, b, g, c) {
        // console.log('View :: tween : d: '+d);
        // console.log('View :: tween : e: '+e);
        // console.log('View :: tween : f: '+f);
        // console.log('View :: tween : b: '+b);
        // console.log('View :: tween : g: '+g);
        // console.log('View :: tween : c: '+c);
        return this.element.tween(d, e, f, b, g, c);
    };

}

