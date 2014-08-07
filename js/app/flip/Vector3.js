Class(function Vector3(d, b, a, e) {
    var f = this;
    var c = Vector3.prototype;
    this.x = typeof d === "number" ? d : 0;
    this.y = typeof b === "number" ? b : 0;
    this.z = typeof a === "number" ? a : 0;
    this.w = typeof e === "number" ? e : 1;
    this.type = "vector3";
    c.set = function (g, j, i, h) {
        this.x = g || 0;
        this.y = j || 0;
        this.z = i || 0;
        this.w = h || 1;
        return this
    };
    c.clear = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this
    };
    c.append = function (g, j, i, h) {
        this.x += g || 0;
        this.y += j || 0;
        this.z += i || 0;
        this.w += h || 0;
        return this
    };
    c.appendVector = function (g) {
        if (!g) {
            return this
        }
        this.x += g.x;
        this.y += g.y;
        this.z += g.z;
        this.w += g.w;
        return this
    };
    c.copyTo = function (g) {
        g.x = this.x;
        g.y = this.y;
        g.z = this.z;
        g.w = this.w;
        return g
    };
    c.copy = function (g) {
        g = g || new Vector3();
        g.set(this.x, this.y, this.z, this.w);
        return g
    };
    c.copyFrom = function (g) {
        this.x = g.x;
        this.y = g.y;
        this.z = g.z;
        this.w = g.w;
        return this
    };
    c.lengthSq = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z
    };
    c.length = function () {
        return Math.sqrt(this.lengthSq())
    };
    c.normalize = function () {
        var g = 1 / this.length();
        this.set(this.x * g, this.y * g, this.z * g);
        return this
    };
    c.addVectors = function (h, g) {
        this.x = h.x + g.x;
        this.y = h.y + g.y;
        this.z = h.z + g.z;
        return this
    };
    c.subVectors = function (h, g) {
        this.x = h.x - g.x;
        this.y = h.y - g.y;
        this.z = h.z - g.z;
        return this
    };
    c.multiplyVectors = function (h, g) {
        this.x = h.x * g.x;
        this.y = h.y * g.y;
        this.z = h.z * g.z;
        return this
    };
    c.add = function (g) {
        this.x += g.x;
        this.y += g.y;
        this.z += g.z;
        return this
    };
    c.sub = function (g) {
        this.x -= g.x;
        this.y -= g.y;
        this.z -= g.z;
        return this
    };
    c.multiply = function (g) {
        this.x *= g;
        this.y *= g;
        this.z *= g;
        return this
    };
    c.divide = function (g) {
        this.x /= g;
        this.y /= g;
        this.z /= g;
        return this
    };
    c.lerp = function (g, h) {
        this.x += (g.x - this.x) * h;
        this.y += (g.y - this.y) * h;
        this.z += (g.z - this.z) * h;
        return this
    };
    c.setAngleRadius = function (g, h) {
        this.x = Math.cos(g) * h;
        this.y = Math.sin(g) * h;
        this.z = Math.sin(g) * h;
        return this
    };
    c.addAngleRadius = function (g, h) {
        this.x += Math.cos(g) * h;
        this.y += Math.sin(g) * h;
        this.z += Math.sin(g) * h;
        return this
    };
    c.dot = function (h, g) {
        g = g || this;
        return h.x * g.x + h.y * g.y + h.z * g.z
    };
    c.clone = function () {
        return new Vector3(this.x, this.y, this.z)
    };
    c.cross = function (i, h) {
        var g = i.y * h.z - i.z * h.y;
        var k = i.z * h.x - i.x * h.z;
        var j = i.x * h.y - i.y * h.x;
        this.set(g, k, j, this.w);
        return this
    };
    c.distanceTo = function (j, k) {
        var i = this.x - j.x;
        var h = this.y - j.y;
        var g = this.z - j.z;
        if (!k) {
            return Math.sqrt(i * i + h * h + g * g)
        }
        return i * i + h * h + g * g
    };
    c.solveAngle = function (h, g) {
        if (!g) {
            g = this
        }
        return Math.acos(h.dot(g) / (h.length() * g.length()))
    };
    c.equals = function (g) {
        return this.x == g.x && this.y == g.y && this.z == g.z
    }
});
