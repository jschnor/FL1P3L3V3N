Class(function GATracker() {
    this.trackPage = function (a) {
        if (typeof ga !== "undefined") {
            ga("send", "pageview", a)
        }
    };
    this.trackEvent = function (b, d, a, c) {
        if (typeof ga !== "undefined") {
            ga("send", "event", b, d, a, (c || 0))
        }
    }
}, "Static");