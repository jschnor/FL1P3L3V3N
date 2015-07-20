Static(function Data() {

    Inherit(this, Model);

    var _self = this;
    var _data;
    var _work;

    bit.ready(function () {
        _setData();
    });

    function _setData(){
        _self.STATE = new StateModel();
    }
});