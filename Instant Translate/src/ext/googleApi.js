(function (undefined) {

    ke.import('ext.util.storageUtil');
    ke.import('ui_views.multi_variant');


    var positions = {
        '': 0,
        noun: 1,
        verb: 2,
        adjective: 3,
        adverb: 4,
        pronoun: 5,
        preposition: 6,
        conjunction: 7,
        interjection: 8,
        abbreviation: 9,
        phrase: 10,
        suffix: 11,
        auxiliaryverb: 12
    };

    var parts_of_speech = [];

    for (var key in positions) {
        parts_of_speech.push(key);
    }

    // Valid to use only within extension's background page due to requirement of country code for link generation

    pl.extend(ke.ext.googleApi, {
        getBingFallbackTranslation: function (from, to, text, fn) {
            pl.ajax({
                url: 'http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2?oncomplete=&onerror=',
                type: 'GET',
                dataType: 'json',
                data: {
                    appId: '"' + ke.ext.util.storageUtil.getVal('bing_appid') + '"',
                    options: '{}',
                    texts: '["' + text + '"]',
                    from: '"' + ke.ext.util.langUtil.getBingSyncedLang(from) + '"',
                    to: '"' + ke.ext.util.langUtil.getBingSyncedLang(to) + '"',
                    _: Date.now()
                },
                success: function (d) {
                    if (pl.type(d, 'str') && d.startsWith('ArgumentException')) {
                        ke.app.getBingAppId(function () {
                            ke.ext.googleApi.getBingFallbackTranslation(from, to, text, fn);
                        });
                    } else {
                        fn(d);
                    }
                },
                error: function (e) {
                    //console.log('Error while translating with Bing:', e);
                    //console.log('No variants anymore. Failed...');

                    fn({
                        error: true
                    });
                }
            });
        },

        getTranslation: function (from, to, text, fn) {
            from = from || 'auto';

            pl.ajax({
                url: 'http://clients5.google.com/translate_a/t',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    client: 'dict-chrome-ex',
                    q: text,
                    sl: from,
                    tl: to,
                    tbb: 1,
                    ie: 'UTF-8',
                    oe: 'UTF-8'
                },
                success: function (d) {
                    fn(d);
                },
                error: function (e) {
                    //console.log('Error while translating with Google:', e);
                    //console.log('Trying with Bing...');
                    ke.ext.googleApi.getBingFallbackTranslation(from, to, text, fn);
                }
            });
        },

        // remove doubling commas
        // ,, => ,0,
        // [, => [0,
        // ,] => ,0]
        parseResponse: function (r) {
            return r
                .replace(/(\,\,)/g, ',"",')
                .replace(/\[\,/g, '["",')
                .replace(/\,\]/g, ',""]');
        },

        getAudioFileLink: function (lang, text) {
            return ke.app.tts_link
                .replace('{{domain}}', ke.app.getCountry())
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang)
                .replace('{{textparts}}', text.split(' ').length)
                .replace('{{textlen}}', text.length)
                .replace('{{dictation_speed}}', '0.5');
        },

        getTranslationPageLink: function (text, from, to) {
            return 'https://translate.google.' + ke.app.getCountry() + '/#%from%|%to%|%text%'
                    .replace(/%from%/, from || ke.ext.util.langUtil.getFromLang())
                    .replace(/%to%/, to || ke.ext.util.langUtil.getToLang())
                    .replace(/%text%/, text);
        },

        getPartOfSpeechByIndex: function (index) {
            return parts_of_speech[index];
        },

        getInternalJSONFormat: function (output, original) {
            var res = typeof(output) == 'object' ? output : JSON.parse(this.parseResponse(output));

            if (typeof res[0] == 'boolean') {
                return res;
            }

            var translations = [
                false,
                '',
                '',
                '',
                '',
                '',
                [
                    [], // no category
                    [], // nouns
                    [], // verbs
                    [], // adjectives
                    [], // adverbs
                    [], // pronouns
                    [], // prepositions
                    [], // conjunctions
                    [], // interjections
                    [], // abbreviations
                    [], // Phrases
                    [], // Suffixes
                    []  // Auxiliary Verbs
                ]
            ];

            if (pl.type(res, 'arr') && res[0].Alignment != undefined) {
                translations[0] = false;
                translations[1] = original;
                translations[2] = "";
                translations[3] = res[0].TranslatedText;
                translations[4] = "";
                translations[5] = res[0].From;
            } else if (res.dict || pl.type(res[1], 'arr')) {
                if (res.dict) {
                    translations[0] = true;
                    translations[1] = res.sentences[0].orig;
                    translations[2] = (res.sentences[1] || {}).src_translit || '';
                    translations[3] = res.sentences[0].trans;
                    translations[4] = (res.sentences[1] || {}).translit || '';
                    translations[5] = res.src;

                    pl.each(res.dict, function (k, v) {
                        pl.each(v.entry, function (k2, v2) {
                            var item = [
                                v2.word,
                                v2.reverse_translation
                            ];

                            if (typeof v2.previous_word == 'string') {
                                item.push(v2.previous_word);
                            }

                            translations[6][positions[v.pos.toLowerCase().replace(' ', '')] || 0].push(item);
                        });
                    });
                } else {
                    translations[0] = true;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][1];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[2];

                    pl.each(res[1], function (k, v) {
                        pl.each(v[2], function (k2, v2) {
                            var item = [
                                v2[0],
                                v2[1]
                            ];

                            if (typeof v2[3] == "string") {
                                item.push(v2[3]);
                            }

                            translations[6][positions[v[0]] || 0].push(item);
                        });
                    });
                }
            } else {
                if (typeof res.sentences == 'object') {
                    for (var i = 0, len = res.sentences.length; i < len; ++i) {
                        if (res.sentences[i].orig) {
                            translations[1] += res.sentences[i].orig;
                        }
                        if (res.sentences[i].trans) {
                            translations[3] += res.sentences[i].trans;
                        }
                    }

                    translations[2] = (res.sentences[res.sentences.length - 1] || {}).src_translit || '';
                    translations[4] = (res.sentences[res.sentences.length - 1] || {}).translit || '';

                    translations[0] = false;
                    translations[5] = res.src;
                } else {
                    translations[0] = false;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][0];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[1];
                }
            }

            return translations;
        },

        // According to current settings (a single word/phrase or a bunch of variants)
        parseReceivedTranslation: function (json, mainAndVariantsSeparately, prefix, locales, complexSingle) {
            if (json[0]) {
                var response = [json[0], ke.ui_views.multi_variant.wrap(true, json, mainAndVariantsSeparately, prefix, locales)];
                if (mainAndVariantsSeparately) {
                    var tmp = response;
                    response = [tmp[0], json[3], tmp[1]];
                    delete tmp;
                }

                return response;
            } else {
                return [false, ke.ui_views.multi_variant.wrap(false, json, mainAndVariantsSeparately, prefix, locales, complexSingle)];
            }
        }
    });

})();
