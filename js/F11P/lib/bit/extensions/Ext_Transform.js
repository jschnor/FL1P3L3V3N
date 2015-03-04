(function(){

    $.fn.transform = function(properties) {

        var _props = properties;
        // transform: none|transform-functions|initial|inherit;

        var _self = this;

        // clear the transform first
        // console.log('---')
        // console.log(_self.div.style[Device.styles.vendorTransform])
        // _props.transform = null;
        _props.transform = {};
        // _self.div.style[Device.styles.vendorTransform] = '';


        for (var key in _props) {
            if (_props.hasOwnProperty(key)) {

                _props.transform[key] = _props[key];

                if (Config.DEBUG.all) {
                    console.log(_props.transform);
                }

                // translateX(x)
                if (_props.x) {

                    _self.div.style[Device.styles.vendorTransform] = 'translateX(' + Utils.convertToPx(_props.x) + ')';
                }
                // translateY(y)
                if (_props.y) {
                      _self.div.style[Device.styles.vendorTransform] = 'translateY(' + Utils.convertToPx(_props.y) + ')';
                }
                // translateZ(z)
                if (_props.z) {
                      _self.div.style[Device.styles.vendorTransform] = 'translateZ(' + Utils.convertToPx(_props.z) + ')';
                }
                // translate(x,y)
                if (_props.x && _props.y) {
                      _self.div.style[Device.styles.vendorTransform] = 'translate(' + Utils.convertToPx(_props.x) + ',' + Utils.convertToPx(_props.y) + ')';
                }
                // translate3d(x,y,z)
                if (_props.x && _props.y && _props.z) {
                      _self.div.style[Device.styles.vendorTransform] = 'translate3d(' + Utils.convertToPx(_props.x) + ',' + Utils.convertToPx(_props.y) + ',' + Utils.convertToPx(_props.z) + ')';
                }
                // scale(x,y)
                if (_props.scale) {
                      _self.div.style[Device.styles.vendorTransform] = 'scale(' + _props.scale + ',' + _props.scale + ')';
                      // _self.div.style[Device.styles.vendorTransform] = 'matrix(' + _props.scale + ', 0, 0, '+_props.scale+', 0, 0)';
                }
                // scale3d(x,y,z)
                if (_props.scale3d) {
                      _self.div.style[Device.styles.vendorTransform] = 'scale3d(' + _props.scale3d + ')';
                }

                // scaleX(x)
                if (_props.scaleX) {
                      _self.div.style[Device.styles.vendorTransform] = 'scaleX(' + _props.scaleX + ')';
                }
                // scaleY(y)
                if (_props.scaleY) {
                      _self.div.style[Device.styles.vendorTransform] = 'scaleY(' + _props.scaleY + ')';
                }
                // scaleZ(z)
                if (_props.scaleZ) {
                      _self.div.style[Device.styles.vendorTransform] = 'scaleZ(' + _props.scaleZ + ')';
                }
                // rotate(angle)
                if (_props.rotate) {

                    // if (Config.DEBUG.all) {
                    //     console.log(_self.div.style[Device.styles.vendorTransform]);
                    // }
                    _self.div.style[Device.styles.vendorTransform] = 'rotate(' + _props.rotate + ')';
                }
                // rotate3d(x,y,z,angle)
                if (_props.rotate3d) {
                      _self.div.style[Device.styles.vendorTransform] = 'rotate(' + _props.rotate3d + ')';
                }
                // rotateX(angle)
                if (_props.rotateX) {
                      _self.div.style[Device.styles.vendorTransform] = 'rotate(' + _props.rotateX + ')';
                }
                // rotateY(angle)
                if (_props.rotateY) {
                      _self.div.style[Device.styles.vendorTransform] = 'rotate(' + _props.rotateY + ')';
                }
                // rotateZ(angle)
                if (_props.rotateZ) {
                      _self.div.style[Device.styles.vendorTransform] = 'rotate(' + _props.rotateZ + ')';
                }
                // skew(x-angle, y-angle)
                if (_props.skew) {
                      _self.div.style[Device.styles.vendorTransform] = 'skew(' + Utils.convertToDeg(_props.skew) + ',' + Utils.convertToDeg(_props.skew) + ')';
                }
                // skewX(angle)
                if (_props.skewX) {
                      _self.div.style[Device.styles.vendorTransform] = 'skewX(' + Utils.convertToDeg(_props.skewX) + ')';
                }
                // skewY(angle)
                if (_props.skewY) {
                      _self.div.style[Device.styles.vendorTransform] = 'skewY(' + Utils.convertToDeg(_props.skewY) + ')';
                }

                // perspective(n)
                if (_props.perspective) {
                      _self.div.style[Device.styles.vendorTransform] = 'perspective(' + _props.perspective + ')';
                }

            }
        }
        _self.div.style.display = 'block';


        

        // TO DO: FIGURE OUT THE IMPORTANCE OF MATRIX - FIRST TRY IMPLEMENTATION
        // matrix(scaleX, skewX, skewY, scaleY, X, Y)
        // if (_props.scale || _props.scaleX || _props.scaleY &&
        //     _props.skew || _props.skewX || _props.skewY) {

        //     var _scaleX = 1;
        //     var _scaleY = 1;
        //     var _skewX = 0;
        //     var _skewY = 0;
        //     var _x = 0;
        //     var _y = 0;

        //     if (_props.scale) {
        //         _scaleX = _props.scale;
        //         _scaleY = _props.scale;
        //     } else {
        //         _scaleX = !_props.scaleX ? _scaleX : _props.scaleX;
        //         _scaleY = !_props.scaleY ? _scaleY : _props.scaleY;
        //     }

        //     if (_props.skew) {
        //         _skewX = _props.skew;
        //         _skewY = _props.skew;
        //     } else {
        //         _skewX = !_props.skewX ? _skewX : _props.skewX;
        //         _skewY = !_props.skewY ? _skewY : _props.skewY;
        //     }
        //     _x = !_props.x ? _x : _props.y;
        //     _y = !_props.x ? _y : _props.y;
             

        //     _self.div.style[Device.styles.vendorTransform] =
        //         'matrix(' + _scaleX + ', ' + _skewX + ', ' + _skewY + ', ' + _scaleY + ', ' + _x + ', ' + _y + ')';

        // }
        // } else {

        // }

        // TO DO: figure out how to apply matrix3D
        // matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)
        // initial

        // inherit

        return this;

    };
})();