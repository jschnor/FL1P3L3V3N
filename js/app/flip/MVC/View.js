Class(function View(a) {
    // console.log('< VIEW >')
    Inherit(this, MVC);
    this.element = $("." + a.constructor.toString().match(/function ([^\(]+)/)[1]);
    this.element.__useFragment = true;
    this.css = function (b) {
        this.element.css(b);
        return this
    };
    this.transform = function (b) {
        this.element.transform(b || this);
        return this
    };
    this.tween = function (d, e, f, b, g, c) {
        return this.element.tween(d, e, f, b, g, c)
    }
});