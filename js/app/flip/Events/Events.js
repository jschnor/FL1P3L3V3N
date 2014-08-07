Class(function Events(c) {
    // console.log('EVENTS CLASS')
    // console.log(c)
    // console.log('++++++++++++++++++++++')

    this.events = {};
    var b = {};
    var a = {};
    this.events.subscribe = function (d, e) {
        FlipEvents._addEvent(d, e, c);
    };
    this.events.unsubscribe = function (d, e) {
        FlipEvents._removeEvent(d, e);
    };
    this.events.fire = function (d, f, e) {
        f = f || a;
        FlipEvents._checkDefinition(d);
        if (b[d]) {
            f.target = f.target || c;
            b[d](f);
            f.target = null;
        } else {
            if (!e) {
                FlipEvents._fireEvent(d, f);
            }
        }
    };
    this.events.add = function (d, e) {
        FlipEvents._checkDefinition(d);
        b[d] = e;
    };
    this.events.remove = function (d) {
        FlipEvents._checkDefinition(d);
        if (b[d]) {
            delete b[d];
        }
    };
    this.events.bubble = function (e, d) {
        FlipEvents._checkDefinition(d);
        var f = this;
        e.events.add(d, function (g) {
            f.fire(d, g);
        });
    };
    this.events.scope = function (d) {
        c = d;
    };
    this.events.destroy = function () {
        FlipEvents._destroyEvents(c);
        b = null;
        return null;
    }
});