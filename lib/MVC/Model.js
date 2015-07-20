function Model() {
    // console.log('< MODEL >')
    Inherit(this, MVC);
    var _self = this;

    // console.log('######### _self.constructor #########');
    // console.log(_self.constructor);

    Global[_self.constructor.toString().match(/function ([^\(]+)/)[1].toUpperCase()] = {};

    this.__call = function () {
        // this.events.scope(this);
        delete this.__call;
    };
}