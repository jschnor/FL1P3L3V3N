(function () {

    // console.log('FOURTH AGAIN CALL')
    // console.log(':: sets Flip Objects ($.fn) for attributes and values')
    // console.log($.fn)
    // $.fn.justin = function() {
    //     console.log('justin');
    //     console.log(this);

    //     return this;
    // }

    $.fn.attr = function (a, b) {
        // console.log('a')
        // console.log(a)
        // console.log('b')
        // console.log(b)
        if (a && b) {
            if (b == "") {
                this.div.removeAttribute(a)
            } else {
                this.div.setAttribute(a, b)
            }
        } else {
            if (a) {
                return this.div.getAttribute(a)
            }
        }
        return this
    };

    $.fn.val = function (a) {
        if (typeof a === "undefined") {
            return this.div.value
        } else {
            this.div.value = a
        }
        return this
    };

    $.fn.change = function (b) {
        var a = this;
        if (this._type == "select") {
            this.div.onchange = function () {
                b({
                    object: a,
                    value: a.div.value || ""
                })
            }
        }
    }
// })();




// (function () {
    // console.log('FIFTH CALL');
    // console.log(':: Sets Flip Objects ($.fn) for keypress, keydown and keyup');

    $.fn.keypress = function (a) {
        this.div.onkeypress = function (b) {
            console.log('keypress');
            b = b || window.event;
            b.code = b.keyCode ? b.keyCode : b.charCode;
            a(b)
        }
    };
    $.fn.keydown = function (a) {
        this.div.onkeydown = function (b) {
            b = b || window.event;
            b.code = b.keyCode;
            a(b)
        }
    };
    $.fn.keyup = function (a) {
        this.div.onkeyup = function (b) {
            b = b || window.event;
            b.code = b.keyCode;
            a(b)
        }
    }
})();