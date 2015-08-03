Class(function Component() {
     // console.log('< COMPONENT >')
    Inherit(this, MVC);
    this.__call = function () {
        this.events.scope(this);
        delete this.__call;
    }
});