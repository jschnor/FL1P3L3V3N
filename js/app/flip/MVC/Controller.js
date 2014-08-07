Class(function Controller(a) {
     // console.log('< CONTROLLER >')
    Inherit(this, MVC);
    a = a.constructor.toString().match(/function ([^\(]+)/)[1];
    this.element = this.container = $("#" + a);
    this.element.__useFragment = true;
    Global[a.toUpperCase()] = {};
    this.css = function (b) {
        this.container.css(b)
    }
});