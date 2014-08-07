Class(function Matrix2() {
    var o = this;
    var k = Matrix2.prototype;
    var g, f, e, n, m, l, u, t, s;
    var r, q, p, d, c, a, j, i, h;
    this.type = "matrix2";
    this.data = new Float32Array(9);
    (function () {
        v()
    })();

    function v(w) {
        w = w || o.data;
        w[0] = 1, w[1] = 0, w[2] = 0;
        w[3] = 0, w[4] = 1, w[5] = 0;
        w[6] = 0, w[7] = 0, w[8] = 1
    }
    function b(w) {
        w = Math.abs(w) < 0.000001 ? 0 : w;
        return w
    }
    k.identity = function (w) {
        v(w);
        return this
    };
    k.transformVector = function (z) {
        var A = this.data;
        var w = z.x;
        var B = z.y;
        z.x = A[0] * w + A[1] * B + A[2];
        z.y = A[3] * w + A[4] * B + A[5];
        return z
    };
    k.setTranslation = function (z, x, w) {
        var A = w || this.data;
        A[0] = 1, A[1] = 0, A[2] = z;
        A[3] = 0, A[4] = 1, A[5] = x;
        A[6] = 0, A[7] = 0, A[8] = 1;
        return this
    };
    k.getTranslation = function (w) {
        var x = this.data;
        w = w || new Vector2();
        w.x = x[2];
        w.y = x[5];
        return w
    };
    k.setScale = function (A, z, w) {
        var x = w || this.data;
        x[0] = A, x[1] = 0, x[2] = 0;
        x[3] = 0, x[4] = z, x[5] = 0;
        x[6] = 0, x[7] = 0, x[8] = 1;
        return this
    };
    k.setShear = function (A, z, w) {
        var x = w || this.data;
        x[0] = 1, x[1] = A, x[2] = 0;
        x[3] = z, x[4] = 1, x[5] = 0;
        x[6] = 0, x[7] = 0, x[8] = 1;
        return this
    };
    k.setRotation = function (x, w) {
        var B = w || this.data;
        var A = Math.cos(x);
        var z = Math.sin(x);
        B[0] = A, B[1] = -z, B[2] = 0;
        B[3] = z, B[4] = A, B[5] = 0;
        B[6] = 0, B[7] = 0, B[8] = 1;
        return this
    };
    k.setTRS = function (z, w, x, E, D) {
        var C = this.data;
        var B = Math.cos(x);
        var A = Math.sin(x);
        C[0] = B * E, C[1] = -A * D, C[2] = z;
        C[3] = A * E, C[4] = B * D, C[5] = w;
        C[6] = 0, C[7] = 0, C[8] = 1;
        return this
    };
    k.translate = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.rotate = function (w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.scale = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setScale(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.shear = function (x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setRotation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    };
    k.multiply = function (x) {
        var z = this.data;
        var w = x.data || x;
        g = z[0], f = z[1], e = z[2];
        n = z[3], m = z[4], l = z[5];
        u = z[6], t = z[7], s = z[8];
        r = w[0], q = w[1], p = w[2];
        d = w[3], c = w[4], a = w[5];
        j = w[6], i = w[7], h = w[8];
        z[0] = g * r + f * d + e * j;
        z[1] = g * q + f * c + e * i;
        z[2] = g * p + f * a + e * h;
        z[3] = n * r + m * d + l * j;
        z[4] = n * q + m * c + l * i;
        z[5] = n * p + m * a + l * h;
        return this
    };
    k.copyTo = function (x) {
        var z = this.data;
        var w = x.data || x;
        w[0] = z[0], w[1] = z[1], w[2] = z[2];
        w[3] = z[3], w[4] = z[4], w[5] = z[5];
        w[6] = z[6], w[7] = z[7], w[8] = z[8];
        return x
    };
    k.copyFrom = function (x) {
        var z = this.data;
        var w = x.data || x;
        w[0] = z[0], w[1] = z[1], w[2] = z[2];
        w[3] = z[3], w[4] = z[4], w[5] = z[5];
        w[6] = z[6], w[7] = z[7], w[8] = z[8];
        return this
    };
    k.getCSS = function () {
        var w = this.data;
        if (Device.tween.css3d) {
            return "matrix3d(" + b(w[0]) + ", " + b(w[3]) + ", 0, 0, " + b(w[1]) + ", " + b(w[4]) + ", 0, 0, 0, 0, 1, 0, " + b(w[2]) + ", " + b(w[5]) + ", 0, 1)"
        } else {
            return "matrix(" + b(w[0]) + ", " + b(w[3]) + ", " + b(w[1]) + ", " + b(w[4]) + ", " + b(w[2]) + ", " + b(w[5]) + ")"
        }
    }
    // console.log('MATRIX 2')
});

Matrix2.__TEMP__ = new Matrix2().data;