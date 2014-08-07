Mobile.Class(function Accelerometer() {
    // console.log('SEVENTH CALL')
    // console.log(':: STATIC - accelerometer')
    // console.log('Accelerometer')
    var b = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;

    function a(c) {
        switch (window.orientation) {
        case 0:
            b.x = -c.accelerationIncludingGravity.x;
            b.y = c.accelerationIncludingGravity.y;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = c.rotationRate.alpha;
                b.beta = c.rotationRate.beta;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case 180:
            b.x = c.accelerationIncludingGravity.x;
            b.y = -c.accelerationIncludingGravity.y;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = -c.rotationRate.alpha;
                b.beta = -c.rotationRate.beta;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case 90:
            b.x = c.accelerationIncludingGravity.y;
            b.y = c.accelerationIncludingGravity.x;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = -c.rotationRate.beta;
                b.beta = c.rotationRate.alpha;
                b.gamma = c.rotationRate.gamma
            }
            break;
        case -90:
            b.x = -c.accelerationIncludingGravity.y;
            b.y = -c.accelerationIncludingGravity.x;
            b.z = c.accelerationIncludingGravity.z;
            if (c.rotationRate) {
                b.alpha = c.rotationRate.beta;
                b.beta = -c.rotationRate.alpha;
                b.gamma = c.rotationRate.gamma
            }
            break
        }
    }
    this.capture = function () {
        window.ondevicemotion = a
    };
    this.stop = function () {
        window.ondevicemotion = null;
        b.x = b.y = b.z = 0
    }
}, "Static");