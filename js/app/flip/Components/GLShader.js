Class(function GLShader(A, r, c, f, t) {
    Inherit(this, Component);
    var q = this;
    var m, h, u, g, n;
    var x, s, b;
    this.rows = 1;
    this.cols = 1;
    this.uniforms = {};
    (function () {
        if (!Device.graphics.webgl) {
            q.div = A.div;
            q.object = A.object;
            return
        }
        v();
        z();
        k();
        o()
    })();

    function v() {
        if (typeof r !== "number") {
            f = r;
            t = c;
            r = A.width;
            c = A.height
        }
    }
    function z() {
        var F = f;
        var C = t;
        var D, E, B;
        if (F) {
            if (!F.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            D = F.split("void main() {");
            E = D[0];
            B = D[1].slice(0, -1)
        }
        f = ["precision mediump float;", "attribute vec2 a_position;", "uniform vec2 u_resolution;", "attribute vec2 a_texCoord;", "varying vec2 v_texCoord;", "vec4 position;", E || "", "vec2 _position(vec2 pos) {", "vec2 zeroToOne = pos / u_resolution;", "vec2 zeroToTwo = zeroToOne * 2.0;", "vec2 clipSpace = zeroToTwo - 1.0;", "return clipSpace * vec2(1, -1);", "}", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "position = vec4(_position(a_position), 0, 1);", "v_texCoord = a_texCoord;", B || "", (B && B.strpos("gl_Position") ? "" : "gl_Position = position;"), "}", ].join("");
        if (C) {
            if (!C.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            D = C.split("void main() {");
            E = D[0];
            B = D[1].slice(0, -1)
        }
        t = ["precision mediump float;", "varying vec2 v_texCoord;", "uniform sampler2D u_texture;", "uniform vec2 u_resolution;", "vec4 texel;", E || "", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "texel = texture2D(u_texture, v_texCoord);", B || "", (B && B.strpos("gl_FragColor") ? "" : "gl_FragColor = texel;"), "}", ].join("")
    }
    function k() {
        m = document.createElement("canvas");
        m.width = q.width = r || 500;
        m.height = q.height = c || 500;
        try {
            h = m.getContext("experimental-webgl")
        } catch (B) {
            h = m.getContext("webgl")
        }
        q.div = m;
        q.object = $(m);
        q.object.mouseEnabled(false)
    }
    function d(I) {
        var O = A.width;
        var H = A.height;
        var D = q.rows;
        var P = q.cols;
        var N = 0;
        var L = 0;
        var C = O / D;
        var F = H / P;
        var Q = [];
        var K = D * P;
        var E, M, B, J;
        for (var G = 0; G < K; G++) {
            E = N;
            B = N + C;
            M = L;
            J = L + F;
            Q.push(E);
            Q.push(M);
            Q.push(B);
            Q.push(M);
            Q.push(E);
            Q.push(J);
            Q.push(E);
            Q.push(J);
            Q.push(B);
            Q.push(M);
            Q.push(B);
            Q.push(J);
            N += C;
            if (N > O - 1) {
                N = 0;
                L += F
            }
        }
        N = q.width / 2 - O / 2;
        L = q.height / 2 - H / 2;
        for (G = 0; G < Q.length; G++) {
            if (G % 2 == 0) {
                if (I) {
                    Q[G] /= O
                } else {
                    Q[G] += N
                }
            } else {
                if (I) {
                    Q[G] /= H
                } else {
                    Q[G] += L
                }
            }
        }
        return new Float32Array(Q)
    }
    function j() {
        if (!q.uniforms) {
            q.uniforms = {}
        }
        for (var B in q.uniforms) {
            var D = q.uniforms[B];
            var C = h.getUniformLocation(u, B);
            if (typeof D === "number") {
                h.uniform1f(C, D)
            } else {
                if (D instanceof Vector2) {
                    h.uniform2f(C, D.x, D.y)
                } else {
                    if (D instanceof Vector3) {
                        h.uniform4f(C, D.x, D.y, D.z, D.w)
                    } else {
                        if (D instanceof Color) {
                            h.uniform3f(C, D.r, D.g, D.b)
                        }
                    }
                }
            }
        }
    }
    function l() {
        u = w();
        h.useProgram(u);
        h.clearColor(0, 0, 0, 0);
        g = d();
        n = d(true)
    }
    function i() {
        var D = h.getAttribLocation(u, "a_position");
        var B = h.getAttribLocation(u, "a_texCoord");
        if (!b) {
            b = h.createBuffer()
        }
        h.bindBuffer(h.ARRAY_BUFFER, b);
        h.bufferData(h.ARRAY_BUFFER, n, h.STATIC_DRAW);
        h.enableVertexAttribArray(B);
        h.vertexAttribPointer(B, 2, h.FLOAT, false, 0, 0);
        if (!x) {
            x = h.createTexture()
        }
        h.bindTexture(h.TEXTURE_2D, x);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.NEAREST);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
        h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, h.RGBA, h.UNSIGNED_BYTE, A.div);
        var C = h.getUniformLocation(u, "u_resolution");
        h.uniform2f(C, q.width, q.height);
        if (!s) {
            s = h.createBuffer();
            q.buffer = s
        }
        h.bindBuffer(h.ARRAY_BUFFER, s);
        h.enableVertexAttribArray(D);
        h.vertexAttribPointer(D, 2, h.FLOAT, false, 0, 0);
        h.bufferData(h.ARRAY_BUFFER, g, h.STATIC_DRAW);
        h.enableVertexAttribArray(D);
        h.drawArrays(h.TRIANGLES, 0, g.length / 2)
    }
    function p(D, B) {
        var C = h.createShader(B);
        h.shaderSource(C, D);
        h.compileShader(C);
        if (!h.getShaderParameter(C, h.COMPILE_STATUS)) {
            throw h.getShaderInfoLog(C)
        }
        return C
    }
    function w() {
        var B = h.createProgram();
        var D = p(f, h.VERTEX_SHADER);
        var C = p(t, h.FRAGMENT_SHADER);
        h.attachShader(B, D);
        h.attachShader(B, C);
        h.linkProgram(B);
        if (!h.getProgramParameter(B, h.LINK_STATUS)) {
            throw h.getProgramInfoLog(B)
        }
        return B
    }
    function o() {
        m.addEventListener("webglcontextlost", a);
        m.addEventListener("webglcontextrestored", e)
    }
    function e() {
        try {
            h = m.getContext("experimental-webgl", {
                antialias: true
            })
        } catch (B) {
            h = m.getContext("webgl")
        }
    }
    function a() {
        h = u = x = s = b = null
    }
    this.render = function () {
        if (!Device.graphics.webgl) {
            return false
        }
        if (!u) {
            l()
        }
        h.clear(h.COLOR_BUFFER_BIT | h.DEPTH_BUFFER_BIT);
        j();
        i()
    };
    this.destroy = function () {
        if (this.object) {
            this.object.remove()
        }
        m = h = u = x = s = b = null;
        return this._destroy()
    };
    this.startRender = function () {
        Render.startRender(q.render)
    };
    this.stopRender = function () {
        Render.stopRender(q.render)
    }
});