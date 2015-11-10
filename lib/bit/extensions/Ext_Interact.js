(function(){
    // @param onOver (function) function to run on mouse over
    // @param onOut (function) function to run on mouse out
    // @param onClick (function) function to run on click or tap events
    // @param onDrag (function) function to run while move events are firing
    // @param setZ (boolean) set to true to set high z-index

    // TODO: implement the onDrag event, both with mouse event and touch event
    
    // $.fn.interact = function(_onOver, _onOut, _onClick, _setZ) {
    $.fn.interact = function(paramsObj) {

        var _self = this,
            _hit;

        if (typeof paramsObj.onOver == 'function'){
            _onOver = paramsObj.onOver;
        }else{
            _onOver = null;
        }

        if (typeof paramsObj.onOut == 'function'){
            _onOut = paramsObj.onOut;
        }else{
            _onOut = null;
        }

        if (typeof paramsObj.onClick == 'function'){
            _onClick = paramsObj.onClick;
        }else{
            _onClick = null;
        }

        if (typeof paramsObj.onDrag == 'function'){
            _onDrag = paramsObj.onDrag;
        }else{
            _onDrag = null;
        }

        if (paramsObj.setZ === true){
            _setZ = true;
        }else{
            _setZ = false;
        }


        // create hit box
        _hit = _self.create('.hit');
        _hit.size("100%").css({ cursor: "pointer", position: "absolute", left: 0, top: 0 });

        if (_setZ === true){
            _hit.setZ(99999);
        }

        _self.hit = _hit;

        if (!Device.mobile){
            if (typeof _onOver == 'function'){
                console.log(_self);
                Evt.subscribe(_self.hit, Evt.MOUSE_OVER, _onOver);
            }

            if (typeof _onOut == 'function'){
                Evt.subscribe(_self.hit, Evt.MOUSE_OUT, _onOut);
            }

            if (typeof _onClick == 'function'){
                Evt.subscribe(_self.hit, Evt.CLICK, _onClick);
            }

            /*if (typeof _onDrag == 'function'){
                Evt.subscribe(_self.hit, Evt.CLICK, _onDrag);
            }*/
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