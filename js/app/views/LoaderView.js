Class(function LoaderView() {

    Inherit(this, View);

    // PRIVATE GLOBAL VARIABLES    
    var _elem, q, i, b, h, _el;
    // var n
    var _canvas, f, m, a, e;

    var _self   = this;
    // var c       = Device.mobile.phone ? 80 : 140;
    var _ldsz   = Device.mobile.phone ? 80 : 140;
    var g       = 0;
    var k       = 0;


    (function () {
        _init();
        _renderFonts();
        _mainLoader();
        
        Render.startRender(r);
        _self.delayedCall(o, 200);

    })();


    function _init() {

        _elem = _self.element;
        
        _elem.size("100%").css({
            top: Device.mobile ? -10 : -50, 
            opacity: 0.9
        });
        _elem.percent = 0;
        _elem.wrapper = _elem.create(".wrapper");

        // _elem.wrapper.size("100%").bg('red').css({
        _elem.wrapper.size("100%").bg(Config.COLORS.white).css({
            left: "-100%"
        }).setZ(2);

    }

    function _renderFonts() {

        _el = _elem.create(".hidden");

        _el.css({
            opacity: 0
        });


        var w = ["GeomSlab703-ExtraBold", "GeomSlab703-Light", "GeomSlab703-LightItalic", "GeomSlab703-MediumCondensed",
                 "GeomSlab703-BoldCondensed", "GeomSlab703-Medium", "GeomSlab703-MediumItalic", "GeomSlab703-Bold", 
                 "GeomSlab703-BoldItalic", "AvenirLight"];
        for (var u = 0; u < w.length; u++) {
            
            var v = _el.create(".a");
            v.text("a").fontStyle(w[u], 12, "#000");
        }
    }

    function _mainLoader() {

        h = _elem.create(".circle");
        h.radius = _ldsz * 1.8;
        h.size(h.radius * 2, h.radius * 2).center();

        _canvas = _self.initClass(Canvas, h.radius * 2, h.radius * 2, true, null);
        h.addChild(_canvas);

        // CANVAS GRAPHICS, TO DRAW LOADING CIRCLE
        a = _self.initClass(CanvasGraphics, h.radius, h.radius * 2);

        a.anchor = {
            x: 0.5,
            y: 0.5
        };

        a.rotation = 0;
        // a.x = _ldsz * 1.79;
        // a.y = _ldsz * -0.72;
        a.x = -1.15;
        a.y = 1.15;
        a.strokeStyle = Config.COLORS.branding;
        a.lineWidth = h.radius * 0.015;
        _canvas.add(a);

        // 'f' BECOMES THE LOADER IMAGE IN THE CENTER
        f = {};
        f.texture = new Image();
        f.texture.src = Config.IMAGES + "loader/letter.png";

        var w;
        var _ltsz = Device.mobile.phone ? _ldsz + 74 : _ldsz + 124;

        for (var v = 0; v < 2; v++) {

            w = _self.initClass(CanvasTexture, f.texture, _ltsz, _ltsz);

            w.ox = w.x = _canvas.width / 2 - w.width / 2;
            w.oy = w.y = _canvas.height / 2 - w.height / 2;
            w.alpha = 0;
            _canvas.add(w);

            f["t" + v] = w;
            var u = _self.initClass(CanvasGraphics);
            _canvas.add(u);
            u.mask(w);

            u.beginPath();
            if (v === 0) {
                u.moveTo(0, 0);
                u.lineTo(_canvas.width, 0);
                u.lineTo(0, _canvas.height);
            } else {
                u.moveTo(_canvas.width, 0);
                u.lineTo(_canvas.width, _canvas.height);
                u.lineTo(0, _canvas.height);
            }
            u.fill();

            f["m" + v] = u;
        }

        w = _self.initClass(CanvasTexture, f.texture, _ltsz, _ltsz);
        w.x = _canvas.width / 2 - w.width / 2;
        w.y = _canvas.height / 2 - w.height / 2;
        w.visible = false;
        _canvas.add(w);

        f.clean = w;
        _canvas.startRender();
    }

    function r() {
        if (!_self || !a || !a.clear) {
            Render.stopRender(r);
            return false;
        }
        a.clear();
        var w = 0.2;
        if (k > 0.97) {
            w = 0.25;
        }
        k += (g - k) * w;
        if (k >= 0.996) {
            k = 100;
        }
        var v = _self.complete ? 360 : 360 * k;
        a.arc(h.radius, h.radius, v, h.radius/2, 0, false);
        a.stroke();

        // var u = _self.complete ? 180 + 180 : 180 + 180 * k;
        // a.arc(h.radius, h.radius, u, h.radius / 2, 180, false);
        // a.stroke();
    }
    function o() {
        // ALL RELATED TO LOADER LOGO IN CENTER 'f'

        var v = f.t0;
        var u = f.t1;
        v.alpha = 0;
        u.alpha = 0;
        v.y += 40;
        v.x -= 40;
        u.y -= 40;
        u.x += 40;

        TweenManager.tween(v, {
            alpha: 1,
            x: v.ox,
            y: v.oy
        }, 500, "workOpen");

        TweenManager.tween(u, {
            alpha: 1,
            x: v.ox,
            y: v.oy
        }, 500, "workOpen", 20);

        _self.delayedCall(function () {
            f.clean.visible = true;
            v.visible = false;
            u.visible = false;
        }, 550);
    }
    this.update = function (u) {
        g = u;
    };
    this.move = function () {
        _elem.tween({
            y: 100,
            opacity: 0
        }, 500, "workOpen", 75);
    };
    this.fade = function () {
        _elem.tween({
            opacity: 0
        }, 3000, "easeOutCubic");
    };
    this.destroy = function () {
        // console.log('DESTROY');
        Render.stopRender(r);
        _canvas.stopRender();
        return _self._destroy();
    }
});