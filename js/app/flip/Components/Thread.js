
Class(function Thread() {
    // console.log('< THREAD >')
    Inherit(this, Component);
    var g = this;
    var a, d, c;
    (function () {
        f();
        b()
    })();

    function f() {
        c = (function () {
            if (typeof Config !== "undefined") {
                return Config.PATH || ""
            }
            return ""
        })();
        d = new Object();
        a = new Worker(c + "/assets/js/flip-thread.js");
        var h = Utils.constructor.toString();
        h += "Utils = new Utils();";
        a.postMessage({
            code: h
        })
    }
    function b() {
        a.addEventListener("message", e)
    }
    function e(h) {
        if (h.data.console) {
            console.log(h.data.message)
        }
        if (h.data.id) {
            var i = d[h.data.id];
            if (i) {
                i(h.data.message)
            }
            delete d[h.data.id]
        }
        if (h.data.emit) {
            var i = d[h.data.evt];
            if (i) {
                i(h.data.msg)
            }
        }
    }
    this.on = function (h, i) {
        d[h] = i
    };
    this.off = function (h) {
        delete d[h]
    };
    this.initFunction = function (k, j) {
        k = k.toString();
        if (!j) {
            k = k.replace("(", "!!!");
            var i = k.split("!!!");
            var h = i[0].split(" ")[1];
            k = "self." + h + " = function(" + i[1];
            a.postMessage({
                code: k,
                fn: h
            })
        } else {
            a.postMessage({
                code: k
            })
        }
    };
    this.initCode = function (j, l) {
        if (typeof l === "function") {
            l = [l]
        }
        var h = "self." + j + " = function(object, id) {";
        for (var k = 0; k < l.length; k++) {
            h += l[k].toString()
        }
        h += l[0].toString().match(/function ([^\(]+)/)[1] + "(object, id);";
        h += "}";
        a.postMessage({
            code: h,
            fn: j
        })
    };
    this.importScript = function (h) {
        a.postMessage({
            path: h,
            importScript: true
        })
    };
    this.send = function (h, j, l) {
        if (typeof h === "string") {
            var i = h;
            j = j || {};
            j.fn = h
        } else {
            l = j;
            j = h
        }
        var k = Utils.timestamp();
        if (l) {
            d[k] = l
        }
        a.postMessage({
            message: j,
            id: k
        })
    };
    this.destroy = function () {
        if (a.terminate) {
            a.terminate()
        }
        return this._destroy()
    }
});