Class(function CSSTween(p, B, E, l, u, s, r) {
    // console.log('CSS TWEEN')
    var A = this;
    var g, t, H, F, G;
    var f, q, d, j, o;
    var v, z, b, n;
    (function () {
        if (p && B) {
            if (typeof E !== "number") {
                throw "CSSTween Requires object, props, time, ease"
            }
            i()
        }
    })();

    function i() {
        if (c()) {
            C();
            if (!r) {
                k()
            }
        } else {
            if (!r) {
                e();
                h();
                a()
            }
        }
    }
    function h() {
        var I = TweenManager.getAllTransforms(p);
        var K = [];
        for (var J in B) {
            if (TweenManager.checkTransform(J)) {
                I.use = true;
                I[J] = B[J];
                delete B[J]
            } else {
                K.push(J)
            }
        }
        if (I.use) {
            K.push(TweenManager.getTransformProperty())
        }
        j = I;
        v = K
    }
    function C() {
        var I = TweenManager.getAllTransforms(p);
        F = TweenManager._dynamicPool.get();
        d = TweenManager._dynamicPool.get();
        q = TweenManager._dynamicPool.get();
        H = TweenManager._dynamicPool.get();
        for (var J in I) {
            q[J] = I[J];
            d[J] = I[J]
        }
        for (J in B) {
            if (TweenManager.checkTransform(J)) {
                z = true;
                q[J] = p[J] || 0;
                d[J] = B[J]
            } else {
                b = true;
                if (typeof B[J] === "string") {
                    p.div.style[J] = B[J]
                } else {
                    H[J] = Number(p.css(J));
                    F[J] = B[J]
                }
            }
        }
    }
    function c() {
        if (B.math) {
            delete B.math;
            return g = true
        }
        if (!Device.tween.transition) {
            return g = true
        }
        if (l.strpos("Elastic") || l.strpos("Bounce")) {
            return g = true
        }
        return g = false
    }
    function k() {
        p._cssTween = A;
        A.playing = true;
        B = H.copy();
        j = q.copy();
        if (b) {
            t = TweenManager.tween(B, F, E, l, u, w, x)
        }
        if (z) {
            o = TweenManager.tween(j, d, E, l, u, (!b ? w : null), (!b ? x : null))
        }
    }
    function a() {
        if (!A.kill && p.div && v) {
            p._cssTween = A;
            p.div._transition = true;
            var K = "";
            var I = v.length;
            for (var J = 0; J < I; J++) {
                K += (K.length ? ", " : "") + v[J] + " " + E + "ms " + TweenManager.getEase(l) + " " + u + "ms"
            }
            Render.setupTween(function () {
                if (A.kill || !p || !p.div) {
                    return false
                }
                p.div.style[Device.styles.vendorTransition] = K;
                p.css(B);
                p.transform(j);
                A.playing = true;
                p.div.addEventListener(Device.tween.complete, m)
            })
        }
    }
    function m() {
        if (A.kill || !p || !p.div) {
            return false
        }
        w()
    }
    function x() {
        if (!A.kill && p && p.div) {
            p.css(B);
            p.transform(j)
        }
    }
    function e() {
        if (!p || !p.div) {
            return false
        }
        if (p._cssTween) {
            p._cssTween.stop()
        }
        p.div.removeEventListener(Device.tween.complete, m);
        A.playing = false
    }
    function D() {
        if (g) {
            TweenManager._dynamicPool.put(F.clear());
            TweenManager._dynamicPool.put(d.clear());
            TweenManager._dynamicPool.put(q.clear());
            TweenManager._dynamicPool.put(H.clear())
        }
        g = t = o = H = F = G = null;
        f = q = d = j = o = null;
        v = z = b = null;
        B = E = l = u = s = r = null;
        A.kill = false
    }
    function w() {
        if (A.playing) {
            p._cssTween = null;
            if (!g) {
                e()
            }
            A.playing = false;
            if (f) {
                f.play()
            } else {
                if (s) {
                    s()
                }
            }
            D()
        }
    }
    this.start = function (J, L, M, N, I, O, K) {
        p = J;
        B = L;
        E = M;
        l = N;
        u = I;
        s = O;
        r = K;
        A = this;
        i();
        return this
    };
    this.stop = function () {
        if (A.playing) {
            p.div.style[Device.styles.vendor + "Transition"] = "";
            p.div._transition = false;
            A.kill = true;
            p._cssTween = null;
            if (f) {
                f.stop()
            }
            if (g && t && t.stop) {
                t.stop()
            }
            if (g && o && o.stop) {
                o.stop()
            } else {
                e()
            }
            D()
        }
    };
    this.play = function (I) {
        if (!A.playing) {
            if (g) {
                if (!I) {
                    C()
                }
                k()
            } else {
                h();
                Render.nextFrame(a)
            }
        }
    };
    this.chain = function (I) {
        f = I;
        return f
    }
});
