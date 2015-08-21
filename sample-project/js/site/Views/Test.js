Class(function Test(index) {

    Inherit(this, View);
    // Inherit(this, $slide);
    
    var _self = this,
    	_elem = _self.element,
    	_t1,
    	_t2,
    	_t3,
    	_link,
    	_input;

    (function(){
    	_init();
    })();

    function _init(){
    	_self.index = index;

    	_elem.size('100%').css({
    		textAlign: 'center',
    		fontSize: '48px'
    	}).bg(colorPick(_self.index));
    	_elem.text(textPick(_self.index));

    	if (_self.index == 0){
	    	_t1 = _elem.create('.yellowbox');
	    	_t1.size('25%').setProps({
	    		left: '25%',
	    		top: '25%',
	    		border: '5px solid #ffffff'
	    	}).bg('#F2DB41');

	    	/*_t2 = _t1.create('.redbox');
	    	_t2.size('75%').setProps({
	    		left: '12.5%',
	    		top: '12.5%',
	    		border: '5px solid #ffffff'
	    	}).bg('#ff0000');*/

	    	/*_t3 = _t2.create('.bluebox');
	    	_t3.size('75%').setProps({
	    		left: '12.5%',
	    		top: '12.5%',
	    		border: '5px solid #ffffff'
	    	}).bg('#0000ff');*/

			_t1.interact(function(){
				console.log('over');
			}, function(){
				console.log('out');
			}, function(){
				console.log('click');
				_ajaxTest();
			});

	    	_link = _t1.create('.link', 'a');
	    	_link.setProps({
	    		top: '50%',
	    		right: '10%'
	    	});
	    	_link.text('test link');
	    	_link.div.href = 'http://google.com';

	    	_input = _t1.create('.field', 'input');
	    	_input.size("75%", "25%").setProps({
	    		left: '12.5%',
	    		top: '33%',
	    		color: '#000000'
	    	}).bg('#ffffff');

	    	// console.log(_link);
	    	// console.log(_input);
		}
    }

    function _ajaxTest(){

    	if (window.XMLHttpRequest){
            xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    if (xhr.status == 200){
                    	console.log(xhr.responseText);
                    }else{
                        console.log('ERROR');
                    }
                }
            };

            xhr.open('GET', '/ajaxtest.php');
            xhr.send();
        }
    }

    function colorPick(id) {
		var colors = [
			'#17A4FC',
			'#09E83D',
			'#DEAB04',
			'#0C04DE',
			'#DE0F04',
			'#DE04AB',
			'#A704DE',
			'#04DEC8',
			'#A0DE04',
			'#DE7104'
		];

		return colors[id];
	}

	function textPick(id) {
		var strings = [
			'0 Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			'1 Vivamus semper volutpat dui sed lobortis',
			'2 Pellentesque accumsan porta ipsum eu pretium',
			'3 Nulla at interdum lacus',
			'4 Vivamus eu turpis et risus interdum dignissim feugiat vitae metus',
			'5 Vestibulum vitae pharetra augue',
			'6 Ut congue fermentum neque, vel dapibus nulla viverra vitae',
			'7 Mauris in nisl in ipsum luctus scelerisque',
			'8 Curabitur fermentum nisi vitae ornare venenatis',
			'9 Ut ultrices orci ex, eu rutrum mauris viverra id'
		];

		return strings[id];
	}

	this.animateIn = function(params){
		// console.log('IN');
		// console.log(params);
	};

	this.animateOut = function(params){
		// console.log('OUT');
		// console.log(params);
		// Evt.fireEvent(_elem, Evt.SLIDE_COMPLETE);
	};
});