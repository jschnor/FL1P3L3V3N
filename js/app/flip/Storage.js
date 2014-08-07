Class(function Storage() {
    // console.log('< STORAGE STATIC >')
    var d = this;
    var c;
    (function () {
        a()
    })();

    function a() {
        if (window.localStorage) {
            try {
                window.localStorage.test = 1;
                window.localStorage.removeItem("test");
                c = true
            } catch (f) {
                c = false
            }
        } else {
            c = false
        }
    }
    function b(i, j, f) {
        var g;
        if (arguments.length > 1 && (j === null || typeof j !== "object")) {
            g = new Object();
            g.path = "/";
            g.expires = f || 1;
            if (j === null) {
                g.expires = -1
            }
            if (typeof g.expires === "number") {
                var l = g.expires,
                    h = g.expires = new Date();
                h.setDate(h.getDate() + l)
            }
            return (document.cookie = [encodeURIComponent(i), "=", g.raw ? String(j) : encodeURIComponent(String(j)), g.expires ? "; expires=" + g.expires.toUTCString() : "", g.path ? "; path=" + g.path : "", g.domain ? "; domain=" + g.domain : "", g.secure ? "; secure" : ""].join(""))
        }
        g = j || {};
        var e, k = g.raw ?
        function (m) {
            return m
        } : decodeURIComponent;
        return (e = new RegExp("(?:^|; )" + encodeURIComponent(i) + "=([^;]*)").exec(document.cookie)) ? k(e[1]) : null
    }
    this.setCookie = function (f, g, e) {
        b(f, g, e)
    };
    this.getCookie = function (e) {
        return b(e)
    };
    this.set = function (e, f) {
        if (typeof f === "object") {
            f = JSON.stringify(f)
        }
        if (c) {
            if (typeof f === "null") {
                window.localStorage.removeItem(e)
            }
            window.localStorage[e] = f
        } else {
            b(e, f, 365)
        }
    };
    this.get = function (e) {
        var g;
        if (c) {
            g = window.localStorage[e]
        } else {
            g = b(e)
        }
        if (g) {
            var f;
            if (g.charAt) {
                f = g.charAt(0)
            }
            if (f == "{" || f == "[") {
                g = JSON.parse(g)
            }
        }
        return g
    }
}, "Static");