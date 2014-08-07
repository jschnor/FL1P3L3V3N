Class(function MVC() {
    // console.log('ELEVENTH CALL');
    // console.log('======= MVC OBJECT');

    Inherit(this, Events);
    var a = {};
    this.classes = {};

    function b(d, c) {
        a[c] = {};
        Object.defineProperty(d, c, {
            set: function (e) {
                if (a[c]) {
                    a[c].s.apply(d, [e])
                }
            },
            get: function () {
                if (a[c]) {
                    return a[c].g.apply(d)
                }
            }
        })
    }
    this.set = function (d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].s = c
    };
    this.get = function (d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].g = c
    };
    this.delayedCall = function (f, c, d) {
        var self = this;
        return setTimeout(function () {
            if (self.element && self.element.show) {
                f.apply(self, [d])
            }
        }, c || 0)
    };
    this.initClass = function (m, p, o, n, l, k, j, i) {
        var h = Utils.timestamp();
        this.classes[h] = new m(p, o, n, l, k, j, i);
        this.classes[h].parent = this;
        this.classes[h].__id = h;
        if (this.element && arguments[arguments.length - 1] !== null) {
            this.element.addChild(this.classes[h])
        }
        // console.log('initClass: ')
        // console.log(this.classes[h])
        // console.log('------------------')

        return this.classes[h]
    };
    this.destroy = function () {
        if (this.container) {
            Global[this.container.div.id.toUpperCase()] = null
        }
        for (var d in this.classes) {
            var c = this.classes[d];
            if (c.destroy) {
                c.destroy()
            }
        }
        this.classes = null;
        if (this.events) {
            this.events = this.events.destroy()
        }
        if (this.element && this.element.remove) {
            this.element = this.container = this.element.remove()
        }
        if (this.parent && this.parent.__destroyChild) {
            this.parent.__destroyChild(this.__id)
        }
        return Utils.nullObject(this)
    };
    this.__destroyChild = function (c) {
        this.classes[c] = null;
        delete this.classes[c]
    }
});