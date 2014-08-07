Class(function HomeFeatured(container, margin) {

    Inherit(this, View);
    
    var _self = this;
    var _team, _gutter, _hdln, _play;
    var _abot, _about, _believe;
    var col1, col2, col3;
    
    var _gutter = 10;
    var _conainer = container;
    var _margin = margin;

    (function () {

        _getHomeMain();
        _getHomeAbout();

        _onResize();
    })();    

    function _getHomeMain() {
        // console.log(Data.HOME.getData());
        var _text = 'A Digital Creative Agency';


        // _cont.center();
        _play = _conainer.create('play');
        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2,
            background: 'red'
        }).transform({
            // y: (Stage.height/2) - 50,
            // x: (Stage.width/2)
        }).setZ(50);

        _hdln = _conainer.create('headline');
        // _hdln.fontStyle("GeomSlab703-ExtraBoldCondensed", 48, Config.COLORS.white);
        _hdln.fontStyle("GeomSlab703-ExtraBold", 48, Config.COLORS.white);
        _hdln.size(500, 100).css({
            // position: 'relative',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 48,
            paddingTop: 130,
            // height: 'auto'
            // left: -250
            // left: Stage.width - 600,
            // border: '1px solid red'
        }).center().setZ(50);

        _hdln.text(_text);

    }

    function _getHomeAbout() {
        _abot = _conainer.create('about');

        _abot.css({
            // position: 'relative',
            width: '100%',
            height: 2000,
            // left: '-50%',
            top: Stage.height - 100,
            color: Config.COLORS.white,
            // background: Config.COLORS.branding,
            borderTop: '2px solid ' + Config.COLORS.white,
            borderBottom: '2px solid ' + Config.COLORS.white
        });

        _col1 = _abot.create('column1');
        _col2 = _abot.create('column2');
        _col3 = _abot.create('column3');

        _dat_about      = Data.ABOUT.getData();
        _dat_believe    = Data.BELIEVE.getData();
        _dat_team       = Data.TEAM.getData();


        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red',

        });

        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });

        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });


        

        _col1.text(
            '<h3>' + _dat_about[0].header + '</h3>' +
            '<h4>' + _dat_about[0].subheader + '</h4>' +
            _dat_about[0].content
        );

        for (var i = 0; i < _col1.children().length; i++) {
            _col1.children()[i].style.position = 'static';
            _col1.children()[i].style.height = 'auto';
        }


        // console.log(Data.BELIEVE.getData());
        _col2.text(
            '<h3>Things we believe</h3>' +
            _getList()
        );

        for (var k = 0; k < _col2.children().length; k++) {
            _col2.children()[k].style.position = 'static';
            _col2.children()[k].style.height = 'auto';
        }

        _col3.text(
            '<h3>Flip Profile</h3>' +
            '<h4>' + _dat_team[0].name + '</h4>' +
            '<h5>' + _dat_team[0].title + '</h5>' +
            '<h4>Q: </h4><h5>' + _dat_team[0].question + '</h5>' +
            '<h4>A: </h4><h5>' + _dat_team[0].answer + '</h5>'
        );

        for (var l = 0; l < _col3.children().length; l++) {
            _col3.children()[l].style.position = 'static';
            _col3.children()[l].style.height = 'auto';
        }

    }

    function _getList() {
        var _list = '';
        for(var j = 0; j < _dat_believe.length; j++) {

            if (_dat_believe[j].name) {
                _list += '<h5>' + _dat_believe[j].name + '</h5>';
                // console.log(_believe[j].name)
            }
        }
        return _list;
    }

    function _animateIn() {
        /*console.log('========================');
        console.log('_animateIn() FROM WORK LIST');
        console.log('========================');*/

        if (Mobile.os == "Android" || (Mobile.os == "iOS" && FEDevice.PERFORMANCE === 0 && Mobile.tablet)) {
            return;
        }

        // a.y = Stage.height * Transition.instance().direction;
        a.y = Stage.height * Transition.instance().direction;
    }
    function _onResize() {
        _self.events.subscribe(FlipEvents.RESIZE, _resizePage);
    }

    function _resizePage() {

        _resizeMainAndAbout();
    
    }
    
    function _resizeMainAndAbout() {

        _play.size(130, 130).css({
            // position: 'relative',
            top: (Stage.height/2) - 50,
            left: Stage.width/2 - _play.width/2 - _margin/2
        })


        _abot.css({
            top: Stage.height - 100,
        });

        _col1.css({
            left: 0,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });
        _col2.css({
            left: (Stage.width - _margin)/3 + _gutter,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'

        });
        _col3.css({
            left: ((Stage.width - _margin)/3 + _gutter) * 2,
            width: (Stage.width - _margin)/3 - (_gutter*2),
            border: '1px solid red'
        });

    }

    this.animateIn = function () {

        // a.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen");

        // h.tween({
        //     y: 0,
        //     opacity: 1
        // }, 500, "workOpen", 50);

        // i.animateIn()
    }

});
