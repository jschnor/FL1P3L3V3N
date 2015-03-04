(function(){
    $.fn.fontStyle = function (name, size, color, style) {
        var _styles = {};
        if (name) {
            _styles.fontFamily = name;
        }
        if (size) {
            _styles.fontSize = size;
        }
        if (color) {
            _styles.color = color;
        }
        if (style) {
            _styles.fontStyle = style;
        }
        this.css(_styles);

        return this;
    };
})();