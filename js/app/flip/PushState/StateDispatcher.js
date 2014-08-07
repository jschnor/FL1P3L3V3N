Class(function StateDispatcher(g) {
    // console.log('< STATE DISPATCHER >')
    Inherit(this, Events);
    var f = this;
    var i, a;
    var d = "/";
    this.locked = false;
    (function () {
        b();
        i = c();
        a = i;
    })();

    function b() {
        if (!Device.system.pushstate || g) {
            if (Device.detect(["msie 7", "msie 8", "firefox/3", "safari/4"])) {
                setInterval(function () {
                    var j = c();
                    if (j != a) {
                        h(j);
                    }
                }, 300);
            } else {
                window.addEventListener("hashchange", function () {
                    h(c());
                }, false);
            }
        } else {
            window.onpopstate = history.onpushstate = e;
        }
    }
    function c() {
        if (!Device.system.pushstate || g) {
            console.log('NO PUSH STATE');
            var j = window.location.hash;
            j = j.slice(3);
            return String(j)
        } else {
            var k = location.pathname.toString();
            k = d != "/" ? k.split(d)[1] : k.slice(1);
            k = k || "";
            // console.log('k:'+k);
            // console.log('===========================');

            return k
        }
    }
    function e() {
        var j = location.pathname;
        
        console.log('STATE DISPATCHER :: e(): j: '+j);
        console.log('f.locked: '+f.locked);
        console.log('a: ' + a );
        console.log('d: ' + d + 'j: ' + j);

        if (!f.locked && j != a) {
            j = d != "/" ? j.split(d)[1] : j.slice(1);
            j = j || "";
            a = j;
            f.events.fire(FlipEvents.UPDATE, {
                value: j,
                split: j.split("/")
            });
        } else {
            if (j != a) {
                if (a) {
                    window.history.pushState(null, null, d + j);
                }
            }
        }
    }
    function h(j) {
        if (!f.locked && j != a) {
            a = j;
            f.events.fire(FlipEvents.UPDATE, {
                value: j,
                split: j.split("/")
            });
        } else {
            if (j != a) {
                if (a) {
                    window.location.hash = "!/" + a;
                }
            }
        }
    }
    this.getState = function () {
        return c();
    };
    this.setPathRoot = function (j) {
        if (j.charAt(0) == "/") {
            d = j;
        } else {
            d = "/" + j;
        }
    };
    this.setState = function (j) {
        if (!Device.system.pushstate || g) {
            if (j != a) {
                window.location.hash = "!/" + j;
                a = j;
            }
        } else {
            if (j != a) {
                console.log('StateDispatch :: setState');
                console.log('::::::::::::::::::::::::::::::::');
                window.history.pushState(null, null, d + j);
                a = j;
            }
        }
    };
    this.setTitle = function (j) {
        document.title = j;
    };
    this.lock = function () {
        this.locked = true;
    };
    this.unlock = function () {
        this.locked = false;
    };
    this.forceHash = function () {
        g = true;
    }
});