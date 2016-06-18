(function (undefined) {
    pl.extend(ke.particles.lang_selectors.model, {
        onOpen: function (serial, ot) {
            if (serial === 1) {
                ke.particles.scrollbars.model.setupFromWindowDropdownScroll(ot);
            } else if (serial === 2) {
                ke.particles.scrollbars.model.setupToWindowDropdownScroll(ot);
            }
        },

        onLangDropdownChange: function (serial, v, prev_val, skipTranslation) {
            var opposite_lang;

            if (serial === 1) {
                opposite_lang = ke.ext.util.langUtil.getToLang();
                ke.ext.util.langUtil.setFromLang(v);
            } else if (serial === 2) {
                opposite_lang = ke.ext.util.langUtil.getFromLang();
                ke.ext.util.langUtil.setToLang(v);
                ke.app.temp.toLang = v;
            }

            if (skipTranslation !== true) {
                ke.particles.translate.model.translateSimple(undefined, true);
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getArrayValLen', args: ['recently_used_lang']},
                {fn: 'spliceBySearch', args: ['recently_used_lang', opposite_lang]},
                {fn: 'addArrayVal', args: ['recently_used_lang', v]}
            ], function (responses) {
                var ru_len = responses[0].response;
                if (ru_len >= 8) {
                    for (var i = ru_len; i > 8; --i) {
                        ke.ext.util.storageUtil.requestBackgroundOption('popArrayVal', ['recently_used_lang']);
                    }
                }

                var spliced = responses[1].response;

                //ke.ext.util.storageUtil.addArrayVal('recently_used_lang', v);
                if (!pl.empty(spliced)) {
                    ke.ext.util.storageUtil.requestBackgroundOption('addArrayVal', ['recently_used_lang', spliced]);
                }

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'opt', 'generateDropdownHtml')
                }, function (data) {
                    ke.app.initDropdown();
                });

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'updateContextMenu')
                });
            });

        },

        removeRecentLanguage: function (event) {
            var lang = $(this).prev().attr('val');

            ke.ext.util.storageUtil.requestBackgroundOption('spliceBySearch', ["recently_used_lang", lang]);

            event.stopPropagation();

            $(this).parent().slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'));
            $('.lang-' + lang).removeClass('hidden');

            ke.ext.util.storageUtil.requestBackgroundOption('isEmptyArray', ['recently_used_lang'], function (is_empty) {
                if (is_empty) {
                    $('.group').slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'), function () {
                        if (ke.ui.dropdown.data.openedOptionsSerial === 1) {
                            ke.particles.scrollbars.model.setupFromWindowDropdownScroll();
                        } else if (ke.ui.dropdown.data.openedOptionsSerial === 2) {
                            ke.particles.scrollbars.model.setupToWindowDropdownScroll();
                        }
                    });
                }
            });
        }
    });

})();