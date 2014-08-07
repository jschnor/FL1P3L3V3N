Class(function FlipObject(c, d, b, g) {
    // console.log('FLIP OBJECT');
    var self = this;
    var h;
    
    this._events = {};
    this._children = new LinkedList();
    this.__useFragment = g;

    (function () {
        init();
    })();

    function init() {
        if (c && typeof c !== "string") {
            self.div = c;
        } else {
            var k = c ? c.charAt(0) : null;
            var j = c ? c.slice(1) : null;
            if (k != "." && k != "#") {
                j = c;
                k = ".";
            }
            if (!b) {

                self._type = d || "div";
                self.div = document.createElement(self._type);
                if (k) {
                    if (k == "#") {
                        self.div.id = j;
                    } else {
                        self.div.className = j;
                    }
                }
            } else {
                if (k != "#") {
                    throw "Flip Selectors Require #ID";
                }
                self.div = document.getElementById(j);
            }
        }
        self.div.flipObject = self;
    }
    function i(l, j, k) {
        if (l[k == "." ? "className" : "id"] == j) {
            return l;
        }
        return false;
    }
    function a() {
        if (!h) {
            return false;
        }
        self.div.appendChild(h);
        h = null;
    }
    this.addChild = this.add = function (k) {
        var j = this.div;
        if (this.__useFragment) {
            if (!h) {
                h = document.createDocumentFragment();
                Render.nextFrame(a);
            }
            j = h;
        }
        if (k.element && k.element instanceof FlipObject) {
            j.appendChild(k.element.div);
            this._children.push(k.element);
            k.element._parent = this;
        } else {
            if (k.container && k.container instanceof FlipObject) {
                j.appendChild(k.container.div);
                this._children.push(k.container);
                k.container._parent = this;
            } else {
                if (k.div) {
                    j.appendChild(k.div);
                    this._children.push(k);
                    k._parent = this;
                } else {
                    if (k.nodeName) {
                        j.appendChild(k);
                    }
                }
            }
        }
        return this;
    };
    this.clone = function () {
        return $(this.div.cloneNode(true));
    };
    this.create = function (j, k) {
        var l = $(j, k);
        this.addChild(l);
        return l;
    };
    this.empty = function () {
        var j = this._children.start();
        while (j) {
            if (j && j.remove) {
                j.remove();
            }
            j = this._children.next();
        }
        this.div.innerHTML = "";
        return this;
    };
    this.text = function (j) {
        if (typeof j !== "undefined") {
            this.div.innerHTML = j;
            return this;
        } else {
            return this.div.innerHTML;
        }
    };
    this.parent = function () {
        return this._parent;
    };
    this.children = function () {
        return this.div.children ? this.div.children : this.div.childNodes;
    };
    this.removeChild = function (k, j) {
        if (!j) {
            try {
                this.div.removeChild(k.div);
            } catch (l) {}
        }
        this._children.remove(k);
    };
    this.remove = function (l) {
        this.stopTween();
        var j = this._parent;
        if (j && j.removeChild) {
            j.removeChild(this);
        }
        if (!l) {
            var k = this._children.start();
            while (k) {
                if (k && k.remove) {
                    k.remove();
                }
                k = this._children.next();
            }
            this._children.empty();
            Utils.nullObject(this);
        }
    };
    this.hide = function () {
        this.div.style.display = "none";
        return this;
    };
    this.show = function () {
        this.div.style.display = "block";
        return this;
    }
});