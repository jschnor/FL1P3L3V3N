Class(function Vector2(x, y) {
    // console.log('Vector2')
    var _self   = this;
    var _proto  = Vector2.prototype;
    this.x = typeof x == "number" ? x : 0;
    this.y = typeof y == "number" ? y : 0;
    this.type = "vector2";
    _proto.set = function (e, f) {
        this.x = e;
        this.y = f;
        return this;
    };
    _proto.clear = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    _proto.copyTo = function (e) {
        e.x = this.x;
        e.y = this.y;
        return this;
    };
    _proto.copyFrom = function (e) {
        this.x = e.x;
        this.y = e.y;
        return this;
    };
    _proto.addVectors = function (f, e) {
        this.x = f.x + e.x;
        this.y = f.y + e.y;
        return this;
    };
    _proto.subVectors = function (f, e) {
        this.x = f.x - e.x;
        this.y = f.y - e.y;
        return this;
    };
    _proto.multiplyVectors = function (f, e) {
        this.x = f.x * e.x;
        this.y = f.y * e.y;
    };
    _proto.add = function (e) {
        this.x += e.x;
        this.y += e.y;
        return this;
    };
    _proto.sub = function (e) {
        this.x -= e.x;
        this.y -= e.y;
        return this;
    };
    _proto.multiply = function (e) {
        this.x *= e;
        this.y *= e;
        return this;
    };
    _proto.divide = function (e) {
        this.x /= e;
        this.y /= e;
        return this;
    };
    _proto.lengthSq = function () {
        return (this.x * this.x + this.y * this.y) || 0.00001
    };
    _proto.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    _proto.normalize = function () {
        var e = this.length();
        this.x /= e;
        this.y /= e;
        return this;
    };
    _proto.perpendicular = function (h, f) {
        var g = this.x;
        var e = this.y;
        this.x = -e;
        this.y = g;
        return this;
    };
    _proto.lerp = function (e, f) {
        this.x += (e.x - this.x) * f;
        this.y += (e.y - this.y) * f;
        return this;
    };
    _proto.isZero = function () {
        return this.x == 0 && this.y == 0;
    };
    _proto.setAngleRadius = function (e, f) {
        this.x = Math.cos(e) * f;
        this.y = Math.sin(e) * f;
        return this;
    };
    _proto.addAngleRadius = function (e, f) {
        this.x += Math.cos(e) * f;
        this.y += Math.sin(e) * f;
        return this;
    };
    _proto.clone = function () {
        return new Vector2(this.x, this.y);
    };
    _proto.dot = function (f, e) {
        e = e || this;
        return (f.x * e.x + f.y * e.y);
    };
    _proto.distanceTo = function (g, h) {
        var f = this.x - g.x;
        var e = this.y - g.y;
        if (!h) {
            return Math.sqrt(f * f + e * e);
        }
        return f * f + e * e;
    };
    _proto.solveAngle = function (f, e) {
        if (!e) {
            e = this;
        }
        return Math.acos(f.dot(e) / (f.length() * e.length()));
    };
    _proto.equals = function (e) {
        return this.x == e.x && this.y == e.y;
    }
});