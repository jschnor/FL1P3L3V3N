Class(function MathUtil() {
    // console.log(':: STATIC - math utility')
    Inherit(this, Component);
    var f = this;
    var minSliceHeight = 80; // minimum slice height
    var minSliceWidth = 200; // minimum slice width
    var d = 8; // some kind of multiplier that alters the slice height
    var mult = 16; // some kind of multiplier that alters the slice width
    (function () {
        a()
    })();

    function a() {
        TweenManager.addCustomEase({
            name: "workLayer",
            curve: "cubic-bezier(.41,.61,.35,1)"
        });
        TweenManager.addCustomEase({
            name: "workOpen",
            curve: "cubic-bezier(.23,1,.38,.98)"
        });
        TweenManager.addCustomEase({
            name: "workOpenIn",
            curve: "cubic-bezier(.55,.61,.38,.98)"
        });
        TweenManager.addCustomEase({
            name: "slice",
            curve: "cubic-bezier(.34,.37,.32,.99)"
        });
        TweenManager.addCustomEase({
            name: "workSlice",
            curve: "cubic-bezier(.19,1,.11,.99)"
        });
        TweenManager.addCustomEase({
            name: "transitionOut",
            curve: "cubic-bezier(.69,.03,.58,.99)"
        });
    }
    
    // decide whether to return calculated slice height or minimum slice height
    function c() {
    	// function b() receives:
    	// a vector representing device width
    	// a vector equaling 0 (height?)
    	// returns vector containing slice width and height
        var h = b(new Vector2(FEDevice.width, 0), new Vector2(0, 0));
        var calcSliceHeight = Math.ceil(Math.abs(h.y * 1.8)); // multiply height for some odd reason otherwise it becomes too small
        return {
            total: calcSliceHeight > minSliceHeight ? calcSliceHeight : minSliceHeight,
            triangle: calcSliceHeight
        };
    }
    
    // decide whether to return calculated slice width or minimum slice width
    function selectSliceWidth(){
		// console.log('selectSliceWidth');
		var sliceDimensions = getVertSliceDimensions(new Vector2(0, 0), new Vector2(0, FEDevice.height));
		var calcSliceWidth = Math.ceil(Math.abs(sliceDimensions.x * 1.8));
		
		//console.log(sliceDimensions);
		
		return {
			total: calcSliceWidth > minSliceWidth ? calcSliceWidth : minSliceWidth,
			triangle: calcSliceWidth
		};
    }
    
    // b() returns vector containing slice width and height
    // h = Vector2
    // g = Vector2
    function b(h, g) {
        var i = new Vector2(-(g.y - h.y), g.x - h.x).multiply(Math.sin(Utils.toRadians(d))); // get height of slice
        var j = new Vector2().copyFrom(h).add(i); // get width of slice from device width
        return j; // return vector containing slice width and height
    }
    
    // get dimensions of a vertically oriented slice (scrolls horizontally)
    // width and height are Vector2
    function getVertSliceDimensions(v_width, v_height){
    	// v_width passed in as 0,0
    	// v_height passed in as 0,device height
		//var sliceWidth = new Vector2(-(v_height.x - v_width.x), v_height.y - v_width.y).multiply(Math.sin(Utils.toRadians(d)));
		var sliceWidth = new Vector2(-(v_width.y - v_height.y), v_width.x - v_height.x).multiply(Math.sin(Utils.toRadians(mult)));
		// console.log(sliceWidth);
		var sliceVectors = new Vector2().copyFrom(v_height).add(sliceWidth);
		return sliceVectors;
    }
    
    this.getSliceHeight = function () {
        var g = c().total;
        //console.log('getSliceHeight');
        //console.log(g);
        if (Stage.height > FEDevice.width) {
            g *= 2;
        }
        return g;
    };
    
    // get the width value of a slice
    this.getSliceWidth = function (){
		var width = selectSliceWidth().total;
		
		//console.log('getSliceWidth');
        //console.log(width);
		
		if (Stage.width > FEDevice.height){
			width *= 2;
		}
		
		return width;
    };
    
    this.computeCentroid = function (i) {
        var g = (i[0].x + i[1].x + i[2].x) / 3;
        var h = (i[0].y + i[1].y + i[2].y) / 3;
        return {
            x: g,
            y: h
        };
    };
}, "Static");