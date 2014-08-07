Class(function D3() {
    // console.log('NEGATIVE D3')
    // console.log(':: STATIC – D3 3D stuff')
    Namespace("D3", this);
    this.CSS3D = Device.tween.css3d;
    this.m4v31 = new Vector3();
    this.m4v32 = new Vector3();
    this.m4v33 = new Vector3();
    this.UP = new Vector3(0, 1, 0);
    this.FWD = new Vector3(0, 0, -1);
    this.translate = function (a, c, b) {
        a = typeof a == "string" ? a : (a || 0) + "px";
        c = typeof c == "string" ? c : (c || 0) + "px";
        b = typeof b == "string" ? b : (b || 0) + "px";
        return "translate3d(" + a + "," + c + "," + b + ")"
    }
}, "Static");