(function (undefined) {
    ke.import('ext.event');

    var translateInputTimeout;
    var prevInput = '';

    var $ac_layout = $('.autocorrection-layout');
    var $ac_word = $ac_layout.find('.ac-word');
    var $input = $('.translation-input');

    pl.extend(ke.particles.translate.model, {
        ctrlInstantVisibility: function (a) {
            pl('.translate-button')[a]();
            pl('.action-bar').addClass('centerized-ab');
        },

        showLoading: function () {
            $('.action-button').animate({opacity: 0.0}, 250, 'easeOutCubic');
            $('.loading')
                .show()
                .animate({'margin-top': 0, opacity: 1.0}, 300, 'easeOutCubic', function () {
                    $(this).hide();
                });
        },

        hideLoading: function () {
            $('.action-button').animate({opacity: 1.0}, 250, 'easeOutCubic');
            $('.loading').animate({'margin-top': -10, opacity: 0.0}, 300, 'easeOutCubic', function () {
                $(this).hide();
            });
        },

        getTranslation: function (c, forced, val, retranslation) {
            if (ke.app.flags.isTranslating) {
                return;
            }

            var currentInput = pl.trim(val !== undefined ? val : $input.val());

            if (pl.empty(currentInput)) {
                ke.app.prevInput = currentInput;
                ke.ui_views.empty_trans_states.displayEmptiness();
                return;
            } else if (currentInput === prevInput && !forced) {
                return;
            } else {
                ke.app.prevInput = currentInput;
                ke.ui_views.empty_trans_states.displayWorkaround();
            }

            ke.app.flags.isTranslating = true;

            if (!retranslation) {
                ke.particles.translate.model.showLoading();
            }

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['autocorrection'], function (autocorrection) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'translate', 'get'),
                    identificator: 'window',
                    text: currentInput,
                    source: 'popup'
                }, function (data) {
                    ke.app.flags.isTranslating = false;
                    ke.particles.translate.model.hideLoading();

                    $('.offline-cap').hide();

                    if (data.offline) {
                        $('.offline-cap').show();
                        ke.particles.listen.model.ctrlRawVisibility(false, ke.ext.util.langUtil.getToLang());
                    } else if (data.error) {
                        c({
                            network_error: true
                        });
                    } else if (!retranslation && data.correction && autocorrection) {
                        ke.app.flags.isAutocorrected = true;
                        ke.app.temp.valueBeforeAutocorrection = data.old_data.text;

                        $input.val(data.correction);
                        ke.particles.tr_input.model.saveValueOnKeyup();

                        ke.particles.translate.model.getTranslation(c, false, data.correction, true);

                        _gaq.push(['_trackEvent', 'autocorrection', 'clicked']);
                    } else {
                        if (!retranslation) {
                            ke.app.flags.isAutocorrected = false;
                        }

                        data.code = ke.ext.tpl.compile(data.code, {
                            from: ke.ext.util.langUtil.getFromLang(),
                            to: ke.ext.util.langUtil.getToLang()
                        });
                        c(data);

                        _gaq.push(['_trackEvent', 'translation', 'clicked']);
                    }
                });
            });
        },

        routeTranslation: function (d) {
            if (d.network_error) {
                ke.ui_views.empty_trans_states.displayEmptiness();
                ke.particles.listen.model.ctrlRawVisibility(undefined, '');
                ke.particles.listen.model.ctrlTransVisibility();
                return;
            }

            ke.app.flags.isPrevTranslationMulti = ke.app.flags.isCurrentTranslationMulti;
            ke.app.flags.isCurrentTranslationMulti = d.isMulti;
            ke.app.temp.currentDetectedLang = d.detected_lang || '';
            ke.app.temp.currentFromLang = d.from;
            ke.particles.listen.model.ctrlRawVisibility(undefined, d.detected_lang);
            ke.particles.translate.model.displayTranslation(d.code, d);

            // If it was a click on the button, it would be great if the focus was returned
            // to the input
            pl('.translation-input').placeCaret(pl('.translation-input').getCursorPosition());
        },

        displayTranslation: function (code, d) {
            var toggleLayout = function () {
                $('.translation-layout').fadeOut(125, 'easeInOutCirc', function () {
                    $('.translation-layout').html(code).fadeIn(125, 'easeInOutCirc', function () {
                        ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['win_trans_type_shown'], function (win_trans_type_shown) {
                            setTimeout(function () {
                                ke.particles.scrollbars.model.setupTranslationScroll();
                            }, 150);
                            ke.particles.scrollbars.model.setupTranslationScroll();
                            ke.particles.listen.model.ctrlTransVisibility(false, d.to);
                            ke.particles.listen.model.ctrlSynonymVis(false, d.to);
                            ke.app.render.events.listenTranslation();
                            ke.app.render.events.listenSynonym();
                            ke.app.render.events.useSynonym();

                            if (d.from === 'auto') {
                                $('.from-lang .select')
                                    .html('')
                                    .append($('<div class="detected-ico"/>'))
                                    .append(ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(d.detected_lang)));
                            }

                            if (!ke.app.flags.isNarrow
                                && ke.app.flags.isAutocorrected) {

                                $ac_word.html(ke.app.temp.valueBeforeAutocorrection);
                                $ac_layout.show();

                                var ac_top = $('.action-bar').offset().top - $('.autocorrection-layout').outerHeight() - $('.left-part').offset().top;
                                $('.autocorrection-layout').css('top', ac_top);
                            } else {
                                $ac_layout.hide();
                            }

                            if (ke.ext.util.langUtil.supportsTranslit(d.to) && $('.translit-row .translit-main').html() != '') {
                                $('.translit-row').slideDown(125, 'easeInOutCirc');
                            }

                            if (ke.ext.util.langUtil.isHieroglyphical(d.to)) {
                                $('.translation-layout').addClass('non-bold-contents');
                            } else {
                                $('.translation-layout').removeClass('non-bold-contents');
                            }

                            if (!ke.app.flags.forceShowKeysSettingTooltip && !win_trans_type_shown) {
                                ke.app.flags.forceShowKeysSettingTooltip = true;

                                ke.app.render.organize.showKeysSettingTooltip();
                                ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['win_trans_type_shown', true]);
                            }
                        });
                    });
                });
            };

            if (ke.app.flags.isPrevTranslationMulti) {
                $('.v-closest-wrap').slideUp(50, ke.getAnimType('slide_up')).promise().done(function () {
                    $('.v-pos').fadeOut(25, ke.getAnimType('fade_out')).promise().done(function () {
                        $('.main-variant-wrap').slideUp(75, ke.getAnimType('slide_up')).promise().done(function () {
                            toggleLayout();
                        });
                    });
                });
            } else {
                toggleLayout();
            }
        },

        // ===========================
        //

        translateSimple: function (event, forced, val) {
            ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation, forced, val);
        },

        checkTranslationShortcut: function (event, type) {
            var nl = ke.ext.event.isDown('shift+enter');

            if (type == 1 && ke.ext.event.isDown((ke.isMac ? 'cmd' : 'ctrl') + '+enter')) {
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            } else if (type == 2 && !nl && ke.ext.event.is(ke.ext.event.getKeyCodeCombinationFromName('enter', true), event)) {
                event.preventDefault();
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            } else if (type == 2 && nl) {
                var val = $input.val();
                $input.val(val + '\n');
            }

            if (!pl.empty($input.val())) {
                ke.app.handlers.toggleRawControls(false);
            } else {
                ke.app.handlers.toggleRawControls(true);
            }
        },

        translateOnKeyCombinations: function (event) {
            if (ke.ext.event.isDown((ke.isMac ? 'cmd' : 'ctrl') + '+enter')) {
                event.stopPropagation();
                event.preventDefault();
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            }
        },

        translateOnKeyup: function () {
            clearTimeout(translateInputTimeout);

            if (!pl.empty($input.val())) {
                ke.app.handlers.toggleRawControls(false);
            } else {
                ke.app.handlers.toggleRawControls(true);
            }

            translateInputTimeout = setTimeout(function () {
                translateInputTimeout = null;
                ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation);
            }, 725);
        }
    });
})();
