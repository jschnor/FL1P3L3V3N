Class(function AboutCultureContent(maxwidth, padding){
    Inherit(this, View);

    var _self = this, _elem, _data, _headline, _column1, _column2, _subhead, _content, _subhead2, _content2;

    (function () {
		_init();
        _addColumn1();
        _addColumn2();
    })();

    function _init(){
        console.log("AboutCultureContent _init");
    	_elem = _self.element;
    	_elem.size(maxwidth, "auto").css({
            left: padding,
            bottom: 0
        });

        _data = Data.ABOUT.getData();
        _data = _data[0];
        //console.log(_data);
    }

    function _addColumn1(){
        _column1 = _elem.create(".column1");
        var bottom = 74;
        if (Stage.height < 700){
            bottom = Stage.height * 0.106;
        }
        _column1.size(maxwidth/2, "auto").css({
            bottom: bottom
        });

        var subheadfont = 20;
        var contentfont = 14;
        var hfontsize = 60;
        if (Stage.height < 700){
            hfontsize = Stage.height*0.085;
            subheadfont = Stage.height * 0.028;
            contentfont = Stage.height * 0.02;
        }

        if (Device.mobile.phone){
            if (subheadfont < 11){
                subheadfont = 11;
            }
            if (contentfont < 8){
                contentfont = 8;
            }
        }else{

            if (subheadfont < 15){
                subheadfont = 15;
            }

            if (contentfont < 12){
                contentfont = 12;
            }
        }

        _headline = _column1.create(".headline");
        _headline.fontStyle("LeagueGothic", hfontsize, Config.COLORS.white);
        _headline.size("100%", "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            position: "static"
        });

        _headline.text(_data.headline.toUpperCase());

        _subhead = _column1.create(".subhead");
        _subhead.fontStyle("OpenSansLight", subheadfont, Config.COLORS.white);
        _subhead.size("100%", "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            position: "static"
        });

        _subhead.text(_data.subhead);

        _content = _column1.create(".content");
        _content.fontStyle("OpenSansLight", contentfont, Config.COLORS.white);
        _content.size("100%", "auto").css({
            position: "static"
        });

        _content.text(_data.content);
    }

    function _addColumn2(){
        _column2 = _elem.create(".column2");
        var bottom = 260;
        if (Stage.height < 700){
            bottom = Stage.height * 0.371;
        }
        _column2.size(maxwidth/2, "auto").css({
            bottom: bottom,
            left: (maxwidth/2) + padding
        });

        var subheadfont = 20;
        var contentfont = 14;
        if (Stage.height < 700){
            subheadfont = Stage.height * 0.028;
            contentfont = Stage.height * 0.02;
        }

        if (Device.mobile.phone){
            if (subheadfont < 11){
                subheadfont = 11;
            }
            if (contentfont < 8){
                contentfont = 8;
            }
        }else{

            if (subheadfont < 15){
                subheadfont = 15;
            }

            if (contentfont < 12){
                contentfont = 12;
            }
        }

        _subhead2 = _column2.create(".subhead");
        _subhead2.fontStyle("OpenSansLight", subheadfont, Config.COLORS.white);
        _subhead2.size("100%", "auto").transform({
            skewX: (Mobile.os == "Android" && Mobile.browser == "Browser") ? 0 : -Config.SKEW // unskew
        }).css({
            position: "static"
        });

        _subhead2.text(_data.subhead_2);

        _content2 = _column2.create(".content");
        _content2.fontStyle("OpenSansLight", contentfont, Config.COLORS.white);
        _content2.size("100%", "auto").css({
            position: "static"
        });

        _content2.text(_data.content_2);
    }

    // scale height only at first - once Stage.height reaches ??? , scale by width also
    this.resize = function(maxwidth_resize, padding_resize) {
        _elem.size(maxwidth_resize, Stage.height);

        /*if (Stage.height < 700){
            _headline.size(maxwidth_resize, "auto").css({
                fontSize: Stage.height*0.085,
                bottom: Stage.height*0.614
            });
        }else{
            _headline.size(maxwidth_resize, "auto").css({
                fontSize: 60,
                bottom: 430
            });
        }*/
        var col1_bottom = 74;
        var col2_bottom = 260;
        if (Stage.height < 700){
            col1_bottom = Stage.height * 0.106;
            col2_bottom = Stage.height * 0.371;
        }

        _column1.size(maxwidth_resize/2, "auto").css({
            bottom: col1_bottom
        });
        _column2.size(maxwidth_resize/2, "auto").css({
            left: (maxwidth_resize/2) + padding_resize,
            bottom: col2_bottom
        });

        var hfontsize = 60;
        var subheadfont = 20;
        var contentfont = 14;
        if (Stage.height < 700){
            hfontsize = Stage.height*0.085;
            subheadfont = Stage.height * 0.028;
            contentfont = Stage.height * 0.02;
        }

        if (Device.mobile.phone){
            if (subheadfont < 11){
                subheadfont = 11;
            }
            if (contentfont < 8){
                contentfont = 8;
            }
        }else{

            if (subheadfont < 15){
                subheadfont = 15;
            }

            if (contentfont < 12){
                contentfont = 12;
            }
        }

        _headline.css({
            fontSize: hfontsize
        });

        _subhead.css({
            fontSize: subheadfont
        });
        _subhead2.css({
            fontSize: subheadfont
        });
        _content.css({
            fontSize: contentfont
        });
        _content2.css({
            fontSize: contentfont
        });

    };
});