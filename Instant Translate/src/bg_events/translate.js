(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.translate, {
        get: function (data, sendResponse) {
            var from = data.from || ke.ext.util.langUtil.getFromLang();
            var to = data.to || ke.ext.util.langUtil.getToLang();

            var fn = sendResponse;

            var locales = data.identificator === 'window' ? {
                translation: ke.getLocale('Kernel_Listen')
            } : null;

            if (!navigator.onLine) {
                ke.ext.cache.lookUpInCache(from, to, data.text, function (isEmpty, item) {
                    if (isEmpty) {
                        fn({
                            offline: true
                        });
                    } else {
                        var json = item.it_resp;
                        var parsed = ke.ext.googleApi.parseReceivedTranslation(json, false, data.prefix, locales, true);

                        fn({
                            code: parsed[1],
                            trans_translit: [ke.ext.util.storageUtil.isTrueOption('show_translit'), json[4]],
                            isMulti: json[0],
                            detected_lang: json[5],
                            from: from,
                            to: to
                        });
                    }
                });
            } else {
                ke.ext.googleApi.getTranslation(from, to, data.text, function (output) {
                    if (output.error) {
                        fn(output);
                    } else {
                        var correction = output.spell && output.spell.spell_res;
                        var output_it_format = ke.ext.googleApi.getInternalJSONFormat(output, data.text);
                        var parsed = ke.ext.googleApi.parseReceivedTranslation(output_it_format, false, data.prefix, locales, true);

                        var throwDataBack = function () {
                            fn({
                                code: parsed[1],
                                isMulti: output_it_format[0],
                                trans_translit: [ke.ext.util.storageUtil.isTrueOption('show_translit'), output_it_format[4]],
                                detected_lang: output_it_format[5],
                                from: from,
                                to: to,
                                correction: correction
                            });
                        };

                        if (ke.ext.util.storageUtil.isTrueOption('history')) {
                            // not var `from` to save auto detected langs
                            ke.ext.cache.saveOrUpdate(output_it_format[5], to, data.text, output_it_format, data.source, throwDataBack);
                        } else {
                            throwDataBack();
                        }
                    }
                });
            }
        },

        getTranslationPageLink: function (data, sendResponse) {
            sendResponse({
                link: ke.ext.googleApi.getTranslationPageLink(data.text, data.from, data.to)
            });
        }
    });

})();