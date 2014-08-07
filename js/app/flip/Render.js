Class(function Render() {
    // console.log('===========================')
    // console.log(':: RENDER :: ANIMATION LOOP')
    // console.log('===========================')
    var h = this;
    var n, e, k, g, a;
    var d = [];
    var j = [];
    var m = new LinkedList();
    var l = new LinkedList();
    var f = m;

    (function () {
        requestAnimationFrame(c);
        Flip.ready(b)
    })();

    function b() {
        setTimeout(function () {
            if (!k) {
                window.requestAnimationFrame = function (o) {
                    setTimeout(o, 1000 / 60)
                };
                c()
            }
        }, 250)
    }
    function c() {
        var p = Date.now();
        var r = 0;
        var q = 60;
        if (k) {
            r = p - k;
            q = 1000 / r
        }
        k = p;
        h.FPS = q;
        // console.log('FPS: '+q);
        for (var o = j.length - 1; o > -1; o--) {
            if (j[o]) {
                j[o](p, q, r)
            }
        }
        if (g && q < g) {
            for (o = d.length - 1; o > -1; o--) {
                if (d[o]) {
                    d[o](q)
                } else {
                    d.splice(o, 1)
                }
            }
        }
        if (f.length) {
            i()
        }
        requestAnimationFrame(c)
    }
    function i() {
        var o = f;
        f = f == m ? l : m;
        var p = o.start();
        while (p) {
            p();
            p = o.next()
        }
        o.empty()
    }
    this.startRender = function (q) {
        var p = true;
        var o = j.length - 1;
        if (j.indexOf(q) == -1) {
            j.push(q)
        }
    };
    this.stopRender = function (p) {
        var o = j.indexOf(p);
        if (o > -1) {
            j.splice(o, 1)
        }
    };
    this.addThreshold = function (o, p) {
        g = o;
        if (d.indexOf(p) == -1 && p) {
            d.push(p)
        }
    };
    this.removeThreshold = function (p) {
        if (p) {
            var o = d.indexOf(p);
            if (o > -1) {
                d.splice(o, 1)
            }
        } else {
            d = []
        }
        g = null
    };
    this.startTimer = function (o) {
        a = o || "Timer";
        if (console.time) {
            console.time(a)
        } else {
            e = Date.now()
        }
    };
    this.stopTimer = function () {
        if (console.time) {
            console.timeEnd(a)
        } else {
            console.log("Render " + a + ": " + (Date.now() - e))
        }
    };
    this.nextFrame = function (o) {
        f.push(o)
    };
    this.setupTween = function (o) {
        h.nextFrame(function () {
            h.nextFrame(o)
        })
    }
}, "Static");