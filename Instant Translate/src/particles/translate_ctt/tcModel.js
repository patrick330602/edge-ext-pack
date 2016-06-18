(function (undefined) {

    pl.extend(ke.particles.translate_ctt.model, {
        currentSelectedText: '',

        getCurrentSelectedText: function () {
            return ke.particles.translate_ctt.model.currentSelectedText;
        },

        setCurrentSelectedText: function (text) {
            ke.particles.translate_ctt.model.currentSelectedText = text;
        },

        getSelection: function (win) {
            return (win || window).getSelection();
        },

        getSelectedText: function (win) {
            return pl.trim(this.getSelection(win).toString());
        },

        getTranslation: function (t, c, from, to, predef, id) {
            if (pl.empty(t) || ke.app.flags.isTranslating) {
                return;
            }

            ke.app.flags.isTranslating = true;

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'translate', 'get'),
                identificator: 'tooltip',
                text: t,
                from: from,
                to: to,
                prefix: ke.getPrefix(),
                predef: predef,
                id: id,
                source: document.location.href
            }, function (data) {
                ke.app.flags.isCurrentTranslationMulti = data.isMulti;
                ke.app.flags.isTranslating = false;

                if (data.offline) {
                    c(true, data.old_data.id);
                } else {
                    c(false, data.old_data.id, ke.ext.tpl.compile(data.code, {
                        from: data.old_data.from,
                        to: data.old_data.to
                    }), data.old_data.predef, data.old_data.from, data.old_data.to, data.trans_translit);

                    ke.app.temp.currentDetectedLang = data.detected_lang || '';
                }
            });
        },

        display: function (is_offline, ttid, trans, predef, from, to, translit) {
            ke.ui.tooltip.helpSelected.toggleLoadingInTooltip(ttid, false);

            if (is_offline) {
                ke.ui.tooltip.helpSelected.toggleOfflineInTooltip(ttid, true);
                return;
            }

            ke.ui.tooltip.helpSelected.setTooltipContents(ttid, trans/*, ke.app.handlers.lastTranslationCallArgs.selectionBB || this.getSelection(doc), predef, doc, iframe*/);

            // delays cause scrollbar glitches
            setTimeout(function () {
                if (pl('.' + ke.getPrefix() + 'top-arrow').css('display') === 'block') {
                    pl('#' + ke.getPrefix() + 'tr-scrollbar').addClass(ke.getPrefix() + 'top-scroll');
                }

                if (ke.ext.util.langUtil.supportsTranslit(to)
                    && !pl.empty(translit[1])
                    && translit[0]) {

                    $('.' + ke.getPrefix() + 'translit-row').slideDown(125, 'easeInOutCirc', function () {
                        ke.ui.tooltip.helpSelected.resizeTooltip(ttid);
                        ke.particles.scrollbars.model.setupHelpSelectedScroll();
                    });
                } else {
                    ke.ui.tooltip.helpSelected.resizeTooltip(ttid);
                    ke.particles.scrollbars.model.setupHelpSelectedScroll();
                }

                if (ke.ext.util.langUtil.isHieroglyphical(to)) {
                    $('.' + ke.getPrefix() + 'content-layout').addClass(ke.getPrefix() + 'non-bold-contents');
                } else {
                    $('.' + ke.getPrefix() + 'content-layout').removeClass(ke.getPrefix() + 'non-bold-contents');
                }

                ke.app.render.events.listen();
                ke.app.render.events.listenSynonym();
                ke.app.render.events.showOnGoogleTranslate();
                ke.app.render.events.reverseTranslation();
                ke.app.render.events.highlight();
                ke.app.render.events.unpin();
            }, 10);
        },

        showTranslation: function (text, from, to, predef, win, iframe, predef_selection, predef_selection_bb) {
            var that = this;

            var selected_text = text || this.getSelectedText(win) || predef_selection.toString();

            ke.app.handlers.lastTranslationCallArgs.text = selected_text;
            ke.app.handlers.lastTranslationCallArgs.from = from;
            ke.app.handlers.lastTranslationCallArgs.to = to;

            if (!selected_text) {
                return;
            }

            var selection = this.getSelection(win);

            if (selection && selection.toString()) {
                ke.app.handlers.lastTranslationCallArgs.selection = $.extend(true, {}, selection);
                ke.app.handlers.lastTranslationCallArgs.selectionBB = $.extend(true, {
                    scrollX: window.scrollX,
                    scrollY: window.scrollY
                }, selection.getRangeAt(0).getBoundingClientRect());
            } else if ((!selection || !selection.toString()) && predef_selection && predef_selection.toString()) {
                selection = predef_selection;
            } else {
                return;
            }

            var id = ke.ui.tooltip.helpSelected.showTooltip(predef_selection_bb || selection, win, iframe);
            ke.ui.tooltip.helpSelected.toggleLoadingInTooltip(id, true);

            this.getTranslation(selected_text, function (is_offline, id, t, predef, from, to, translit) {
                $('.' + ke.getPrefix() + 'tooltip-' + id)
                    .find('.' + ke.getPrefix() + 'listen-original')
                    .data('from', from);

                that.display(is_offline, id, t, predef, from, to, translit);
            }, from, to, predef, id);
        }
    });

})();