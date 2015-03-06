function $bitObject(selector, type, exists, usefragment) {

    var _self = this;
    var _type = type;
    var _first, _name, _timer;
    var _selector, _content, _element, _fragment;

    // this._useFragment = usefragment;

    this._useFragment = usefragment === undefined ? null : usefragment;
    this._children = new $markuplist();
    
    // NOT REALLY USING CUSTOM BIT OBJECT EVENTS YET
    
    (function() {
        _init();
    })();

    function _init() {
        
        _selector = selector;

        if (Config.DEBUG.all || Config.DEBUG.bitobject) {
            console.log('BITOBJECT :: '+_selector);
            // console.log(_selector);
            // throw 'selector from init';
        }

        if (_selector && typeof _selector !== 'string') {
            _self.div = _selector;
            // console.log('not string :: '+_selector);
        } else {
            _first  = _selector ? _selector.charAt(0) : null;
            _name   = _selector ? _selector.slice(1) : null;

            // console.log(_selector);
            // console.log(_name);
            // console.log('first');
            // console.log(_first);
            // if (this.useFragment === true) {
            // console.log('this.useFragment')
            // console.log(_self.useFragment)


            if (_first != '.' && _first != '#') {
                console.log('none :: '+_selector);
                _name = _selector;
                _first = '.';
            }
            if (!exists) {

                _self._type = _type || 'div';
                _self.div = document.createElement(_self._type);

            
                if (_first) {
                    if (_first == '#') {
                        _self.div.id = _name;
                    } else {
                        _self.div.className = _name;
                    }
                }

            } else {
                if (_first != '#') {
                    throw 'Bit Selectors Require #ID';
                }
                _self.div = document.getElementById(_name);
            }
            
        }

        _self.div.$bitObject = _self;

        // return _self.div;
        // console.log('####### _self.div')
        // console.log(_self.div)
        // console.log(_self.div)
        // console.log(_first)
        
        // this.useFragment
        // _self.div.$bitObject = _self;
        // console.log('$bitObject :: init');
        // console.log(_self);

        // console.log('instanceof $bitObject')
        // console.log(_self instanceof $bitObject)
        
    }

    function attachFragment() {
        if (!_fragment) {
            return false;
        }
        _self.div.appendChild(_fragment);

        if (Config.DEBUG.all || Config.DEBUG.bitobject) {
            // console.log('BITOBJECT :: attachFragment called');
            // console.log(_fragment);
        }
        // if (_fragExists) {
        //     clearInterval(_int);
        // }
        _timer = _fragment = null;
    };

    this.addChild = this.add = function(child) {
        // console.log('============ BITOBJECT :: ADDCHILD ===============');
        // console.log('child');
        // console.log(child);
        // console.log(child.element);
        // console.log(_self)

        // if (_self.useFragment === true) {
        //     console.log('USE FRAGMENT');
        // }
        
        var __div = _self.div;

        if (_self._useFragment) {
            // console.log('USE FRAGMENT');
            if (!_fragment) {
                _fragment = document.createDocumentFragment();
                clearTimeout(_timer);
                _timer = setTimeout(attachFragment, 1);

            }
            __div = _fragment;
        }

        if (child.element && child.element instanceof $bitObject) {

            if (Config.DEBUG.all || Config.DEBUG.bitobject) {
                console.log('if child element ===============');
                console.log(__div);
            }

            __div.appendChild(child.element.div);

            // _self.div = __div;
            child.div = child.element.div;
            // child = child.element;
            
            // _self._children.push(child.element);
            _self._children.push(__div);
            child.element._parent = _self;
            

        } else {
            // console.log('============ child.element NOT $bitObject ===============');
            // console.log(child);
            // console.log(child.container);
            // __div.appendChild(child.div);
            // console.log('=========================================================');

            if (child.container && child.container instanceof FlipObject) {
                __div.appendChild(child.container.div);
                
                child.div = child.container.div;
                // child = child.container;


                _self._children.push(child.container);
                child.container._parent = _self;

            
            } else {
                if (child.div) {
                    __div.appendChild(child.div);
                    
                    // child.element = child.div;

                    this._children.push(child);
                    child._parent = this;
            
                } else {
                    if (child.nodeName) {
                        // console.log('============ child.nodeName ===============');
                        // console.log(child.nodeName)
                        __div.appendChild(child);
                    }
                }
            }
        }
        return _self;
    };

    this.removeChild = function (object, keepalive) {
        if (!keepalive) {
            try {
                this.div.removeChild(object.div);
            } catch(e) {}
        }
        this._children.remove(object);
    };

    this.create = function(__newelement, __type) {

        var child = $(__newelement, __type);
        this.addChild(child);
        return child;
    };
    this.clone = function () {
        return $(this.div.cloneNode(true));
    };
    this.text = function (text) {
        if (typeof text !== "undefined") {
            
            _self.div.innerHTML = text;
            
            return _self;

        } else {

            return _self.div.innerHTML;

        }
    };

    // this.parent = function () {
    //     return this._parent;
    // };
    // this.children = function () {
    //     return this.div.children ? this.div.children : this.div.childNodes;
    // };
}