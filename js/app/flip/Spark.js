Class(function Spark() {
    console.log('NEGATIVE FIRST CALL')
    console.log(':: STATIC – Spark – Does this start everything?')

    Namespace("Spark", this);
    this.determine = function (a) {
        return typeof a.z === "undefined" ? Vector2 : Vector3
    }
}, "Static");