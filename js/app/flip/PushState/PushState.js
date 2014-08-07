Class(function PushState(a) {
    //console.log('< PUSH STATE >')
    var b = this;
    
    if (typeof a !== "boolean") {
        if (window.location.href.strpos("mlocal") == true){
            a = false;
        }else{
            a = window.location.href.strpos("local") || window.location.href.charAt(7) == "1";
        }
    }
    this.locked = false;
    this.dispatcher = new StateDispatcher(a);

    this.getState = function () {
        return this.dispatcher.getState();
    };
    this.setState = function (c) {
        this.dispatcher.setState(c);
    };
    this.setTitle = function (c) {
        this.dispatcher.setTitle(c);
    };
    this.lock = function () {
        this.locked = true;
        this.dispatcher.lock();
    };
    this.unlock = function () {
        this.locked = false;
        this.dispatcher.unlock();
    };
    this.setPathRoot = function (c) {
        this.dispatcher.setPathRoot(c);
    };
});