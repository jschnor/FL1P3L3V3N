(function(){

    $.fn.visible = function () {
        this.div.style.visibility = "visible";
        return this;
    };
    $.fn.invisible = function () {
        this.div.style.visibility = "hidden";
        return this;
    };
})();