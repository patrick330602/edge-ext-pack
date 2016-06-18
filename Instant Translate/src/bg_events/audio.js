(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.audio, {
        play: function (data, sendResponse) {
            var lang = data.lang;

            var callback = function () {
                sendResponse({
                    old_data: data
                });
            };

            if (lang === 'auto') {
                ke.ext.util.langUtil.getDetectedLang(data.text, function (dlang) {
                    if (ke.ext.audio.isUtterable(dlang)) {
                        ke.ext.audio.playBigText(data.text, dlang, callback);
                    } else {
                        callback();
                    }
                });
            } else {
                if (ke.ext.audio.isUtterable(lang)) {
                    ke.ext.audio.playBigText(data.text, lang, callback);
                } else {
                    callback();
                }
            }
        },

        interrupt: function (data, port) {
            clearInterval(ke.ext.audio.intId);
            ke.ext.audio.stopCurrentAudio();
        }
    })
    ;

})
();