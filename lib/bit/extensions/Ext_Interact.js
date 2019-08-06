(function(){
    // paramsObj can have:
    // onOver (function) function to run on mouse over
    // onOut (function) function to run on mouse out
    // onClick (function) function to run on click or tap events
    // onDrag (function) function to run while move events are firing
    // setZ (boolean) set to true to set high z-index
    // anchor (boolean) set to true to make the element an A tag instead of DIV
    // href (string) the href attribute for the A tag (when "anchor" is true)

    // TODO: implement the onDrag event, both with mouse event and touch event
    
    $.fn.interact = function(paramsObj) {

        var _self = this,
            _onOver,
            _onOut,
            _onClick,
            _onDrag,
            _setZ,
            _anchor = false,
            _href = '';

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

        if (paramsObj.anchor === true){
            _anchor = true;
        }else{
            _anchor = false;
        }

        if (_anchor && paramsObj.href){
            _href = paramsObj.href;
        }else{
            _href = '';
        }


        // create hit box
        if (_anchor){
            _self.hit = _self.create('.hit', 'A');

            if (_href != ''){
                _self.hit.div.href = _href;
            }
        }else{
            _self.hit = _self.create('.hit');
        }
        
        _self.hit.size("100%").css({ display: 'block', cursor: "pointer", position: "absolute", left: 0, top: 0 });

        if (_setZ === true){
            _self.hit.setZ(99999);
        }

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

            // TODO: bind
            /*if (typeof _onDrag == 'function'){
                Evt.subscribe(_self.hit, Evt.CLICK, _onDrag);
            }*/
        }else{
            TouchUtil.bind(_self.hit, _onClick, _onDrag);
        }

        return _self;
    };

    $.fn.removeInteract = function(paramsObj) {
        // console.log('remove:');
        // console.log(paramsObj);
        
        var _self = this;

        if (typeof _self.hit == 'object'){
            if (!Device.mobile){
                if (typeof paramsObj.onOver == 'function'){
                    Evt.removeEvent(_self.hit, Evt.MOUSE_OVER, paramsObj.onOver);
                }

                if (typeof paramsObj.onOut == 'function'){
                    Evt.removeEvent(_self.hit, Evt.MOUSE_OUT, paramsObj.onOut);
                }

                if (typeof paramsObj.onClick == 'function'){
                    Evt.removeEvent(_self.hit, Evt.CLICK, paramsObj.onClick);
                }

                if (typeof paramsObj.onDrag == 'function'){
                    // TODO: unbind
                }
            }else{
                if (typeof paramsObj.onClick == 'function'){
                    if (typeof paramsObj.onDrag == 'function'){
                        TouchUtil.unbind(_self.hit, paramsObj.onClick, paramsObj.onDrag);
                    }else{
                        TouchUtil.unbind(_self.hit, paramsObj.onClick);
                    }
                }
            }

            if (_self.hit.div.href != ''){
                _self.hit.div.href = '';
            }
        }

        return _self;
    };
})();