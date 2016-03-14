Class(function GATracker() {
    
    // track a page view
    this.trackPage = function (page) {
        if (typeof ga !== "undefined") {
            ga("send", "pageview", page);
        }
    };

    // track some other custom event
    // eventCategory and eventAction are required
    // looks like values can be anything you want
    this.trackEvent = function (eventCategory, eventAction, eventLabel, eventValue) {
        if (typeof ga !== "undefined") {
            ga("send", "event", eventCategory, eventAction, eventLabel, (eventValue || 0));
        }
    };

}, 'static');