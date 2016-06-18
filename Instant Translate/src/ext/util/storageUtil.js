(function (undefined) {

    ke.import('ext.const.storage');

    var arrayInsertValAction = function (n, v, a) {
        var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
        temp[a](v);
        localStorage[ke.getStorageConst(n)] = pl.stringify(temp);
    };

    var arrayDeleteValAction = function (n, a) {
        var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
        temp[a]();
        localStorage[ke.getStorageConst(n)] = pl.stringify(temp);
    };

    pl.extend(ke.ext.util.storageUtil, {
        initStorage: function () {
            var got_val, def_val;

            for (var key in ke.ext.const.storage) {
                if (pl.type(localStorage[ke.ext.const.storage[key]], 'undef')) {
                    got_val = ke.getStorageDefValue(key);

                    if (pl.type(got_val, 'obj') || pl.type(got_val, 'arr')) {
                        def_val = pl.stringify(got_val);
                    } else {
                        def_val = got_val;
                    }

                    localStorage[ke.ext.const.storage[key]] = def_val;
                }
            }
        },

        requestBackgroundOption: function (fn, args, cb, is_background) {
            this.chainRequestBackgroundOption([{fn: fn, args: args}], function (responses) {
                cb && cb(responses[0].response);
            }, is_background);
        },

        chainRequestBackgroundOption: function (calls, cb, is_background) {
            if (is_background) {
                var responses = [];
                calls.forEach(function (call) {
                    if (typeof call === "object") {
                        var res =
                            ke.ext.util.storageUtil[call.fn].apply(ke.ext.util.storageUtil, call.args);
                        responses.push({response: res});
                    }
                });
                cb(responses);
            } else {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'chainRequestBackgroundOption'),
                    calls: calls
                }, function (data) {
                    cb && cb(data);
                });
            }
        },

        isTrueOption: function (n) {
            return localStorage[ke.getStorageConst(n)] == 'true';
        },

        setOptionAsBoolean: function (n, v) {
            localStorage[ke.getStorageConst(n)] = pl.type(v, 'bool') ? v : v == 'true';
        },

        isActiveJsonOption: function (n) {
            return !!pl.JSON(localStorage[ke.getStorageConst(n)]).active;
        },

        setActiveJsonValueAsBoolean: function (n, v) {
            var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
            temp.active = v;
            localStorage[ke.getStorageConst(n)] = pl.stringify(temp);
        },

        setJsonField: function (n, f, v) {
            var setNest = function (obj, paths, val) {
                if (paths.length > 1) {
                    setNest(obj[paths.shift()], paths, val);
                } else {
                    obj[paths[0]] = val;
                }
            };

            var temp = pl.JSON(localStorage[ke.getStorageConst(n)]);
            var fields = f.split('.');
            setNest(temp, fields, v);
            localStorage[ke.getStorageConst(n)] = pl.stringify(temp);
        },

        getJsonField: function (n, f) {
            return pl.JSON(localStorage[ke.getStorageConst(n)])[f];
        },

        setJsonVal: function (n, v) {
            ke.ext.util.storageUtil.setJsonField(n, 'value', v);
        },

        getJsonVal: function (n) {
            return ke.ext.util.storageUtil.getJsonField(n, 'value');
        },

        setVal: function (n, v) {
            localStorage[ke.getStorageConst(n)] = v;
        },

        getVal: function (n) {
            return localStorage[ke.getStorageConst(n)];
        },

        encodeAndSet: function (n, o) {
            localStorage[ke.getStorageConst(n)] = pl.stringify(o);
        },

        deleteJsonElementByKey: function (n, key) {
            var o = this.getDecodedVal(n);
            delete o[key];
            this.encodeAndSet(n, o);
        },

        getArrayValLen: function (n) {
            return ke.ext.util.storageUtil.getDecodedVal(n).length;
        },

        getDecodedVal: function (n) {
            var o;
            try {
                o = pl.JSON(localStorage[ke.getStorageConst(n)]);
            } catch (e) {
                console.log("Failed to get and decode such a JSON object: " + n);
            }
            return o || {};
        },

        pushArrayVal: function (n, v) {
            arrayInsertValAction(n, v, 'push');
        },

        unshiftArrayVal: function (n, v) {
            arrayInsertValAction(n, v, 'unshift');
        },

        addArrayVal: function (n, v) {
            var temp = this.getDecodedVal(n);

            // Init a new array in case it does not exist
            if (pl.empty(temp)) {
                temp = [];
            }

            var pos = pl.inArray(v, temp);

            if (~pos) {
                var temp2 = [];
                temp2.push(temp[pos]);

                pl.each(temp, function (k, v) {
                    if (pos !== k) {
                        temp2.push(v);
                    }
                });

                temp = temp2;
            } else {
                temp.unshift(v);
            }

            localStorage[ke.getStorageConst(n)] = pl.stringify(temp);
        },

        popArrayVal: function (n) {
            arrayDeleteValAction(n, 'pop');
        },

        shiftArrayVal: function (n) {
            arrayDeleteValAction(n, 'shift');
        },

        spliceBySearch: function (n, v) {
            var spliced;
            var arr = ke.ext.util.storageUtil.getDecodedVal(n);

            for (var i = 0, len = arr.length; i < len; ++i) {
                if (arr[i] === v) {
                    spliced = arr.splice(i, 1)[0];
                    break;
                }
            }

            localStorage[ke.getStorageConst(n)] = pl.stringify(arr);

            return spliced;
        },

        setIntValue: function (n, v) {
            this.setVal(n, v + "");
        },

        getIntValue: function (n) {
            return +this.getVal(n);
        },

        incrementIntValue: function (n) {
            var new_val = this.getIntValue(n) + 1;
            this.setVal(n, new_val + "");
            return new_val;
        },

        isEmpty: function (n) {
            return pl.empty(this.getVal(n));
        },

        isEmptyArray: function (n) {
            return pl.empty(this.getDecodedVal(n));
        },

        isIntlMonetizationOn: function () {
            return this.isTrueOption('monetization') && ke.getCurrentLocale() !== 'ru';
        }
    })

})();