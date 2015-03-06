function $component() {
     // console.log('< COMPONENT >')
    Inherit(this, $markup);
    this.__call = function () {
        this.events.scope(this);
        delete this.__call;
    }
};