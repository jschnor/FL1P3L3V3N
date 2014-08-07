Class(function XHR() {
    // console.log('< STATIC XHR >')
    var c = this;
    var b;

    function a(e, f) {
        if (typeof f === "object") {
            for (var d in f) {
                var g = e + "[" + d + "]";
                if (typeof f[d] === "object") {
                    a(g, f[d])
                } else {
                    b.push(g + "=" + f[d])
                }
            }
        } else {
            b.push(e + "=" + f)
        }
    }
    this.get = function (e, h, j, g) {
        if (typeof h === "function") {
            g = j;
            j = h;
            h = null
        } else {
            if (typeof h === "object") {
                var d = "?";
                for (var f in h) {
                    d += f + "=" + h[f] + "&"
                }
                d = d.slice(0, -1);
                e += d
            }
        }
        var i = new XMLHttpRequest();
        i.open("GET", e, true);
        i.send();
        i.onreadystatechange = function () {
            if (i.readyState == 4 && i.status == 200) {
                if (typeof j === "function") {
                    var k = i.responseText;
                    if (g == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                i = null
            }
        }
    };
    this.post = function (d, g, j, f, i) {
        if (typeof g === "function") {
            i = f;
            f = j;
            j = g;
            g = null
        } else {
            if (typeof g === "object") {
                if (j == "json" || f == "json" || i == "json") {
                    g = JSON.stringify(g)
                } else {
                    b = new Array();
                    for (var e in g) {
                        a(e, g[e])
                    }
                    g = b.join("&");
                    g = g.replace(/\[/g, "%5B");
                    g = g.replace(/\]/g, "%5D");
                    b = null
                }
            }
        }
        var h = new XMLHttpRequest();
        h.open("POST", d, true);
        switch (i) {
        case "upload":
            i = "application/upload";
            break;
        default:
            i = "application/x-www-form-urlencoded";
            break
        }
        h.setRequestHeader("Content-type", i);
        h.onreadystatechange = function () {
            if (h.readyState == 4 && h.status == 200) {
                if (typeof j === "function") {
                    var k = h.responseText;
                    if (f == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                h = null
            }
        };
        h.send(g)
    }
}, "Static");