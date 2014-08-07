Class(function VideoOverlay(workIndex) {
    Inherit(this, View);

    var _self = this, _elem, _videoContainer, _closeButton, _data, url, _mouseCheck, _fadeInBuffer;
    
    (function(){
        // console.log('VideoOverlay :: workIndex: '+workIndex);
        _markup();
        _vimeoAPI();    
        _addCloseIcon();
        // Render.startRender(_mouseCheck);
        // Render.nextFrame(_doSomething);

    })();

    function _markup() {

        _elem = _self.element;
        _elem.size("100%").css({
            opacity: 0
        }).setZ(99999);

        // DATA SWITCHER
        switch (Data.STATE.page) {
            case 'home':
                _data = Data.HOME;
            break;
            case 'work':
                _data = Data.WORK;
            break;
            case 'reels':
                _data = Data.REELS;
            break;
            case 'content':
                _data = Data.CONTENT;
            break;
        }

        // var embed_code = _data.getData()[workIndex].video_link;
        var embed_code = _data.getWorkByNum(workIndex).video_link;
        var _autoplay = embed_code.match(/src="\/\/player\.vimeo\.com\/video\/[\d\w\.]*/)[0]+'?autoplay=1&api=1&player_id=iframe" id="iframe"';
        console.log(embed_code);
        embed_code = embed_code.replace(/width="[\d\w%]*"/, 'width="100%"');
        embed_code = embed_code.replace(/height="[\d\w%]*"/, 'height="100%"');
        embed_code = embed_code.replace(/src="\/\/player\.vimeo\.com\/video\/[\d\w\.]*/, _autoplay);
        url = 'http:'+embed_code.match(/\/\/player\.vimeo\.com\/video\/[\d\w\.]*/);
        // embed_code = embed_code.replace(/src="//player.vimeo.com/video/[\d\w\.]*"/, )


        console.log(_autoplay);
        // console.log(_autoplay[0]+'?autoplay=1');

        _videoContainer = _elem.create(".fullvideo");
        _videoContainer.size("100%");
        // _positionVideo();
        // _self.events.subscribe(FEEvents.RESIZE, _positionVideo);
        
        _videoContainer.text(embed_code);
        // console.log(_videoContainer.children()[0]);

        // console.log(_videoContainer.children()[0]);
        // _videoContainer.children();

        // console.log(_videoContainer.children());
        // console.log('VIDEO OVERLAY :: find: '+_videoContainer.find("#iframe"));
        //console.log(_data.getData()[workIndex]); // works
    }

    function _vimeoAPI() {

        if (window.addEventListener){
            window.addEventListener('message', onMessageReceived, false);
        }
        else {
            window.attachEvent('onmessage', onMessageReceived, false);
        }
    }

    // Handle messages received from the player
    function onMessageReceived(e) {
        var data = JSON.parse(e.data);

        switch (data.event) {
            case 'ready':
                _onReady();
                break;
               
            case 'playProgress':
                // _onPlayProgress(data.data);

                break;
                
            case 'pause':
                // _onPause();
                break;
               
            case 'finish':
                _onFinish();
                break;
        }
    }

    function post(action, value) {
        var data = { method: action };
        
        if (value) {
            data.value = value;
        }
        
        // post the message from iframe 
        _videoContainer.children()[0].contentWindow.postMessage(JSON.stringify(data), url);
        
    }


    function _onReady() {
        // console.log('ready');
        _elem.stopTween().css({
            opacity: 0
        }).tween({
            opacity: 1
        }, 500, "easeOutQuart");
        
        // Global._mousevideo = setTimeout(function(){
        _fadeInBuffer = false;
        _onMouseCheck();
        // _mouseCheck = setInterval(_onMouseCheck, 250);
        // Stage.bind("mousemove", _onMouseCheck);

        // }, 500);
        // cannot initialize other events until vimeo is ready
        post('addEventListener', 'pause');
        post('addEventListener', 'finish');
        post('addEventListener', 'playProgress');

    }
    function _onMouseCheck() {

        console.log(Mouse.x);
        // Mouse.mousemove
        // $(function () {

            // var timer;
            // console.log(Mouse.capture())
            
            // if (Mouse.capture()) {
            // $(document).mousemove(function () {
            //     if (!_fadeInBuffer) {
            //         if (_mouseCheck) {
            //             clearTimeout(_mouseCheck);
            //             _mouseCheck = 0;
            //         }
                    
            //         // FADE IN
            //         _closeButton.animateIn();

            //     } else {
            //         _fadeInBuffer = false;
            //     }

            //     _mouseCheck = setTimeout(function () {
            //         // FADE OUT
            //         _closeButton.animateOut();

            //         _fadeInBuffer = true;
            //     }, 5000)
            // }
            // });

        // });

    }
    function _doSomething() {
        console.log(Mouse.x);
    }

    function _onPause() {
        console.log('paused');
    }

    function _onFinish() {
        console.log('complete');

        // clearInterval(_mouseCheck);
        
        _elem.stopTween().css({
            opacity: 1
        }).tween({
            opacity: 0
        }, 500, "easeOutQuart");

        _closeButton.onComplete();
        _self.destroy();
    }

    function _onPlayProgress(data) {
        // console.log(data.seconds + 's played');
        // if (data.seconds) {

        // }
    }

    // END VIMEO VIDEO API STUFF


    function _addCloseIcon(){
        _closeButton = _self.initClass(VideoOverlayClose);

        _self.delayedCall(function(){
            _closeButton.animateIn();
        }, 1500);
    }

    this.animateIn = function(){

        // _elem.stopTween().css({
        //     opacity: 0
        // }).tween({
        //     opacity: 1
        // }, 500, "easeOutQuart");
    
    };

    this.animateOut = function(){
        _elem.stopTween().css({
            opacity: 1
        }).tween({
            opacity: 0
        }, 500, "easeOutQuart");
        
        _self.delayedCall(function() {
            _self.destroy();
        }, 500)
    };
    this.destroy = function() {
        // Render.stopRender(_mouseCheck);
        _self._destroy();
    }
});