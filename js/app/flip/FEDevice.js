Class(function FEDevice() {
    // console.log(':: FEDevice – STATIC');

    var _self           = this;
    this.WIDTH          = window.innerWidth;
    this.HEIGHT         = window.innerHeight;
    this.PERFORMANCE    = 2;
    this.IE9 = Device.browser.ie && Device.browser.version == 9;

    this.VELOCITY_MULTIPLIER = (function () {
        if (Mobile.phone) {
            return 175;
        }
        if (Mobile.tablet) {
            return 100;
        }
        return 20
    })();

    this.PARALLAX_MULTIPLIER = (function () {
        if (Mobile.phone) {
            return 0.15;
        }
        if (Mobile.tablet) {
            return 0.15;
        }
        return 0.2;
    })();

    this.VIDEO_THUMBS = (function () {
        if (_self.PERFORMANCE < 2) {
            return false;
        }
        if (Device.mobile) {
            return false;
        }
        if (Device.browser.ie) {
            return false;
        }
        if (Device.browser.firefox) {
            return false;
        }
        return true
    })();

    this.VIDEO_BG = (function () {
        return false;
        if (Mobile.phone) {
            return false;
        }
        console.log('=======================================')
        console.log('DISABLE VIDEO BG UTNIL WE FIGURE IT OUT')
        console.log('=======================================')
        // return true
        return false;
    })();

    this.getAsset = function (c, b) {
        // return "http://" + c.bucket + ".s3.amazonaws.com/" + c.media + "/" + c.media + "." + b
        // console.log('GET ASSET: '+ c);
        // console.log('Builds the path to AWS, then returns that asset path');
        // console.log('Currently, just passing the path through.');
        // console.log(c);
        // console.log(c.main_image[0].urlPath);

        // return c.main_image[0].urlPath;
        return c;
    };

    this.getDetailAsset = function (c, b) {
        // return "http://" + c.bucket + ".s3.amazonaws.com/" + c.media + "/images/" + b + ".jpg";
        return c;
    };

    this.bundleAssets = function (e, d) {
        d = d || [];
        if (typeof e === "string") {
            e = [e];
        }
        for (var c = 0; c < e.length; c++) {
            for (var b = 0; b < Config.ASSETS.length; b++) {
                if (Config.ASSETS[b].strpos(e[c])) {
                    d.push(_self.parseAsset(Config.ASSETS[b]));
                }
            }
        }
        return d;
    };

    this.parseAsset = function (b) {
        if (b.strpos(".js")) {
            return Config.PROXY + b;
        }
        if (b.strpos("-gl")) {
            return Config.PROXY + b;
        }
        if (b.strpos(".vs")) {
            return Config.PROXY + b;
        }
        if (b.strpos(".fs")) {
            return Config.PROXY + b;
        }
        return Config.S3 + b;
    };

    this.performanceSet = function () {
        this.PARALLAX_ITEMS = (function () {
            if (Device.browser.firefox) {
                return false
            }
            if (!Device.mobile && Device.browser.safari) {
                return false
            }
            return _self.PERFORMANCE >= 1;
        })()
    }
}, "Static");