(function (undefined) {
    var max_synonyms = 3;

    var TRANSLITERATION_VARIANT = '\
            <div class="<%=prefix%>variant-row <%=prefix%>translit-row">\
                <div class="<%=prefix%>v-item <%=prefix%>translit-item <%=prefix%>no-border-bottom">\
                    <div class="<%=prefix%>v-pos <%=prefix%>translit-pos"><%=l_transliteration%></div>\
                    <div class="<%=prefix%>main-of-item <%=prefix%>translit-main"><%=transliteration%></div>\
                </div>\
            </div>\
        ';

    var SINGLE_HTML = '\
        <div class="<%=prefix%>original-wrap <%=prefix%>padded-single-translation">\
            <div class="<%=prefix%>mv-text-part"><%=original%></div>\
            <div class="<%=prefix%>ico-listen <%=prefix%>listen-button <%=prefix%>listen-original" data-from="<%=from%>">\
                <div class="<%=prefix%>icon"></div>\
            </div>\
        </div>\
        <div class="<%=prefix%>padded-single-translation <%=prefix%>trans-wrap">\
            <div class="<%=prefix%>tpart"><%=translation%></div>\
            <div class="<%=prefix%>ico-listen <%=prefix%>listen-button <%=prefix%>listen-translation" data-to="<%=to%>">\
                <div class="<%=prefix%>icon"></div>\
            </div>\
        </div>';

    var MULTI_HTML = '\
        \
        ';

    pl.extend(ke.ui_views.multi_variant, {
        _singleWrap: function (translations, ov, prefix, locales) {
            var show_original = ke.ext.util.storageUtil.isTrueOption('show_original');

            prefix = prefix || '';

            return ov ? (ke.ext.util.storageUtil.isTrueOption('show_translit') ? ke.ext.tpl.compile(TRANSLITERATION_VARIANT, {
                prefix: prefix,
                l_transliteration: locales.transliteration,
                transliteration: translations[4]
            }) : '') : ke.ext.tpl.compile(SINGLE_HTML, {
                prefix: prefix,
                l_open: locales.open,
                l_original: locales.original,
                l_reversed: locales.reversed,
                l_unpin: locales.unpin,
                l_transliteration: locales.transliteration,
                original: translations[1],
                translation: translations[3],
                transliteration: translations[4]
            });
        },

        _complexSingleWrap: function (translations, ov, prefix, locales) {
            return this._singleWrap(translations, false, prefix, locales)
                + this._singleWrap(translations, true, prefix, locales);
        },

        _multiWrap: function (translations, onlyVariants, prefix, locales) {
            var df_local, df_local_items;
            var df = document.createDocumentFragment();

            if (!pl.type(prefix, 'str')) {
                prefix = '';
            }

            if (ke.ext.util.storageUtil.isTrueOption('show_translit')) {
                pl(df).append('<div class="' + prefix + 'variant-row ' + prefix + 'translit-row"><div class="' + prefix + 'v-item ' + prefix + 'translit-item"><div class="' + prefix + 'v-pos ' + prefix + 'translit-pos">' + locales.transliteration + '</div><div class="' + prefix + 'main-of-item ' + prefix + 'translit-main">' + translations[4] + '</div></div></div>');
            }

            for (var i = 0; i < translations[6].length; ++i) {
                if (pl.empty(translations[6][i])) {
                    continue;
                }

                var len = translations[6][i].length;
                df_local = document.createDocumentFragment();

                pl.each(translations[6][i], function (k, v) {
                    df_local_items = document.createDocumentFragment();

                    pl.each(v[1], function (k2, v2) {
                        if (k2 >= max_synonyms) return;
                        pl(df_local_items).append('<div class="' + prefix + 'synonym">' + v2 + '</div>' + (k2 < v[1].length - 1 && k2 < max_synonyms - 1 ? ', ' : ''));
                    });

                    var gender = '';

                    if (pl.type(v[2], 'str')) {
                        gender = '<div class="' + prefix + 'gender">, ' + v[2] + '</div>';
                    }

                    pl(df_local)
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-item')
                            .append('<div class="' + prefix + 'listen-v-item" data-langto="<%=to%>"><div class="' + prefix + 'small-listen-icon"></div></div>')
                            .append('<div class="' + prefix + 'main-of-item">' + v[0] + '</div>' + gender)
                            .append(
                            pl('<div>').addClass(prefix + 'synonyms').append(df_local_items).get()
                        )
                            .get()
                    );
                });

                var key = ke.ext.googleApi.getPartOfSpeechByIndex(i);
                var empty_pos = pl.empty(key);

                pl(df).append(
                    pl('<div>')
                        .addClass(prefix + 'variant-row')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-pos')
                            .html(!empty_pos ? ke.getLocale('CommonUi_LangPart_' + ke.capitalize(key)) : '')
                            //.append(!empty_pos ? '<div class="' + prefix + 'part-items-amount">' + translations.variants[key].length + '</div>' : '')
                            .addClass(empty_pos ? prefix + 'empty-pos' : '')
                            .get()
                    )
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'v-closest-wrap')
                            .append(df_local)
                            .get()
                    )
                        .get()
                );
            }

            // Do not include different wrappers and a main variant to the final HTML code
            if (onlyVariants === true) {
                return pl('<div>').append(df).html();
            }

            var show_original = ke.ext.util.storageUtil.isTrueOption('show_original');
            var bunch = pl('<div>').addClass(prefix + 'variant-bunch-wrap').append(
                pl('<div>')
                    .addClass(prefix + 'vbw-inside-layout')
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'original-wrap')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'original')
                            .html('<div class="' + prefix + 'mv-text-part">' + translations[1] + '</div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-button ' + prefix + 'listen-original" data-from="<%=from%>">' +
                            '<div class="' + prefix + 'icon"></div>' +
                            '</div>')
                            .get()
                    )
                        .get()
                )
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'main-variant-wrap')
                        .append(
                        pl('<div>')
                            .addClass(prefix + 'main-variant')
                            .html('<div class="' + prefix + 'mv-text-part">' + translations[3] + '</div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-button ' + prefix + 'listen-translation" data-to="<%=to%>">' +
                            '<div class="' + prefix + 'icon"></div>' +
                            '</div>')
                            .get()
                    )
                        .get()
                )
                    .append(
                    pl('<div>')
                        .addClass(prefix + 'variants-by-pos')
                        .append(df)
                        .get()
                )
                    .get()
            );

            return pl('<div>').append(bunch.get()).html();
        },

        wrap: function (multi, items, ov, prefix, locales, complexSingle) {
            locales = pl.extend(locales || {}, {
                original: ke.getLocale('Kernel_Original'),
                translation: ke.getLocale('Kernel_Translation'),
                open: ke.getLocale('Kernel_OpenGt'),
                reversed: ke.getLocale('Kernel_Reverse'),
                unpin: ke.getLocale('Kernel_Unpin'),
                highlight: ke.getLocale('Kernel_Highlight'),
                transliteration: ke.getLocale('CommonUi_LangPart_Transliteration')
            });
            return ke.ui_views.multi_variant['_' + (multi ? 'multi' : (!complexSingle ? 'single' : 'complexSingle')) + 'Wrap'](items, ov, prefix, locales);
        }
    });
})();