(function (undefined) {

    var SPECIAL_KEYS = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        19: 'pause',
        27: 'escape',
        37: 'left arrow',
        39: 'right arrow',
        38: 'up arrow',
        40: 'down arrow',
        46: 'delete',
        91: 'cmd left',
        93: 'cmd right',
        '91-93': 'cmd',
        106: 'multiply',
        107: 'add',
        109: 'subtract',
        110: '^',
        111: '\\',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        221: ']',
        222: '\'',
        220: '\\',
        48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
        33: 'pgup', 34: 'pgdown'
    };

    var MAP = {
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        esc: 27,
        space: 32,
        cmd: [91, 93],
        arrowup: 38,
        arrowdown: 40,
        tilde: 192
    };

    var DENIED_COMBOS = 'cmd+p,ctrl+p,ctrl+r,cmd+r,cmd+o,cmd+a,ctrl+n,ctrl+t,ctrl+shift+n,ctrl+o,ctrl,ctrl+shift,shift,shift,ctrl+shift+t,esc,ctrl+1,ctrl+8,ctrl+9,ctrl+tab,ctrl+pgdown,ctrl+shift+tab,ctrl+pgup,alt+f4,ctrl+shift+w,ctrl+w,ctrl+f4,backspace,alt,shift+backspace,alt,ctrl,alt+home,cmd+n,cmd+t,cmd+shift+n,cmd+o,cmd,cmd+shift,shift,shift,cmd+shift+t,cmd+alt,cmd+alt,cmd+w,cmd+shift+w,delete,cmd+[,shift+delete,cmd+],shift,cmd+m,cmd+h,cmd+alt+h,cmd+q,cmd,ctrl'
        .split(',');

    var start = 65;
    for (var i = start; i <= start + 25; ++i) {
        MAP[String.fromCharCode(i + 32)] = i;
    }

    var isCtrlAndLetter = function (combo) {
        var cb = {cmd: 0, ctrl: 0};
        return (combo[0] in cb && combo[1].toLowerCase() >= 'a' && combo[1].toLowerCase() <= 'z')
            || (combo[1] in cb && combo[0].toLowerCase() >= 'a' && combo[0].toLowerCase() <= 'z');
    };

//    console.log(MAP);

    pl.extend(ke.ext.event, {
        isKeyCodeLetter: function (key_code) {
            key_code = +key_code;
            return key_code >= start && key_code <= start + 25;
        },

        isControlKey: function (key_code) {
            key_code = +key_code;

            for (var key in MAP) {
                var is_arr = $.isArray(MAP[key]);
                if (!this.isKeyCodeLetter(key_code) && (is_arr ? $.inArray(key_code, MAP[key]) > -1 : MAP[key] === key_code)) {
                    return true;
                }
            }
            return false;
        },

        isValidKeyCode: function (key_code) {
            key_code = +key_code;
            return this.isKeyCodeLetter(key_code) || key_code in SPECIAL_KEYS;
        },

        // for mac cmd
        checkMultipleKeyCodes: function (key_code) {
            return key_code in {91: 0, 93: 0} ? '91-93' : key_code;
        },

        getNicePresentationForKeyCode: function (key_code) {
            if (this.isKeyCodeLetter(+key_code)) {
                return String.fromCharCode(+key_code);
            }

            var found = null;
            for (var key in SPECIAL_KEYS) {
                if (typeof key === 'string' && key.indexOf(key_code) > -1 && key.indexOf('-') > -1) {
                    found = SPECIAL_KEYS[key];
                }
            }

            return found || SPECIAL_KEYS[key_code];
        },

        isDenied: function (combo) {
            combo = combo.toLowerCase();
            var c_arr = combo.split('+').reverse();
            if (c_arr.length === 2 && isCtrlAndLetter(c_arr)) {
                return true;
            }
            var reversed = c_arr.join('+');
            return $.inArray(combo, DENIED_COMBOS) > -1 || $.inArray(reversed, DENIED_COMBOS) > -1;
        },

        is: function (combo, e) {
            var multi = combo.split('+');
            var is = true;
            var keyCodeMatch;

            pl.each(multi, function (k, v) {
                var variants = v.split('-');
                keyCodeMatch = false;

                pl.each(variants, function (k2, v2) {
                    if (e.keyCode === +v2) {
                        keyCodeMatch = true;
                    }
                });

                if (!keyCodeMatch) {
                    is = false;
                }
            });

            return is;
        },

        IN_STR: 1,
        IN_CODES: 2,

        isDown: function (combo, input_type, keys_down) {
            if (!input_type) input_type = this.IN_STR;

            var keys;

            if (input_type === this.IN_STR) {
                keys = this.getKeyCodeCombinationFromName(combo, false);
            } else if (input_type === this.IN_CODES) {
                keys = combo.split('+');
            }

            for (var i = 0, len = keys.length; i < len; ++i) {
                if (!(keys_down || this.keysDown)[keys[i]]) {
                    return false;
                }
            }

            return true;
        },

        getKeyCodeCombinationFromName: function (combination, do_join) {
            var names = combination.split('+');
            var key_code_combo = [];

            for (var i = 0, len = names.length; i < len; ++i) {
                var code = MAP[names[i].toLowerCase()];
                key_code_combo.push($.isArray(code) ? code.join('-') : code);
            }

            return do_join ? key_code_combo.join('+') : key_code_combo;
        },

        getNameFromKeyCodeCombination: function (code_combo) {
            var codes = code_combo.split('+');
            var names = [];

            for (var i = 0, len = codes.length; i < len; ++i) {
                names.push(ke.capitalize(SPECIAL_KEYS[codes[i]] || ke.getKeyByVal(MAP, codes[i]) || ''));
            }

            return names.join('+');
        },

        getNecessaryInfo: function (event) {
            return {
                keyCode: event.keyCode,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey
            };
        },

        keysDown: {},

        forget: function () {
            $(document).off('keydown');
            $(document).off('keyup');
            this.keysDown = {};
        },

        listen: function (checkDeny, removeValidKey, callback, win) {
            var that = this;

            var clearLetters = function (key_code, down_keys) {
                if (that.isKeyCodeLetter(key_code)) {
                    for (var key in down_keys) {
                        if (that.isKeyCodeLetter(key)) {
                            delete down_keys[key];
                        }
                    }
                }
                return down_keys;
            };

            var clearNonControlKeys = function (key_code, down_keys) {
                if (!that.isControlKey(key_code)) {
                    for (var key in down_keys) {
                        if (!that.isControlKey(key)) {
                            delete down_keys[key];
                        }
                    }
                }
                return down_keys;
            };

            $(win || document).on('keydown', function (event) {
                if (that.isValidKeyCode(event.keyCode)) {
                    clearLetters(event.keyCode, that.keysDown);
                    clearNonControlKeys(event.keyCode, that.keysDown);

                    that.keysDown[that.checkMultipleKeyCodes(event.keyCode)] = true;

                    checkDeny(that.keysDown);
                    callback();
                }
            });

            $(win || document).on('keyup', function (event) {
                var kc = event.keyCode;
                var mkc = ke.ext.event.checkMultipleKeyCodes(event.keyCode);

                delete that.keysDown[kc];
                delete that.keysDown[mkc];

                removeValidKey(kc, mkc);
            });
        }
    });

})();