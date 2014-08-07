(function () {
    // console.log('FIRST CALL');
    // Looks to setup a bunch of tween managers
    // console.log(':: Tween Managers');

    TweenManager.MathEasing.Linear = {
        None: function (a) {
            return a
        }
    };
    TweenManager.MathEasing.Quad = {
        In: function (a) {
            return a * a
        },
        Out: function (a) {
            return a * (2 - a)
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a
            }
            return -0.5 * (--a * (a - 2) - 1)
        }
    };
    TweenManager.MathEasing.Cubic = {
        In: function (a) {
            return a * a * a
        },
        Out: function (a) {
            return --a * a * a + 1
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a
            }
            return 0.5 * ((a -= 2) * a * a + 2)
        }
    };
    TweenManager.MathEasing.Quart = {
        In: function (a) {
            return a * a * a * a
        },
        Out: function (a) {
            return 1 - --a * a * a * a
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a * a
            }
            return -0.5 * ((a -= 2) * a * a * a - 2)
        }
    };
    TweenManager.MathEasing.Quint = {
        In: function (a) {
            return a * a * a * a * a
        },
        Out: function (a) {
            return --a * a * a * a * a + 1
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return 0.5 * a * a * a * a * a
            }
            return 0.5 * ((a -= 2) * a * a * a * a + 2)
        }
    };
    TweenManager.MathEasing.Sine = {
        In: function (a) {
            return 1 - Math.cos(a * Math.PI / 2)
        },
        Out: function (a) {
            return Math.sin(a * Math.PI / 2)
        },
        InOut: function (a) {
            return 0.5 * (1 - Math.cos(Math.PI * a))
        }
    };
    TweenManager.MathEasing.Expo = {
        In: function (a) {
            return a === 0 ? 0 : Math.pow(1024, a - 1)
        },
        Out: function (a) {
            return a === 1 ? 1 : 1 - Math.pow(2, -10 * a)
        },
        InOut: function (a) {
            if (a === 0) {
                return 0
            }
            if (a === 1) {
                return 1
            }
            if ((a *= 2) < 1) {
                return 0.5 * Math.pow(1024, a - 1)
            }
            return 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
        }
    };
    TweenManager.MathEasing.Circ = {
        In: function (a) {
            return 1 - Math.sqrt(1 - a * a)
        },
        Out: function (a) {
            return Math.sqrt(1 - --a * a)
        },
        InOut: function (a) {
            if ((a *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - a * a) - 1)
            }
            return 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        }
    };
    TweenManager.MathEasing.Elastic = {
        In: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            return -(b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
        },
        Out: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            return (b * Math.pow(2, -10 * c) * Math.sin((c - d) * (2 * Math.PI) / e) + 1)
        },
        InOut: function (c) {
            var d, b = 0.1,
                e = 0.4;
            if (c === 0) {
                return 0
            }
            if (c === 1) {
                return 1
            }
            if (!b || b < 1) {
                b = 1;
                d = e / 4
            } else {
                d = e * Math.asin(1 / b) / (2 * Math.PI)
            }
            if ((c *= 2) < 1) {
                return -0.5 * (b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
            }
            return b * Math.pow(2, -10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e) * 0.5 + 1
        }
    };
    TweenManager.MathEasing.Back = {
        In: function (a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b)
        },
        Out: function (a) {
            var b = 1.70158;
            return --a * a * ((b + 1) * a + b) + 1
        },
        InOut: function (a) {
            var b = 1.70158 * 1.525;
            if ((a *= 2) < 1) {
                return 0.5 * (a * a * ((b + 1) * a - b))
            }
            return 0.5 * ((a -= 2) * a * ((b + 1) * a + b) + 2)
        }
    };
    TweenManager.MathEasing.Bounce = {
        In: function (a) {
            return 1 - TweenManager.MathEasing.Bounce.Out(1 - a)
        },
        Out: function (a) {
            if (a < (1 / 2.75)) {
                return 7.5625 * a * a
            } else {
                if (a < (2 / 2.75)) {
                    return 7.5625 * (a -= (1.5 / 2.75)) * a + 0.75
                } else {
                    if (a < (2.5 / 2.75)) {
                        return 7.5625 * (a -= (2.25 / 2.75)) * a + 0.9375
                    } else {
                        return 7.5625 * (a -= (2.625 / 2.75)) * a + 0.984375
                    }
                }
            }
        },
        InOut: function (a) {
            if (a < 0.5) {
                return TweenManager.MathEasing.Bounce.In(a * 2) * 0.5
            }
            return TweenManager.MathEasing.Bounce.Out(a * 2 - 1) * 0.5 + 0.5
        }
    }
})();
