Class(function MVC() {

    // Inherit(this, _Events);
    
    var _gsobject = {};
    this.classes = {};

    function _getterSetter(name, value) {
        _gsobject[value] = {};
        Object.defineProperty(name, value, {
            set: function(_event) {
                if (_gsobject[value]) {
                    _gsobject[value].set.apply(name, [_event]);
                }
            },
            get: function() {
                if (_gsobject[value]) {
                    return _gsobject[value].get.apply(name);
                }
            }
        });
    }

    this.set = function(name, value) {
        if (!_gsobject[name]) {
            _getterSetter(this, name);
        }
        _gsobject[name].set = value;
    };
    this.get = function(name, value) {
        if (!_gsobject[name]) {
            _getterSetter(this, name);
        }
        _gsobject[name].get = value;
    };

    this.delayedCall = function(callback, time, params) {
        var _self = this;
        return setTimeout(function() {
            // if (_self.element && _self.element.show) {
            if (_self.element) {
                callback.apply(_self, [params]);
            }
        }, time || 0);
    };


    this.initClass = function(name, param1, param2, param3, param4, param5, param6, param7) {
        var _time = Utils.timestamp();
        this.classes[_time] = new name(param1, param2, param3, param4, param5, param6, param7);
        this.classes[_time].parent = this;
        this.classes[_time].__id = _time;
        if (this.element && arguments[arguments.length - 1] !== null) {
            this.element.addChild(this.classes[_time]);
        }

        return this.classes[_time];
    };

    this.__destroy = function() {

        // this
        if (this.container) {
            
            if (Config.DEBUG.all || Config.DEBUG.markup) {
                console.log('MARKUP :: destroy : container ==============');
                console.log(this.container);

                // a note about debug - it will stop executing the given function
                // if you use the 'throw' keyword
                // throw 'DESTROY: this.container()';
            }

            this.container._parent.div.removeChild(this.container.div);
            this.container._children = null;

            // this.container.div = null;

            this.container = null;
        }

        if (this.element) {

            try {
                if (this.element.div.hasOwnProperty('remove')){
                    this.element.div.remove();
                }else{
                    this.element._parent.div.removeChild(this.element.div);
                }
            }catch(error){
                console.warn('Could not remove element.');
                console.log(error);
            }

            this.element = null;
            delete this.element;
        }

        if (this.__id) {

            if (Config.DEBUG.all || Config.DEBUG.markup) {
                console.log('MARKUP :: destroy : id/classes =================');
                console.log(this.__id);
                console.log(this.classes);
            }

            this.__id = null;
            this.classes = null;

            if (Config.DEBUG.all || Config.DEBUG.markup) {
                console.log(this.__id);
                console.log(this.classes);
                console.log('MARKUP :: destroy : id/classes :: END ============');
            }
        }
        
    };
   
});