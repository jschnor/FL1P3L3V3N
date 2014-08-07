Class(function SocialNav(location) {
    Inherit(this, View);
    
    var _self = this, _elem, _vimeo, _facebook, _twitter, _instagram;
    var d, q, o, p;
    var f, e, m;
    var _icons = [];

    this.height = 38;
    this.heightspace = 113;
    
    (function() {
        _init();
        _addIcons();
        _initResize();
    })();

    function _init() {
        _elem = _self.element;
        _elem.size(Global.SIDEBAR.width, _self.height);

        _setPosition();
    }

    function _addIcons(){
        _vimeo = _elem.create(".vimeo");
        _vimeo.text('<span class="icon-vimeo" style="top: 4px; left: -1px;"></span>');
        _vimeo.interact(function(event){
            _iconHover(event);
        }, function(){
            getURL("https://vimeo.com/user27296234");
        });

        _facebook = _elem.create(".facebook");
        _facebook.text('<span class="icon-facebook" style="top: 8px; left: 5px;"></span>');
        _facebook.interact(function(event){
            _iconHover(event);
        }, function(){
            getURL("https://www.facebook.com/2CMediaTV");
        });

        _twitter = _elem.create(".twitter");
        _twitter.text('<span class="icon-twitter" style="top: 4px; left: -1px;"></span>');
        _twitter.interact(function(event){
            _iconHover(event);
        }, function(){
            getURL("https://twitter.com/2cmediaTV");
        });

        _instagram = _elem.create(".instagram");
        _instagram.text('<span class="icon-instagram" style="top: 3px; left: -1px;"></span>');
        _instagram.interact(function(event){
            _iconHover(event);
        }, function(){
            getURL("http://instagram.com/2CTV_creative");
        });

        _icons.push(_vimeo, _facebook, _twitter, _instagram);

        var iconsize = 28;
        var iconspacing = iconsize*0.75;
        var setwidth = (iconsize*_icons.length)+(iconspacing*(_icons.length - 1));
        var leftmargin = (Global.SIDEBAR.width - setwidth)/2;

        for (var i in _icons){
            _icons[i].div.target = "_blank";

            if (location == "contact"){
                _icons[i].bg(Config.COLORS.branding).css({
                    color: Config.COLORS.red
                });
            }else{
                _icons[i].bg(Config.COLORS.red).css({
                    color: Config.COLORS.branding
                });
            }

            _icons[i].size(iconsize, iconsize).css({
                fontSize: iconsize*0.75,
                bottom: 0,
                left: leftmargin + ((iconsize+iconspacing)*i),
                overflow: "hidden"
            });
        }
    }

    function _iconHover(event){
        if (location == "sidebar"){
            switch (event.action){
                case "over":
                event.object.tween({
                    background: "#9d1e00"
                }, 200, "easeOutSine");
                break;

                case "out":
                event.object.tween({
                    background: Config.COLORS.red
                }, 200, "easeOutSine");
                break;
            }
        }
    }

    function _initResize(){
        _self.events.subscribe(FlipEvents.RESIZE, _onResize);
    }

    function _setPosition(){
        var small = (Device.mobile.phone || Stage.height < 600);
        var display = "block";

        switch (location){
            case "contact":
            if (Stage.height >= 320 && !Device.mobile.phone){
                display = "none";
            }
            break;

            case "sidebar":
            default:
            if (Stage.height < 320 || Device.mobile.phone){
                display = "none";
            }

            if (small){
                _self.heightspace = 65;
            }else{
                _self.heightspace = 113;
            }

            bottom = (_self.heightspace - _self.height)/2;
            break;
        }

        _elem.css({
            display: display,
            bottom: bottom
        });
    }

    function _onResize(){
        _setPosition();
    }
});