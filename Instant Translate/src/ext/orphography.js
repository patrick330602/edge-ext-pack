(function (undefined) {
    var _declineTransFromPatcher = {
        // Private common modifiers
        _lc: function (l) {
            return l.toLowerCase();
        },

        _ca: function (l) {
            return ke.capitalize(l);
        },

        // Public

        en: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        de: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        ru: function (l) {
            return _declineTransToPatcher._lc(l);
        },

        uk: function (l) {
            return _declineTransToPatcher._lc(l);
        }
    };

    var _declineTransToPatcher = {
        // Private common modifiers
        _lc: function (l) {
            return l.toLowerCase();
        },

        _ca: function (l) {
            return ke.capitalize(l);
        },

        // Public

        en: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        de: function (l) {
            return _declineTransToPatcher._ca(l);
        },

        ru: function (l) {
            return _declineTransToPatcher._lc(l);
        },

        uk: function (l) {
            return _declineTransToPatcher._lc(l);
        }
    };

    pl.extend(ke.ext.orphography, {
        declineTransTo: function (lang) {
            var patcher = _declineTransToPatcher[ke.ext.util.langUtil.getCurrentUiLang(true)] ||
                _declineTransToPatcher.en;

            return patcher(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(lang)));
        }
    });

})();