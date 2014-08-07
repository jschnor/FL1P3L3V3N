Class(function Video(m) {
    // console.log('EIGHTH CALL')
    // console.log(':: STATIC - video classes')

    Inherit(this, Component);
    var i = this;
    var g, n, b, k, l, d;
    var c = 0;
    var e = {};
    this.loop = false;
    this.playing = false;
    this.width = m.width || 0;
    this.height = m.height || 0;
    (function () {
        j();
        a()
    })();

    function j() {
        var o = m.src;
        if (!o.strpos("webm") && !o.strpos("mp4") && !o.strpos("ogv")) {
            o += "." + Device.media.video
        }
        i.div = document.createElement("video");
        i.div.src = o;
        i.div.controls = m.controls;
        i.div.id = m.id || "";
        i.div.width = m.width;
        i.div.height = m.height;
        d = i.div.loop = m.loop;
        i.div.preload = true;
        i.object = $(i.div);
        i.width = m.width;
        i.height = m.height;
        i.object.size(i.width, i.height)
    }
    function a() {
        if (!Device.mobile && !Device.browser.ie) {
            i.div.play();
            setTimeout(function () {
                i.div.pause()
            }, 1)
        }
    }
    function f() {
        if (!i.div || !i.events) {
            return Render.stopRender(f)
        }
        i.duration = i.div.duration;
        i.time = i.div.currentTime;
        if (i.div.currentTime == b) {
            c++;
            if (c > 60 && !k) {
                k = true;
                i.events.fire(FlipEvents.ERROR, null, true)
            }
        } else {
            c = 0;
            if (k) {
                i.events.fire(FlipEvents.READY, null, true);
                k = false
            }
        }
        b = i.div.currentTime;
        if (i.div.currentTime >= i.div.duration - 0.001) {
            if (!d) {
                Render.stopRender(f);
                i.events.fire(FlipEvents.COMPLETE, null, true)
            }
        }
        e.time = i.div.currentTime;
        e.duration = i.div.duration;
        i.events.fire(FlipEvents.UPDATE, e, true)
    }
    function h() {
        if (!Device.mobile) {
            if (!l) {
                i.buffered = i.div.readyState == i.div.HAVE_ENOUGH_DATA
            } else {
                var o = -1;
                var q = i.div.seekable;
                if (q) {
                    for (var p = 0; p < q.length; p++) {
                        if (q.start(p) < l) {
                            o = q.end(p) - 0.5
                        }
                    }
                    if (o >= l) {
                        i.buffered = true
                    }
                } else {
                    i.buffered = true
                }
            }
        } else {
            i.buffered = true
        }
        if (i.buffered) {
            Render.stopRender(h);
            i.events.fire(FlipEvents.READY, null, true)
        }
    }
    this.set("loop", function (o) {
        if (!i.div) {
            return
        }
        d = o;
        i.div.loop = o
    });
    this.get("loop", function () {
        return d
    });
    this.play = function () {
        if (!i.div) {
            return false
        }
        if (!Device.mobile) {
            if (i.ready()) {
                i.playing = true;
                i.div.play();
                Render.startRender(f)
            } else {
                setTimeout(i.play, 10)
            }
        } else {
            i.playing = true;
            i.div.play();
            Render.startRender(f)
        }
    };
    this.pause = function () {
        if (!i.div) {
            return false
        }
        i.playing = false;
        i.div.pause();
        Render.stopRender(f)
    };
    this.stop = function () {
        i.playing = false;
        Render.stopRender(f);
        if (!i.div) {
            return false
        }
        i.div.pause();
        i.div.currentTime = 0
    };
    this.volume = function (o) {
        if (!i.div) {
            return false
        }
        i.div.volume = o
    };
    this.seek = function (o) {
        if (!i.div) {
            return false
        }
        if (i.div.readyState <= 1) {
            return setTimeout(function () {
                i.seek(o)
            }, 10)
        }
        i.div.currentTime = o
    };
    this.canPlayTo = function (o) {
        l = null;
        if (o) {
            l = o
        }
        if (!i.div) {
            return false
        }
        if (!i.buffered) {
            Render.startRender(h)
        }
        return this.buffered
    };
    this.ready = function () {
        if (!i.div) {
            return false
        }
        return i.div.readyState == i.div.HAVE_ENOUGH_DATA
    };
    this.size = function (o, p) {
        if (!i.div) {
            return false
        }
        this.div.width = this.width = o;
        this.div.height = this.height = p;
        this.object.size(o, p)
    };
    this.destroy = function () {
        this.stop();
        this.object.remove();
        return this._destroy()
    }
});