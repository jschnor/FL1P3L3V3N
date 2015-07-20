function LinkedList() {
    // console.log('< LINKED LIST >')
    var _list = LinkedList.prototype;
    this.length = 0;
    this.first = null;
    this.last = null;
    this.current = null;
    
    _list.push = function (_elem) {
        if (this.first === null) {
            _elem.__prev = _elem;
            _elem.__next = _elem;
            this.first = _elem;
            this.last = _elem;
        } else {
            _elem.__prev = this.last;
            _elem.__next = this.first;
            this.last.__next = _elem;
            this.last = _elem;
        }
        this.length++;
    };
    _list.remove = function (_elem) {
        if (this.length > 1 && _elem.__prev) {
            _elem.__prev.__next = _elem.__next;
            _elem.__next.__prev = _elem.__prev;
            if (_elem == this.first) {
                this.first = _elem.__next;
            }
            if (_elem == this.last) {
                this.last = _elem.__prev;
            }
        } else {
            this.first = null;
            this.last = null;
        }
        _elem.__prev = null;
        _elem.__next = null;
        this.length--;
    };
    _list.empty = function () {
        this.length = 0;
        this.first = null;
        this.last = null;
        this.current = null;
    };
    _list.start = function (_elem) {
        _elem = _elem || this;
        _elem.current = this.first;
        return _elem.current;
    };
    _list.next = function (_elem) {
        _elem = _elem || this;
        if (!_elem.current || !_elem.current.__next) {
            return false;
        }
        _elem.current = _elem.current.__next;
        if (_elem.current == _elem.current.__next || _elem.current == _elem.current.__prev) {
            _elem.current = null;
        }
        return _elem.current
    };
    _list.destroy = function () {
        Utils.nullObject(this);
        return null;
    }
};