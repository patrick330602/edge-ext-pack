(function (undefined) {

    var UI_LANG = ke.ext.util.langUtil.getCurrentUiLang(true);

    pl.extend(ke.ext.time, {
        _getI18nMonth: function (m) {
            if (UI_LANG === 'en') {
                return m;
            } else {
                return ke.getLocale('Kernel_Date_' + m);
            }
        },

        _modifiers: {
            beforeDay: {
                fr: function () {
                    return 'le ';
                }
            },

            afterDay: {
                de: function () {
                    return '.';
                },

                fr: function (num) {
                    return num === 1 ? '<sup>er</sup>' : '';
                }
            }
        },

        beautify: function (stamp) {
            var dateParticles = (new Date(stamp)).toString().split(' ');

            // E.g.,
            // 09:34, 19 Jul 2012
            var response = '';

            response += dateParticles[4].split(':').splice(0, 2).join(':');
            response += ',';
            response += ' ';

            if (this._modifiers.beforeDay[UI_LANG]) {
                response += this._modifiers.beforeDay[UI_LANG]();
            }

            var day = dateParticles[2];
            response += day.substr(0, 1) === '0' ? day.substr(1) : day;

            if (this._modifiers.afterDay[UI_LANG]) {
                response += this._modifiers.afterDay[UI_LANG](+day);
            }

            response += ' ';
            response += this._getI18nMonth(dateParticles[1]);
            response += ' ';
            response += dateParticles[3].substr(2);

            return response;
        }
    });

})();