function Viewport3D(_width, _height) {
    Inherit(this, View, "viewport");
    var _this = this;
    var _containers = new Array();
    (function() {
        createElements()
    })();
    function createElements() {
        _this.element.css({
            width: _width,
            height: _height,
            position: "absolute"
        });
        _this.element.div.style[Device.styles.vendor + "TransformStyle"] = "preserve-3d";
        _this.element.div.style[Device.styles.vendor + "Perspective"] = "2000px"
    }
    this.perspective = function(num) {
        _this.element.div.style[Device.styles.vendor + "Perspective"] = num + "px"
    };
    this.perspectiveOrigin = function(x, y) {
        _this.element.div.style[Device.styles.vendor + "PerspectiveOrigin"] = x + "px " + y + "px"
    };
    this.addChild = function($obj) {
        if ($obj.element) {
            $obj = $obj.element
        }
        $obj.div.style[Device.styles.vendor + "TransformStyle"] = "preserve-3d";
        _this.element.addChild($obj);
        _containers.push($obj)
    };
    this.removeChild = function($obj) {
        var len = _containers.length-1;
        for (var i = len; i>-1; i--) {
            if (_containers[i].child3d == $obj) {
                _containers[i].remove();
                _containers.splice(i, 1)
            }
        }
    };
    this.destroy = function() {
        var len = _containers.length-1;
        for (var i = len; i>-1; i--) {
            if (_containers[i].destroy) {
                _containers[i].destroy()
            } else {
                if (_containers[i].remove) {
                    _containers[i].remove()
                }
            }
        }
        _containers = null;
        return this._destroy()
    };
    this.transformPoint = function(x, y, z) {
        this.element.transformPoint(x, y, z);
        return this
    };
    this.transform = function(obj) {
        this.element.transform(obj);
        return this
    };
    this.tween = function(props, time, ease, delay, callback, manual) {
        return this.element.tween(props, time, ease, delay, callback, manual)
    }
}