Class(function Start() {

	(function() {
    	Container.instance();
    	_transparentOutline();
	})();
    // console.log(Container.instance())
    // console.log('Start');
    // console.log(Mouse)
    // console.log(mouse)
    function _transparentOutline() {
        // console.log('MAIN :: ' + CSS._read());
        // console.log('DEVICE VENDOR :: ' + Device.vendor);
        // console.log(Mobile.os);
        // console.log(Mobile);

        if (Mobile.os !== 'Android') {

            // if (Device.browser.version >= 35 && Device.browser.version <= 36) {
                var _css = '* { outline: 1px solid transparent; }';
                CSS._write(_css);
            // }
            // var _css = CSS._read();
        }
    }
});
// var Start = new Start();