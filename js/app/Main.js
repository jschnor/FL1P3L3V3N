// ====================================
// MAIN
// ====================================

Class(function Main() {

    (function () {
      init();
      _webkitbackface();
    })();

    function init() {
        Mouse.capture();
        // THIS STARTS THE ACTUAL APP!
        Container.instance();
        // console.log(Data.ABOUT)
        // console.log(Data.WORK.getImages())


    }
    function _webkitbackface() {
        // console.log('MAIN :: ' + CSS._read());
        // console.log('DEVICE VENDOR :: ' + Device.vendor);

        if (Device.browser.chrome && Device.vendor == 'webkit') {

            var _css = '* { -webkit-backface-visibility: visible; }';
            CSS._write(_css);
            // var _css = CSS._read();

        }

        
        // var s = CSS._read();
        // var n = "/*" + m + "*/";
        // var C = "@-" + Device.vendor + "-keyframes " + m + " {\n";
        // var t = n + C;
        // if (s.strpos(m)) {
        //     var v = s.split(n);
        //     s = s.replace(n + v[1] + n, "")
        // }
        // var x = d.length - 1;
        // var z = Math.round(100 / x);
        // var w = 0;
        // for (var r = 0; r < d.length; r++) {
        //     var p = d[r];
        //     if (r == d.length - 1) {
        //         w = 100
        //     }
        //     t += (p.percent || w) + "% {\n";
        //     var o = false;
        //     var u = {};
        //     var B = {};
        //     for (var A in p) {
        //         if (TweenManager.checkTransform(A)) {
        //             u[A] = p[A];
        //             o = true
        //         } else {
        //             B[A] = p[A]
        //         }
        //     }
        //     if (o) {
        //         t += "-" + Device.vendor + "-transform: " + TweenManager.parseTransform(u) + ";"
        //     }
        //     for (A in B) {
        //         var q = B[A];
        //         if (typeof q !== "string" && A != "opacity" && A != "zIndex") {
        //             q += "px"
        //         }
        //         t += CSS._toCSS(A) + ": " + q + ";"
        //     }
        //     t += "\n}\n";
        //     w += z
        // }
        // t += "}" + n;
        // s += t;
        // CSS._write(s)
    }
});