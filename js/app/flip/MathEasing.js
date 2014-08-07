TweenManager.Class(function MathEasing() {
    // console.log(':: MATH EASING')
    function d(i, g, h) {
        return ((a(g, h) * i + f(g, h)) * i + e(g)) * i
    }
    function b(k, n, l) {
        var h = k;
        for (var j = 0; j < 4; j++) {
            var m = c(h, n, l);
            if (m == 0) {
                return h
            }
            var g = d(h, n, l) - k;
            h -= g / m
        }
        return h
    }
    function c(i, g, h) {
        return 3 * a(g, h) * i * i + 2 * f(g, h) * i + e(g)
    }
    function a(g, h) {
        return 1 - 3 * h + 3 * g
    }
    function f(g, h) {
        return 3 * h - 6 * g
    }
    function e(g) {
        return 3 * g
    }
    this.convertEase = function (i) {
        var g = (function () {
            switch (i) {
            case "easeInQuad":
                return TweenManager.MathEasing.Quad.In;
                break;
            case "easeInCubic":
                return TweenManager.MathEasing.Cubic.In;
                break;
            case "easeInQuart":
                return TweenManager.MathEasing.Quart.In;
                break;
            case "easeInQuint":
                return TweenManager.MathEasing.Quint.In;
                break;
            case "easeInSine":
                return TweenManager.MathEasing.Sine.In;
                break;
            case "easeInExpo":
                return TweenManager.MathEasing.Expo.In;
                break;
            case "easeInCirc":
                return TweenManager.MathEasing.Circ.In;
                break;
            case "easeInElastic":
                return TweenManager.MathEasing.Elastic.In;
                break;
            case "easeInBack":
                return TweenManager.MathEasing.Back.In;
                break;
            case "easeInBounce":
                return TweenManager.MathEasing.Bounce.In;
                break;
            case "easeOutQuad":
                return TweenManager.MathEasing.Quad.Out;
                break;
            case "easeOutCubic":
                return TweenManager.MathEasing.Cubic.Out;
                break;
            case "easeOutQuart":
                return TweenManager.MathEasing.Quart.Out;
                break;
            case "easeOutQuint":
                return TweenManager.MathEasing.Quint.Out;
                break;
            case "easeOutSine":
                return TweenManager.MathEasing.Sine.Out;
                break;
            case "easeOutExpo":
                return TweenManager.MathEasing.Expo.Out;
                break;
            case "easeOutCirc":
                return TweenManager.MathEasing.Circ.Out;
                break;
            case "easeOutElastic":
                return TweenManager.MathEasing.Elastic.Out;
                break;
            case "easeOutBack":
                return TweenManager.MathEasing.Back.Out;
                break;
            case "easeOutBounce":
                return TweenManager.MathEasing.Bounce.Out;
                break;
            case "easeInOutQuad":
                return TweenManager.MathEasing.Quad.InOut;
                break;
            case "easeInOutCubic":
                return TweenManager.MathEasing.Cubic.InOut;
                break;
            case "easeInOutQuart":
                return TweenManager.MathEasing.Quart.InOut;
                break;
            case "easeInOutQuint":
                return TweenManager.MathEasing.Quint.InOut;
                break;
            case "easeInOutSine":
                return TweenManager.MathEasing.Sine.InOut;
                break;
            case "easeInOutExpo":
                return TweenManager.MathEasing.Expo.InOut;
                break;
            case "easeInOutCirc":
                return TweenManager.MathEasing.Circ.InOut;
                break;
            case "easeInOutElastic":
                return TweenManager.MathEasing.Elastic.InOut;
                break;
            case "easeInOutBack":
                return TweenManager.MathEasing.Back.InOut;
                break;
            case "easeInOutBounce":
                return TweenManager.MathEasing.Bounce.InOut;
                break;
            case "linear":
                return TweenManager.MathEasing.Linear.None;
                break
            }
        })();
        if (!g) {
            var h = TweenManager.getEase(i, true);
            if (h) {
                g = h
            } else {
                g = TweenManager.MathEasing.Cubic.Out
            }
        }
        return g
    };
    this.solve = function (h, g) {
        if (h[0] == h[1] && h[2] == h[3]) {
            return g
        }
        return d(b(g, h[0], h[2]), h[1], h[3])
    }
}, "Static");