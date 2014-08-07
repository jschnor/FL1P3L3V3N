Class(function Matrix4() {
    var d = this;
    var b = Matrix4.prototype;
    this.type = "matrix4";
    this.data = new Float32Array(16);
    (function () {
        a()
    })();

    function a(e) {
        var f = e || d.data;
        f[0] = 1, f[4] = 0, f[8] = 0, f[12] = 0;
        f[1] = 0, f[5] = 1, f[9] = 0, f[13] = 0;
        f[2] = 0, f[6] = 0, f[10] = 1, f[14] = 0;
        f[3] = 0, f[7] = 0, f[11] = 0, f[15] = 1
    }
    function c(e) {
        e = Math.abs(e) < 0.000001 ? 0 : e;
        return e
    }
    b.identity = function (e) {
        a(e);
        return this
    };
    b.transformVector = function (g, h) {
        var j = this.data;
        var e = g.x,
            k = g.y,
            i = g.z,
            f = g.w;
        h = h || g;
        h.x = j[0] * e + j[4] * k + j[8] * i + j[12] * f;
        h.y = j[1] * e + j[5] * k + j[9] * i + j[13] * f;
        h.z = j[2] * e + j[6] * k + j[10] * i + j[14] * f;
        return h
    };
    b.multiply = function (M, N) {
        var P = this.data;
        var O = M.data || M;
        var L, K, J, I, H, G, F, E, D, C, q, p, o, n, l, k;
        var B, A, z, x, w, v, u, t, s, r, j, i, h, g, f, e;
        L = P[0], K = P[1], J = P[2], I = P[3];
        H = P[4], G = P[5], F = P[6], E = P[7];
        D = P[8], C = P[9], q = P[10], p = P[11];
        o = P[12], n = P[13], l = P[14], k = P[15];
        B = O[0], A = O[1], z = O[2], x = O[3];
        w = O[4], v = O[5], u = O[6], t = O[7];
        s = O[8], r = O[9], j = O[10], i = O[11];
        h = O[12], g = O[13], f = O[14], e = O[15];
        P[0] = L * B + H * A + D * z + o * x;
        P[1] = K * B + G * A + C * z + n * x;
        P[2] = J * B + F * A + q * z + l * x;
        P[3] = I * B + E * A + p * z + k * x;
        P[4] = L * w + H * v + D * u + o * t;
        P[5] = K * w + G * v + C * u + n * t;
        P[6] = J * w + F * v + q * u + l * t;
        P[7] = I * w + E * v + p * u + k * t;
        P[8] = L * s + H * r + D * j + o * i;
        P[9] = K * s + G * r + C * j + n * i;
        P[10] = J * s + F * r + q * j + l * i;
        P[11] = I * s + E * r + p * j + k * i;
        P[12] = L * h + H * g + D * f + o * e;
        P[13] = K * h + G * g + C * f + n * e;
        P[14] = J * h + F * g + q * f + l * e;
        P[15] = I * h + E * g + p * f + k * e;
        return this
    };
    b.setTRS = function (o, n, l, g, f, e, v, u, t, k) {
        k = k || this;
        var r = k.data;
        this.identity(k);
        var j = Math.sin(g);
        var s = Math.cos(g);
        var i = Math.sin(f);
        var q = Math.cos(f);
        var h = Math.sin(e);
        var p = Math.cos(e);
        r[0] = (q * p + i * j * h) * v;
        r[1] = (-q * h + i * j * p) * v;
        r[2] = i * s * v;
        r[4] = h * s * u;
        r[5] = p * s * u;
        r[6] = -j * u;
        r[8] = (-i * p + q * j * h) * t;
        r[9] = (h * i + q * j * p) * t;
        r[10] = q * s * t;
        r[12] = o;
        r[13] = n;
        r[14] = l;
        return k
    };
    b.setScale = function (i, h, f, e) {
        e = e || this;
        var g = e.data || e;
        this.identity(e);
        g[0] = i, g[5] = h, g[10] = f;
        return e
    };
    b.setTranslation = function (g, f, i, e) {
        e = e || this;
        var h = e.data || e;
        this.identity(e);
        h[12] = g, h[13] = f, h[14] = i;
        return e
    };
    b.setRotation = function (g, f, e, i) {
        i = i || this;
        var l = i.data || i;
        this.identity(i);
        var p = Math.sin(g);
        var k = Math.cos(g);
        var o = Math.sin(f);
        var j = Math.cos(f);
        var n = Math.sin(e);
        var h = Math.cos(e);
        l[0] = j * h + o * p * n;
        l[1] = -j * n + o * p * h;
        l[2] = o * k;
        l[4] = n * k;
        l[5] = h * k;
        l[6] = -p;
        l[8] = -o * h + j * p * n;
        l[9] = n * o + j * p * h;
        l[10] = j * k;
        return i
    };
    b.translate = function (f, e, g) {
        this.setTranslation(f, e, g, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.rotate = function (g, f, e) {
        this.setRotation(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.scale = function (g, f, e) {
        this.setScale(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    };
    b.copyTo = function (f) {
        var g = this.data;
        var e = f.data || f;
        for (var h = 0; h < 16; h++) {
            e[h] = g[h]
        }
        return f
    };
    b.copyRotationTo = function (f) {
        var g = this.data;
        var e = f.data || f;
        e[0] = g[0];
        e[1] = g[1];
        e[2] = g[2];
        e[3] = g[4];
        e[4] = g[5];
        e[5] = g[6];
        e[6] = g[8];
        e[7] = g[9];
        e[8] = g[10];
        return f
    };
    b.copyPosition = function (e) {
        var g = this.data;
        var f = e.data || e;
        g[12] = f[12];
        g[13] = f[13];
        g[14] = f[14];
        return this
    };
    b.getCSS = function () {
        var e = this.data;
        return "matrix3d(" + c(e[0]) + "," + c(e[1]) + "," + c(e[2]) + "," + c(e[3]) + "," + c(e[4]) + "," + c(e[5]) + "," + c(e[6]) + "," + c(e[7]) + "," + c(e[8]) + "," + c(e[9]) + "," + c(e[10]) + "," + c(e[11]) + "," + c(e[12]) + "," + c(e[13]) + "," + c(e[14]) + "," + c(e[15]) + ")"
    };
    b.extractPosition = function (e) {
        e = e || new Vector3();
        var f = this.data;
        e.set(f[12], f[13], f[14]);
        return e
    };
    b.determinant = function () {
        var e = this.data;
        return e[0] * (e[5] * e[10] - e[9] * e[6]) + e[4] * (e[9] * e[2] - e[1] * e[10]) + e[8] * (e[1] * e[6] - e[5] * e[2])
    };
    b.inverse = function (h) {
        var o = this.data;
        var q = (h) ? h.data || h : this.data;
        var l = this.determinant();
        if (Math.abs(l) < 0.0001) {
            console.warn("Attempt to inverse a singular Matrix4. ", this.data);
            console.trace();
            return h
        }
        var g = o[0],
            u = o[4],
            r = o[8],
            k = o[12],
            f = o[1],
            t = o[5],
            p = o[9],
            j = o[13],
            e = o[2],
            s = o[6],
            n = o[10],
            i = o[14];
        l = 1 / l;
        q[0] = (t * n - p * s) * l;
        q[1] = (r * s - u * n) * l;
        q[2] = (u * p - r * t) * l;
        q[4] = (p * e - f * n) * l;
        q[5] = (g * n - r * e) * l;
        q[6] = (r * f - g * p) * l;
        q[8] = (f * s - t * e) * l;
        q[9] = (u * e - g * s) * l;
        q[10] = (g * t - u * f) * l;
        q[12] = -(k * q[0] + j * q[4] + i * q[8]);
        q[13] = -(k * q[1] + j * q[5] + i * q[9]);
        q[14] = -(k * q[2] + j * q[6] + i * q[10]);
        return h
    };
    b.transpose = function (h) {
        var j = this.data;
        var l = h ? h.data || h : this.data;
        var g = j[0],
            q = j[4],
            n = j[8],
            f = j[1],
            p = j[5],
            k = j[9],
            e = j[2],
            o = j[6],
            i = j[10];
        l[0] = g;
        l[1] = q;
        l[2] = n;
        l[4] = f;
        l[5] = p;
        l[6] = k;
        l[8] = e;
        l[9] = o;
        l[10] = i
    };
    b.lookAt = function (g, f) {
        var i = this.data;
        var e = D3.m4v31;
        var j = D3.m4v32;
        var h = D3.m4v33;
        h.set(i[12], i[13], i[14]);
        h.sub(h, g).normalize();
        if (h.lengthSq() === 0) {
            h.z = 1
        }
        e.cross(f, h).normalize();
        if (e.lengthSq() === 0) {
            h.x += 0.0001;
            e.cross(f, h).normalize()
        }
        j.cross(h, e);
        i[0] = e.x, i[4] = j.x, i[8] = h.x;
        i[1] = e.y, i[5] = j.y, i[9] = h.y;
        i[2] = e.z, i[6] = j.z, i[10] = h.z;
        return this
    }
});

Matrix4.__TEMP__ = new Matrix4().data;