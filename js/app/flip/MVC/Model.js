Class(function Model(a) {
    // console.log('< MODEL >')
    Inherit(this, MVC);
    Global[a.constructor.toString().match(/function ([^\(]+)/)[1].toUpperCase()] = {};
    this.__call = function () {
        this.events.scope(this);
        delete this.__call
    }
});
