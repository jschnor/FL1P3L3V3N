// Class(function Device() {
Class(function Device() {

    var _self   = this;
    // var _agent  = navigator.userAgent.toLowerCase();
    _self.agent = navigator.userAgent.toLowerCase();

    function isAvailable(feature) {
        var e = document.createElement("div"),
            d = "Khtml ms O Moz Webkit".split(" "),
            c = d.length;
        if (feature in e.style) {
            return true;
        }
        feature = feature.replace(/^[a-z]/, function (g) {
            return g.toUpperCase();
        });
        while (c--) {
            if (d[c] + feature in e.style) {
                return true;
            }
        }
        return false;
    }

    this.detect = function(_device) {
        if (typeof _device === "string") {
            _device = [_device];
        }
        for (var i = 0; i < _device.length; i++) {
            if (_self.agent.indexOf(_device[i]) != -1) {
                return true;
            }
        }
        return false;
    };

    this.mobile = ( !! ("ontouchstart" in window) && this.detect(["ios", "iphone", "ipad", "windows phone", "android", "blackberry", "iemobile"])) ? {} : false;
    if (this.mobile) {
        this.mobile.tablet = window.innerWidth > 1000 || window.innerHeight > 900;
        this.mobile.phone = !this.mobile.tablet;
    }

    this.browser = {};
    this.browser.chrome = this.detect("chrome");
    this.browser.safari = !this.browser.chrome && this.detect("safari");
    this.browser.firefox = this.detect("firefox");
    this.browser.ie = (function () {
        if (_self.detect("msie")) {
            return true;
        }
        if (_self.detect("trident") && _self.detect("rv:")) {
            return true;
        }
    })();
    this.vendor = (function () {
        if (_self.browser.firefox) {
            return "moz";
        }
        if (_self.browser.opera) {
            return "o";
        }
        if (_self.browser.ie && _self.browser.version >= 11) {
            return "";
        }
        if (_self.browser.ie) {
            return "ms";
        }
        return "webkit";
    })();
    this.system                 = {};
    this.system.retina          = window.devicePixelRatio > 1 ? true : false;
    this.system.webworker       = typeof window.Worker !== "undefined";
    this.system.offline         = typeof window.applicationCache !== "undefined";
    this.system.geolocation     = typeof navigator.geolocation !== "undefined";
    this.system.pushstate       = typeof window.history.pushState !== "undefined";
    this.system.webcam          = !! (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    this.system.language        = window.navigator.userLanguage || window.navigator.language;
    this.system.webaudio        = typeof window.webkitAudioContext !== "undefined" || typeof window.AudioContent !== "undefined";
    this.system.localStorage    = typeof window.localStorage !== "undefined";
    this.system.fullscreen      = typeof document[_self.vendor + "CancelFullScreen"] !== "undefined";
    this.system.os = (function () {
        if (_self.detect("mac os")) {
            return "mac";
        } else {
            if (_self.detect("windows nt 6.3")) {
                return "windows8.1";
            } else {
                if (_self.detect("windows nt 6.2")) {
                    return "windows8";
                } else {
                    if (_self.detect("windows nt 6.1")) {
                        return "windows7";
                    } else {
                        if (_self.detect("windows nt 6.0")) {
                            return "windowsvista";
                        } else {
                            if (_self.detect("windows nt 5.1")) {
                                return "windowsxp";
                            } else {
                                if (_self.detect("linux")) {
                                    return "linux";
                                }
                            }
                        }
                    }
                }
            }
        }
        return "undetected";
    })();
    this.media = {};
    this.media.audio = (function () {
        if ( !! document.createElement("audio").canPlayType) {
            return _self.detect(["firefox", "opera"]) ? "ogg" : "mp3";
        } else {
            return false;
        }
    })();
    this.media.video = (function () {
        var c = document.createElement("video");
        if ( !! c.canPlayType) {
            if (_self.mobile) {
                return "mp4";
            }
            if (_self.browser.chrome) {
                return "webm";
            }
            if (_self.browser.firefox || _self.browser.opera) {
                if (c.canPlayType('video/webm; codecs="vorbis,vp8"')) {
                    return "webm";
                }
                return "ogv";
            }
            return "mp4";
        } else {
            return false;
        }
    })();
    this.graphics = {};
    this.graphics.webgl = (function () {
        try {
            return !!window.WebGLRenderingContext && !! document.createElement("canvas").getContext("experimental-webgl");
        } catch (c) {}
    })();
    this.graphics.canvas = (function () {
        var c = document.createElement("canvas");
        return c.getContext ? true : false;
    })();
    this.styles = {};
    this.styles.filter = isAvailable("filter") && !_self.browser.firefox;
    this.styles.shader = _self.browser.chrome;
    this.styles.vendor = (function () {
        if (_self.browser.firefox) {
            return "Moz";
        }
        if (_self.browser.opera) {
            return "O";
        }
        if (_self.browser.ie && _self.browser.version >= 11) {
            return "";
        }
        if (_self.browser.ie) {
            return "ms";
        }
        return "Webkit";
    })();
    this.styles.vendorTransition = this.styles.vendor.length ? this.styles.vendor + "Transition" : "transition";
    this.styles.vendorTransform = this.styles.vendor.length ? this.styles.vendor + "Transform" : "transform";
    this.tween = {};
    this.tween.transition = isAvailable("transition");
    this.tween.css2d = isAvailable("transform");
    this.tween.css3d = isAvailable("perspective");
    this.tween.complete = (function () {
        if (_self.browser.firefox || _self.browser.ie) {
            return "transitionend";
        }
        if (_self.browser.opera) {
            return "oTransitionEnd";
        }
        return "webkitTransitionEnd";
    })();

    this.openFullscreen = function (elem) {
        elem = elem || __body;
        if (elem && _self.system.fullscreen) {
            if (elem == __body) {
                elem.css({
                    top: 0
                });
            }
            elem.div[_self.vendor + "RequestFullScreen"]();
        }
    };
    this.closeFullscreen = function () {
        if (_self.system.fullscreen) {
            document[_self.vendor + "CancelFullScreen"]();
        }
    };
    this.getFullscreen = function () {
        return document[_self.vendor + "IsFullScreen"] || document[_self.vendor + "FullScreen"];
    }
    // $('.video-fullscreen-btn', player).bind('click', function(e){
    //     if (player.requestFullscreen) {
    //         player.requestFullscreen();
    //     } else if (player.msRequestFullscreen) {
    //         player.msRequestFullscreen();
    //     } else if (player.mozRequestFullScreen) {
    //         player.mozRequestFullScreen();
    //     } else if (player.webkitRequestFullscreen) {
    //         player.webkitRequestFullscreen();
    //     }
    // });
, 'static'})


