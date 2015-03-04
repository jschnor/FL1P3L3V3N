(function(){
    $.fn.center = function (centerHorizontal, centerVertical) {
        var _object = {};
        if (typeof centerHorizontal === "undefined") {
            _object.left = "50%";
            _object.top = "50%";
            _object.marginLeft = -this.width / 2;
            _object.marginTop = -this.height / 2;
        } else {
            if (centerHorizontal) {
                _object.left = "50%";
                _object.marginLeft = -this.width / 2;
            }
            if (centerVertical) {
                _object.top = "50%";
                _object.marginTop = -this.height / 2;
            }
        }
        this.css(_object);
        return this;
    };
})();