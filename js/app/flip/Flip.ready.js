Flip.ready(function () {
    // console.log('=======================');
    // console.log(':: Flip ready function');
    // console.log('=======================');

    window.__window = $(window);
    window.__document = $(document);
    window.__body = $(document.getElementsByTagName("body")[0]);
    window.Stage = __body.create("#Stage");
    Stage.size("100%");
    Stage.__useFragment = true;
    
    Stage.width = window.innerWidth || document.documentElement.offsetWidth;
    Stage.height = window.innerHeight || document.documentElement.offsetHeight;
    
    (function () {
        var b = Date.now();
        var a;

        setTimeout(function () {
            var g = ["hidden", "msHidden", "webkitHidden"];
            var f, e;
            (function () {
                for (var h in g) {
                    if (document[g[h]] !== "undefined") {
                        f = g[h];
                        switch (f) {
                        case "hidden":
                            e = "visibilitychange";
                            break;
                        case "msHidden":
                            e = "msvisibilitychange";
                            break;
                        case "webkitHidden":
                            e = "webkitvisibilitychange";
                            break
                        }
                        return
                    }
                }
            })();
            if (typeof document[f] === "undefined") {
                if (Device.browser.ie) {
                    document.onfocus = focus;
                    document.onblur = blur
                } else {
                    window.onfocus = focus;
                    window.onblur = blur
                }
            } else {
                document.addEventListener(e, function () {
                    var h = Date.now();
                    if (h - b > 10) {
                        if (document[f] === false) {
                            focus()
                        } else {
                            blur()
                        }
                    }
                    b = h
                })
            }
        }, 250);

        function focus() {
            if (a != "focus") {
                FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                    type: "focus"
                })
            }
            a = "focus"
        }

        function blur() {
            if (a != "blur") {
                FlipEvents._fireEvent(FlipEvents.BROWSER_FOCUS, {
                    type: "blur"
                })
            }
            a = "blur"
        }
    })();

    window.onresize = function () {
        if (!Device.mobile) {
            Stage.width = window.innerWidth || document.documentElement.offsetWidth;
            Stage.height = window.innerHeight || document.documentElement.offsetHeight;
            FlipEvents._fireEvent(FlipEvents.RESIZE);
        }
    }

});
