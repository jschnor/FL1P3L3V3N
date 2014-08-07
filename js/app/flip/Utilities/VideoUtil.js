Class(function VideoUtil() {
    Inherit(this, Component);
    var e = this;
    var c;
    var d = {};
    (function () {})();

    function b(h) {
        // for (var f = 0; f < h.length; f++) {
        //     var g = h[f];
        //     d[g.media] = new Video({
        //         src: "http://" + g.bucket + ".s3.amazonaws.com/" + g.media + "/" + g.media,
        //         width: 100,
        //         height: 100,
        //         loop: true
        //     });
        //     d[g.media].volume(0)
        // }
    }
    function a() {
        c = new Video({
            src: Config.S3 + "assets/videos/reel",
            width: 100,
            height: 100,
            loop: true
        })
    }
    this.init = function () {
        if (Device.mobile) {
            return
        }
        // b(Data.WORK.getData())
        b(Data.PAGES.getData())
    };
    this.getVideo = function (f) {
        return d[f]
    };
    this.getSrc = function (f) {
        return "http://" + f.bucket + ".s3.amazonaws.com/" + f.media + "/" + f.media
    };
    this.getReel = function () {
        return c
    }
}, "Static");