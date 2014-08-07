Class(function Device() {
    // console.log('< STATIC DEVICE SNIFFER >')
    var b = this;
    this.agent = navigator.userAgent.toLowerCase();

    function a(f) {
        var e = document.createElement("div"),
            d = "Khtml ms O Moz Webkit".split(" "),
            c = d.length;
        if (f in e.style) {
            return true;
        }
        f = f.replace(/^[a-z]/, function (g) {
            return g.toUpperCase()
        });
        while (c--) {
            if (d[c] + f in e.style) {
                return true;
            }
        }
        return false;
    }
    this.detect = function (d) {
        if (typeof d === "string") {
            d = [d];
        }
        for (var c = 0; c < d.length; c++) {
            if (this.agent.strpos(d[c])) {
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
    this.browser = new Object();
    this.browser.chrome = this.detect("chrome");
    this.browser.safari = !this.browser.chrome && this.detect("safari");
    this.browser.firefox = this.detect("firefox");
    this.browser.ie = (function () {
        if (b.detect("msie")) {
            return true;
        }
        if (b.detect("trident") && b.detect("rv:")) {
            return true;
        }
    })();
    this.browser.version = (function () {
        try {
            if (b.browser.chrome) {
                return Number(b.agent.split("chrome/")[1].split(".")[0]);
            }
            if (b.browser.firefox) {
                return Number(b.agent.split("firefox/")[1].split(".")[0]);
            }
            if (b.browser.safari) {
                return Number(b.agent.split("version/")[1].split(".")[0].charAt(0));
            }
            if (b.browser.ie) {
                if (b.detect("msie")) {
                    return Number(b.agent.split("msie ")[1].split(".")[0]);
                }
                return Number(b.agent.split("rv:")[1].split(".")[0]);
            }
        } catch (c) {
            return -1;
        }
    })();
    this.vendor = (function () {
        if (b.browser.firefox) {
            return "moz";
        }
        if (b.browser.opera) {
            return "o";
        }
        if (b.browser.ie && b.browser.version >= 11) {
            return "";
        }
        if (b.browser.ie) {
            return "ms";
        }
        return "webkit";
    })();
    this.system = new Object();
    this.system.retina = window.devicePixelRatio > 1 ? true : false;
    this.system.webworker = typeof window.Worker !== "undefined";
    this.system.offline = typeof window.applicationCache !== "undefined";
    this.system.geolocation = typeof navigator.geolocation !== "undefined";
    this.system.pushstate = typeof window.history.pushState !== "undefined";
    this.system.webcam = !! (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    this.system.language = window.navigator.userLanguage || window.navigator.language;
    this.system.webaudio = typeof window.webkitAudioContext !== "undefined" || typeof window.AudioContent !== "undefined";
    this.system.localStorage = typeof window.localStorage !== "undefined";
    this.system.fullscreen = typeof document[b.vendor + "CancelFullScreen"] !== "undefined";
    this.system.os = (function () {
        if (b.detect("mac os")) {
            return "mac";
        } else {
            if (b.detect("windows nt 6.3")) {
                return "windows8.1";
            } else {
                if (b.detect("windows nt 6.2")) {
                    return "windows8";
                } else {
                    if (b.detect("windows nt 6.1")) {
                        return "windows7";
                    } else {
                        if (b.detect("windows nt 6.0")) {
                            return "windowsvista";
                        } else {
                            if (b.detect("windows nt 5.1")) {
                                return "windowsxp";
                            } else {
                                if (b.detect("linux")) {
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
    this.media = new Object();
    this.media.audio = (function () {
        if ( !! document.createElement("audio").canPlayType) {
            return b.detect(["firefox", "opera"]) ? "ogg" : "mp3";
        } else {
            return false;
        }
    })();
    this.media.video = (function () {
        var c = document.createElement("video");
        if ( !! c.canPlayType) {
            if (Device.mobile) {
                return "mp4";
            }
            if (b.browser.chrome) {
                return "webm";
            }
            if (b.browser.firefox || b.browser.opera) {
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
    this.graphics = new Object();
    this.graphics.webgl = (function () {
        try {
            return !!window.WebGLRenderingContext && !! document.createElement("canvas").getContext("experimental-webgl");
        } catch (c) {}
    })();
    this.graphics.canvas = (function () {
        var c = document.createElement("canvas");
        return c.getContext ? true : false;
    })();
    this.styles = new Object();
    this.styles.filter = a("filter") && !b.browser.firefox;
    this.styles.shader = b.browser.chrome;
    this.styles.vendor = (function () {
        if (b.browser.firefox) {
            return "Moz";
        }
        if (b.browser.opera) {
            return "O";
        }
        if (b.browser.ie && b.browser.version >= 11) {
            return "";
        }
        if (b.browser.ie) {
            return "ms";
        }
        return "Webkit";
    })();
    this.styles.vendorTransition = this.styles.vendor.length ? this.styles.vendor + "Transition" : "transition";
    this.styles.vendorTransform = this.styles.vendor.length ? this.styles.vendor + "Transform" : "transform";
    this.tween = new Object();
    this.tween.transition = a("transition");
    this.tween.css2d = a("transform");
    this.tween.css3d = a("perspective");
    this.tween.complete = (function () {
        if (b.browser.firefox || b.browser.ie) {
            return "transitionend";
        }
        if (b.browser.opera) {
            return "oTransitionEnd";
        }
        return "webkitTransitionEnd";
    })();
    this.openFullscreen = function (c) {
        c = c || __body;
        if (c && b.system.fullscreen) {
            if (c == __body) {
                c.css({
                    top: 0
                });
            }
            c.div[b.vendor + "RequestFullScreen"]();
        }
    };
    this.closeFullscreen = function () {
        if (b.system.fullscreen) {
            document[b.vendor + "CancelFullScreen"]();
        }
    };
    this.getFullscreen = function () {
        return document[b.vendor + "IsFullScreen"];
    }
}, "Static");