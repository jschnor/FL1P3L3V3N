Static(function GATracker() {
    this.trackPage = function (page) {
        if (typeof ga !== "undefined") {
            ga("send", "pageview", page);
        }
    };
    this.trackEvent = function (b, d, a, c) {
        if (typeof ga !== "undefined") {
            ga("send", "event", b, d, a, (c || 0));
        }
    };
});