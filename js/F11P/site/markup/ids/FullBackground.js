function FullBackground() {

    Inherit(this, $id);

    var _self = this,
        _elem,
        _video,
        _image,
        _isUp = false,
        _isDown = false,
        _scrollamount = 100;

    Global.FULLBG = this;


    (function() {
        _init();
        _events();
    })();

    function _init() {
        _elem = _self.element;

        _elem.size('100%').css({
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden'
        });

        // if (!Device.mobile) {
            _self.video = _video = _self.initClass(FullBackgroundVideo);
        // }

        _self.image = _image = _self.initClass(FullBackgroundImage);
    }

    
    function _onResize() {
        var _top = _isUp ? -_scrollamount : 0;
    }
    
    function _events() {

        Evt.resize(_onResize);

        // Evt.subscribe(Global.CONTAINER.element, Evt.NAV_SELECT, _onNavSelect);
        
        if (Device.mobile) {
            Evt.subscribe(_elem, 'touchstart', function(e) {
                e.preventDefault();
            });
            Evt.subscribe(_elem, 'touchmove', function(e) {
                e.preventDefault();
            });
            Evt.subscribe(_elem, 'touchend', function(e) {
                e.preventDefault();
            });
        }

    }

    function _swapBG() {

        if (Config.DEBUG.all || Config.DEBUG.fullbg) {
            // console.log('==========================');
            console.log(Data.STATE.page.toLowerCase());
            console.log(_self.video.div.style.zIndex);

            console.log('==========================');
        }

        if (!Device.mobile) {
            _self.video.element.css({opacity: 0});
        }
        _self.image.element.css({opacity: 0});

        switch (Data.STATE.page.toLowerCase()) {
            case 'home':
            case '/':
                if (!Device.mobile) {
                    if (_self.video.AMBIENT) {
                        _self.video.element.css({opacity: 1});
                    } else {
                        _self.video.element.css({opacity: 0});
                    }
                    _self.video.element.setZ(2);
                }
                
                _self.image.element.setZ(1);
            break;
            case 'work':
                _self.image.element.css({opacity: 1});
                _self.image.element.setZ(2);
                if (!Device.mobile) {
                    _self.video.element.setZ(1);
                }

            break;
            case 'contact':
                _self.image.element.css({opacity: 1});
                _self.image.element.setZ(2);
                if (!Device.mobile) {
                    _self.video.element.setZ(1);
                }

            break;
        }
    }

    this.up = function() {
        _isUp = true;

    };

    this.down = function() {
        _isUp = false;
    };
};
