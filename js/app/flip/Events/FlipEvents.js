Class(function FlipEvents() {
    // console.log('==========================')
    // console.log(':: FLIP EVENTS')
    // console.log('==========================')

    var b = new Array();
    var a = {};
    this.BROWSER_FOCUS = "flip_focus";
    this.HASH_UPDATE = "flip_hash_update";
    this.COMPLETE = "flip_complete";
    this.PROGRESS = "flip_progress";
    this.UPDATE = "flip_update";
    this.LOADED = "flip_loaded";
    this.END = "flip_end";
    this.FAIL = "flip_fail";
    this.SELECT = "flip_select";
    this.ERROR = "flip_error";
    this.READY = "flip_ready";
    this.RESIZE = "flip_resize";
    this.CLICK = "flip_click";
    this.HOVER = "flip_hover";
    this.MESSAGE = "flip_message";
    this.ORIENTATION = "orientation";
    this.BACKGROUND = "background";
    this.BACK = "flip_back";
    this.PREVIOUS = "flip_previous";
    this.NEXT = "flip_next";
    this.RELOAD = "flip_reload";
    
    this._checkDefinition = function (c) {
        if (typeof c == "undefined") {
            throw "Undefined event"
        }
    };
    this._addEvent = function (f, g, c) {
        this._checkDefinition(f);
        var d = new Object();
        d.evt = f;
        d.object = c;
        d.callback = g;
        b.push(d)
    };
    this._removeEvent = function (c, e) {
        this._checkDefinition(c);
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].evt == c && b[d].callback == e) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    };
    this._destroyEvents = function (c) {
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].object == c) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    };
    this._fireEvent = function (c, f) {
        this._checkDefinition(c);
        var e = true;
        f = f || a;
        f.cancel = function () {
            e = false
        };
        for (var d = 0; d < b.length; d++) {
            if (b[d].evt == c) {
                if (e) {
                    b[d].callback(f)
                } else {
                    return false
                }
            }
        }
    };
    this._consoleEvents = function () {
        console.log(b)
    }
}, "Static");