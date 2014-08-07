Class(function LinkedList() {
    // console.log('< LINKED LIST >')
    var a = LinkedList.prototype;
    this.length = 0;
    this.first = null;
    this.last = null;
    this.current = null;
    a.push = function (b) {
        if (this.first === null) {
            b.__prev = b;
            b.__next = b;
            this.first = b;
            this.last = b
        } else {
            b.__prev = this.last;
            b.__next = this.first;
            this.last.__next = b;
            this.last = b
        }
        this.length++
    };
    a.remove = function (b) {
        if (this.length > 1 && b.__prev) {
            b.__prev.__next = b.__next;
            b.__next.__prev = b.__prev;
            if (b == this.first) {
                this.first = b.__next
            }
            if (b == this.last) {
                this.last = b.__prev
            }
        } else {
            this.first = null;
            this.last = null
        }
        b.__prev = null;
        b.__next = null;
        this.length--
    };
    a.empty = function () {
        this.length = 0;
        this.first = null;
        this.last = null;
        this.current = null
    };
    a.start = function (b) {
        b = b || this;
        b.current = this.first;
        return b.current
    };
    a.next = function (b) {
        b = b || this;
        if (!b.current || !b.current.__next) {
            return false
        }
        b.current = b.current.__next;
        if (b.current == b.current.__next || b.current == b.current.__prev) {
            b.current = null
        }
        return b.current
    };
    a.destroy = function () {
        Utils.nullObject(this);
        return null
    }
});