(function(){
      $.fn.tween = function(propObject, seconds, ease, delay, callback, params) {

            var _self = this;
            var _seconds = seconds;
            var _ease = ease ? ease : 'Quad.easeOut';
            var _propObject = propObject;
            var _delay = delay ? delay : null;
            var _callback = callback ? callback : null;
            var _params = params ? params : null;
            var _tran;
            var _anim;
            var _transObject = {};
            var _timeout;

            (function() {
                  
                  _propObject.transform = {};

                  for (var key in _propObject) {
                        if (_propObject.hasOwnProperty(key)) {
                              // console.log(key + " -> " + _propObject[key]);
                              // console.log(key[_propObject[key]]);
                              // _transObject.props = _propObject[key];
                              // var _name = key
                              // if (_propObject[key] == _propObject.rotation || 
                              if (_propObject[key] == _propObject.rotate || 
                                  _propObject[key] == _propObject.scaleX || 
                                  _propObject[key] == _propObject.scaleY || 
                                  _propObject[key] == _propObject.scale || 
                                  // _propObject[key] == _propObject.matrix || 
                                  _propObject[key] == _propObject.skewX || 
                                  _propObject[key] == _propObject.skewY || 
                                  _propObject[key] == _propObject.x || 
                                  _propObject[key] == _propObject.y || 
                                  _propObject[key] == _propObject.xPercent || 
                                  _propObject[key] == _propObject.yPercent ) {
                                    
                                    // TO DO: MAP THE PROPERTY OBJECT 'ROTATION'
                                    // TO 'ROTATE' SO IT MATCHES TRANSFORM 

                                    //then assign it to the propobject
                                    _propObject.transform[key] = _propObject[key];
                                    // console.log(_propObject)
                              } 
                              // _propObject.transform = key[_propObject[key]];
                        }
                  }

                  // console.log('_propObject.transform')
                  // console.log(_propObject.transform)
                  

                  _timeout = setTimeout(_animate, 0);
                  // _animate();
                  

            })();
            
            function _animate() {

                clearTimeout(_timeout);

                
                // testing for velocity
                // var __sec = _seconds * 1000;

                // var _animationProps =   {
                //                             duration: __sec,
                //                             easing: _ease !== null ? _ease : 'easeOutQuint', // Default easing
                //                             delay: _delay,
                //                             queue: false,
                //                             complete: _onComplete,
                //                         };
                

                _anim = TweenLite.to(_self.div, seconds, {css:_propObject, ease:_ease, force3D:false, clearProps:'matrix'});

                // testing for velocity
                // _anim = Velocity(_self.div, _propObject, _animationProps);
                


                if (_callback !== null) {
                      _anim.eventCallback("onComplete", function() {

                        _callback(_params);
                        _anim.kill();

                      });
                    // _cssanim
                } else {
                      _anim.eventCallback("onComplete", null);
                }

                if (_delay !== null) {
                      _anim.delay(_delay); //sets delay
                }
            }

            // testing for velocity
            // function _onComplete() {
            //     console.log('on complete');
            //     if (_callback !== null) {
            //         // console.log(_callback)
            //         console.log('this should call back the function')
            //         _callback(_params);
            //     } else {
            //         return;
            //     }
            // }
            
            return this;
    };

    // update the GreenSock properties of an object, without performing a tween
    // useful in a resize event, for example
    $.fn.setProps = $.fn.setProperties = function(propObject){
      var _self = this;

      TweenLite.set(_self.div, {css: propObject});

      return this;
    };

      // $.fn.stopTween = function(propObject) {
      //   var _self = this;
      //   _self.tween.anim.kill();

      // }
})();