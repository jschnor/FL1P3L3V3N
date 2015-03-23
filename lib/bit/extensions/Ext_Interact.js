(function(){
    // @param _onOver (function) function to run on mouse over
    // @param _onOut (function) function to run on mouse out
    // @param _onClick (function) function to run on click or tap events
    // @param _setZ (boolean) set to true to set high z-index
    
    $.fn.interact = function(_onOver, _onOut, _onClick, _setZ) {

        var _self = this,
            _hit;

        // create hit box
        _hit = _self.create('.hit');
        _hit.size("100%").css({ cursor: "pointer", position: "absolute", left: 0, top: 0 });

        if (_setZ === true){
            _hit.setZ(99999);
        }

        _self.hit = _hit;

        if (!Device.mobile){
            if (typeof _onOver == 'function'){
                Evt.subscribe(_self.hit, Evt.MOUSE_OVER, _onOver);
            }

            if (typeof _onOut == 'function'){
                Evt.subscribe(_self.hit, Evt.MOUSE_OUT, _onOut);
            }

            if (typeof _onClick == 'function'){
                Evt.subscribe(_self.hit, Evt.CLICK, _onClick);
            }
        }else{
            if (typeof _onClick == 'function'){
                TouchUtil.bind(_self.hit, _onClick);
            }
        }

        return _self;
    };

    $.fn.removeInteract = function(_onOver, _onOut, _onClick) {

        var _self = this;

        if (typeof _self.hit == 'object'){
            if (!Device.mobile){
                if (typeof _onOver == 'function'){
                    Evt.removeEvent(_self.hit, Evt.MOUSE_OVER, _onOver);
                }

                if (typeof _onOut == 'function'){
                    Evt.removeEvent(_self.hit, Evt.MOUSE_OUT, _onOut);
                }

                if (typeof _onClick == 'function'){
                    Evt.removeEvent(_self.hit, Evt.CLICK, _onClick);
                }
            }else{
                if (typeof _onClick == 'function'){
                    TouchUtil.unbind(_self.hit, _onClick);
                }
            }
        }

        return _self;
    };
})();