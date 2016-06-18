/* Kumquat Hub Content Handlers
 * 
 **/

(function (undefined) {

    var isInput = function (el) {
        return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    };

    pl.extend(ke.app.handlers, {
        passInlineTranslation: 0,

        scanForProperCombination: function (e, callback, dblclick) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getKeyComboOptionActiveness'),
                event: ke.ext.event.getNecessaryInfo(e),
                identificator: 'tooltip',
                dblclick: dblclick
            }, function (activeness_data) {
                if (activeness_data.is_active) {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'option', 'isKeyCombo'),
                        identificator: 'tooltip',
                        event: activeness_data.old_data.event,
                        keys_down: ke.ext.event.keysDown,
                        dblclick: activeness_data.old_data.dblclick
                    }, function (combo_data) {
                        if (combo_data.old_data.dblclick || combo_data.is_active) {
                            callback(combo_data.combo, combo_data.from, combo_data.to, combo_data.old_data.event);
                        }
                    });
                }
            });

            return true;
        },

        hasFocusedInputs: function (doc) {
            doc = doc || document;
            var has_focus_elements = false;

            $(doc.body).find("*:focus").each(function () {
                if ($(this).is("input,textarea") || this.contentEditable == 'true') {
                    has_focus_elements = true;
                }
            });

            return has_focus_elements;
        },

        onDoubleClick: function (event, doc, iframe) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getDoubleClickOptionActiveness'),
                event: ke.ext.event.getNecessaryInfo(event),
                identificator: 'tooltip'
            }, function (activeness_data) {
                if (!activeness_data.is_active || ke.app.handlers.hasFocusedInputs(doc) || pl.empty(ke.particles.translate_ctt.model.getSelectedText())) {
                    return;
                }

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getMainLanguagePair'),
                    identificator: 'tooltip'
                }, function (l_data) {
                    if (ke.app.handlers.hasFocusedInputs(doc) || pl.empty(ke.particles.translate_ctt.model.getSelectedText())) {
                        return;
                    }



                    var active = document.activeElement;

                    ke.app.handlers.lastTranslationCallArgs.doc = doc;
                    ke.app.handlers.lastTranslationCallArgs.iframe = iframe;

                    ke.particles.translate_ctt.model.showTranslation(undefined, l_data.from_lang, l_data.to_lang, isInput(active) ? ke.ui.tooltip.help.getAllParams(active) : undefined, doc, iframe);
                });
            });
        },

        lastTranslationCallArgs: {
            from: null, to: null, text: null, doc: undefined, iframe: undefined, selection: null, selectionBB: null
        },

        onKeyCombinationClick: function (e, doc, iframe) {
            if (ke.app.handlers.hasFocusedInputs(doc)) {
                return;
            }

            return ke.app.handlers.scanForProperCombination(e, function (combo, from, to) {
                if (ke.app.handlers.passInlineTranslation) {
                    return --ke.app.handlers.passInlineTranslation;
                }

                var active = document.activeElement;

                //ke.app.handlers.lastTranslationCallArgs.from = from;
                //ke.app.handlers.lastTranslationCallArgs.to = to;
                ke.app.handlers.lastTranslationCallArgs.doc = doc;
                ke.app.handlers.lastTranslationCallArgs.iframe = iframe;

                ke.particles.translate_ctt.model.showTranslation(undefined, from, to, isInput(active) ? ke.ui.tooltip.help.getAllParams(active) : undefined, doc, iframe);
            }, false);
        },

        onKCClickInTextInput: function (e) {
            return ke.app.handlers.scanForProperCombination(e, function (combo, from, to) {
                e.preventDefault();
                ke.particles.translate_ctt.model.showTranslation(undefined, from, to, e.target);
                ++ke.app.handlers.passInlineTranslation;
            });
        },

        getListenValue: function (s, event) {
            var $where = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(event.target));

            if (s === 'orig') {
                var i = $where.find('.' + ke.getPrefix() + 'original-wrap .' + ke.getPrefix() + 'mv-text-part').html();
                if (!i) {
                    return $where.find('.' + ke.getPrefix() + 'original-wrap .' + ke.getPrefix() + 'tpart').html();
                } else {
                    return i;
                }
            } else if (s === 'trans') {
                var i = $where.find('.' + ke.getPrefix() + 'main-variant .' + ke.getPrefix() + 'mv-text-part').html();
                if (!i) {
                    return $where.find('.' + ke.getPrefix() + 'trans-wrap .' + ke.getPrefix() + 'tpart').html();
                } else {
                    return i;
                }
            }

            return '';
        },

        showOnGoogleTranslate: function (event) {
            var $where = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(event.target));
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'translate', 'getTranslationPageLink'),
                from: $where.find('.' + ke.getPrefix() + 'listen-original').data('from'),
                to: $where.find('.' + ke.getPrefix() + 'listen-translation').data('to'),
                text: ke.app.handlers.lastTranslationCallArgs.text
            }, function (data) {
                window.open(data.link, '_newtab');
            });
        },

        reverseTranslation: function (event) {
            if (ke.app.handlers.lastTranslationCallArgs.from != null
                && ke.app.handlers.lastTranslationCallArgs.to != null
                && ke.app.handlers.lastTranslationCallArgs.text != null) {
                ke.particles.translate_ctt.model.showTranslation(
                    ke.app.handlers.lastTranslationCallArgs.text,
                    ke.app.handlers.lastTranslationCallArgs.to,
                    ke.app.handlers.lastTranslationCallArgs.from,
                    undefined,
                    ke.app.handlers.lastTranslationCallArgs.doc,
                    ke.app.handlers.lastTranslationCallArgs.iframe,
                    ke.app.handlers.lastTranslationCallArgs.selection,
                    ke.app.handlers.lastTranslationCallArgs.selectionBB
                );
            }
        },

        highlight: function (event) {
            $('body').highlight(ke.app.handlers.getListenValue('orig', event), {wordsOnly: true});

            setTimeout(function () {
                $('body').unhighlight();
            }, 750);
        },

        unpin: function (event) {
            var $tooltip = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(event.target));

            $tooltip.addClass(ke.getPrefix() + 'unpinned');
            $tooltip.find('.' + ke.getPrefix() + 'arrow').remove();

            //
            //
            // Update the contents of tooltip

            var time = 175;
            $tooltip.find('.' + ke.getPrefix() + 'utils').slideUp(time, 'easeInOutQuint');
            setTimeout(function () {
                $tooltip.find('.' + ke.getPrefix() + 'unpinned-utils').css('display', 'block');
                $tooltip.find('.' + ke.getPrefix() + 'original-wrap').slideDown(time, 'easeInOutQuint', function () {
                    var ttid = $tooltip.data('ttid');
                    ke.particles.scrollbars.model.setupHelpSelectedScroll(ttid);
                    ke.ui.tooltip.helpSelected.resizeTooltip(ttid, true);
                });
            }, time - 75);

            //
            //
            // Dragging

            var startPosXInTt = 0, startPosYInTt = 0;

            var tt_move = function (event) {
                $tooltip.css({
                    left: event.clientX - startPosXInTt,
                    top: event.clientY - startPosYInTt
                });
            };

            $tooltip.find('.' + ke.getPrefix() + 'unpinned-utils').on('mousedown', function (event) {
                if (event.which === 1) {
                    startPosXInTt = event.clientX - parseInt($tooltip.css('left'));
                    startPosYInTt = event.clientY - parseInt($tooltip.css('top'));

                    $(window).on('mousemove', tt_move);
                }
            });
            $(window).on('mouseup', function () {
                $(window).off('mousemove', tt_move);
            });

            //
            //
            // Closing

            $('.' + ke.getPrefix() + 'close-unpinned').on('click', function (event) {
                var $to_close_tooltip = $(ke.ext.util.selectorsUtil.getTooltipWrapRecursively(event.target));
                $to_close_tooltip.fadeOut(125, 'easeInOutQuint', function () {
                    $(this).remove();
                });
            });
        },

        _processEventHandlers: {
            app: {
                trans: {
                    displayAsTooltip: function (data) {
                        if (pl.empty(ke.app.temp.windows)) {
                            ke.particles.translate_ctt.model.showTranslation(data.message, data.from, data.to);
                        } else {
                            try {
                                pl.each(ke.app.temp.windows, function (k, v) {
                                    if (!v || !v.getSelection() || !v.getSelection().toString()) {
                                        return;
                                    }

                                    ke.particles.translate_ctt.model.showTranslation(data.message, data.from, data.to, undefined, ke.app.temp.windows[k], ke.app.temp.iframes[k]);
                                });
                            } catch (e) {
                            }
                        }
                    }
                }
            }
        }
    });
})();