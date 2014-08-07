Class(function Vector2(c, a) {
    // console.log('Vector2')
    var d = this;
    var b = Vector2.prototype;
    this.x = typeof c == "number" ? c : 0;
    this.y = typeof a == "number" ? a : 0;
    this.type = "vector2";
    b.set = function (e, f) {
        this.x = e;
        this.y = f;
        return this;
    };
    b.clear = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    b.copyTo = function (e) {
        e.x = this.x;
        e.y = this.y;
        return this;
    };
    b.copyFrom = function (e) {
        this.x = e.x;
        this.y = e.y;
        return this;
    };
    b.addVectors = function (f, e) {
        this.x = f.x + e.x;
        this.y = f.y + e.y;
        return this;
    };
    b.subVectors = function (f, e) {
        this.x = f.x - e.x;
        this.y = f.y - e.y;
        return this;
    };
    b.multiplyVectors = function (f, e) {
        this.x = f.x * e.x;
        this.y = f.y * e.y;
    };
    b.add = function (e) {
        this.x += e.x;
        this.y += e.y;
        return this;
    };
    b.sub = function (e) {
        this.x -= e.x;
        this.y -= e.y;
        return this;
    };
    b.multiply = function (e) {
        this.x *= e;
        this.y *= e;
        return this;
    };
    b.divide = function (e) {
        this.x /= e;
        this.y /= e;
        return this;
    };
    b.lengthSq = function () {
        return (this.x * this.x + this.y * this.y) || 0.00001
    };
    b.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    b.normalize = function () {
        var e = this.length();
        this.x /= e;
        this.y /= e;
        return this;
    };
    b.perpendicular = function (h, f) {
        var g = this.x;
        var e = this.y;
        this.x = -e;
        this.y = g;
        return this;
    };
    b.lerp = function (e, f) {
        this.x += (e.x - this.x) * f;
        this.y += (e.y - this.y) * f;
        return this;
    };
    b.isZero = function () {
        return this.x == 0 && this.y == 0;
    };
    b.setAngleRadius = function (e, f) {
        this.x = Math.cos(e) * f;
        this.y = Math.sin(e) * f;
        return this;
    };
    b.addAngleRadius = function (e, f) {
        this.x += Math.cos(e) * f;
        this.y += Math.sin(e) * f;
        return this;
    };
    b.clone = function () {
        return new Vector2(this.x, this.y);
    };
    b.dot = function (f, e) {
        e = e || this;
        return (f.x * e.x + f.y * e.y);
    };
    b.distanceTo = function (g, h) {
        var f = this.x - g.x;
        var e = this.y - g.y;
        if (!h) {
            return Math.sqrt(f * f + e * e);
        }
        return f * f + e * e;
    };
    b.solveAngle = function (f, e) {
        if (!e) {
            e = this;
        }
        return Math.acos(f.dot(e) / (f.length() * e.length()));
    };
    b.equals = function (e) {
        return this.x == e.x && this.y == e.y;
    }
});