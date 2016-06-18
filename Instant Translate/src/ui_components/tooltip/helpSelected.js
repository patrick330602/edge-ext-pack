(function (undefined) {
    ke.import('templates.helpSelectedTooltip');
    ke.import('ui_components.tooltip.simple');
    ke.import('ui_components.tooltip.help');

    pl.extend(ke.ui.tooltip.helpSelected, {
        _getSelectionParameters: function (s) {
            return s.getRangeAt ? $.extend({
                scrollX: window.scrollX,
                scrollY: window.scrollY
            }, s.getRangeAt(0).getBoundingClientRect()) : s;
        },

        _createTooltip: function (c, doc, ttid) {
            ke.ui.tooltip.help.setXOffset(3);
            return ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.helpSelectedTooltip, {
                content: c,
                prefix: ke.getPrefix(),
                ttid: ttid,
                l_original: ke.getLocale('Kernel_Original'),
                l_open: ke.getLocale('Kernel_OpenGt'),
                l_reversed: ke.getLocale('Kernel_Reverse'),
                l_unpin: ke.getLocale('Kernel_Unpin'),
                l_highlight: ke.getLocale('Kernel_Highlight'),
                l_loading: ke.getLocale('Kernel_Loading'),
                l_offline: ke.getLocale('Window_Offline'),
                title_highlight_button: ke.getLocale('Tooltip_Highlight'),
                title_open_link: ke.getLocale('Tootip_OpenLink'),
                title_listen_original: ke.getLocale('Tooltip_ListenOriginal'),
                title_show_reversed: ke.getLocale('Tooltip_ShowReversed'),
                title_unpin: ke.getLocale('Tooltip_Unpin')
            }), ttid, 0, 0, 450, 325, doc, true);
        },

        _createLoadingTooltip: function (doc) {
            ke.ui.tooltip.help.setXOffset(3);
            return ke.ui.tooltip.simple.create('<div class="' + ke.getPrefix() + 'loading">LOADING...</div>', 0, 0, 0, 450, 325, doc, true);
        },

        _addToggleClasses: function () {
            pl(ke.ui.tooltip.simple.Id + ' *').addClass('TnITTtw-t');
        },

        tooltipId: 0,

        toggleLoadingInTooltip: function (ttid, do_show) {
            $('.' + ke.getPrefix() + 'tooltip-' + ttid).find('.' + ke.getPrefix() + 'loading')[do_show ? 'show' : 'hide']();
        },

        toggleOfflineInTooltip: function (ttid, do_show) {
            $('.' + ke.getPrefix() + 'tooltip-' + ttid).find('.' + ke.getPrefix() + 'offline')[do_show ? 'show' : 'hide']();
        },

        showTooltip: function (selection, doc, iframe) {
            var ttid = ++ke.ui.tooltip.helpSelected.tooltipId;

            var sel_params = this._getSelectionParameters(selection);
            var tooltip = this._createTooltip('', doc, ttid);

            var left = 0;
            var top = 0;
            var params;

            if (!pl.type(iframe, 'undef')) {
                var iframePos = ke.ext.dom.getPosition(iframe);
                left = iframePos[0];
                top = iframePos[1];
            }

            left += sel_params.left - (window.scrollX - sel_params.scrollX);
            top += sel_params.top - (window.scrollY - sel_params.scrollY);
            params = ke.ui.tooltip.help.getOParamsInstance(sel_params);

            var ap = ke.ui.tooltip.help.computeArrowPosition(tooltip, left, top, params);

            ke.ui.tooltip.help.computeTooltipPosition(tooltip, left, top, params, function (tp) {
                ke.ui.tooltip.help.applyTooltipPosition(tooltip, tp);
                var $dest = $('body');
                if ($dest.length === 0) {
                    $dest = $('html');
                }

                $(tooltip).data('ttid', ttid);

                $dest.append(tooltip.get());

                ke.ui.tooltip.help.attachArrows();
                ke.ui.tooltip.help.applyArrowPosition(ap);

                ke.ui.tooltip.helpSelected._addToggleClasses();
            });

            return ttid;
        },

        setTooltipContents: function (ttid, code) {
            $('.' + ke.getPrefix() + 'content-layout-' + ttid).html(code);
            ke.ui.tooltip.helpSelected._addToggleClasses();
            //this.resizeTooltip(ttid, false);
        },

        resizeTooltip: function (ttid, unpinned) {
            var tt_height = $('.' + ke.getPrefix() + 'help-selected-wrap').height();
            var was_above = $('.' + ke.getPrefix() + 'help-selected-wrap').hasClass(ke.getPrefix() + 'has-bottom-arrow');

            var content_height = parseInt($('.' + ke.getPrefix() + 'content-layout-' + ttid).css('height'));

            var gen_height = content_height
                + 30
                + parseInt($('.' + ke.getPrefix() + 'tooltip-' + ttid)
                    .find('.' + ke.getPrefix() + (unpinned ? 'unpinned-' : '') + 'utils')
                    .css('height'));

            gen_height = gen_height < 298 ? gen_height : 298;

            $('.' + ke.getPrefix() + 'tooltip-' + ttid + ' .' + ke.getPrefix() + 'help-inside-layout').css('height', gen_height);

            if (gen_height < 298) {
                $('.' + ke.getPrefix() + 'trVisibleLayout').css('height', content_height);

                if (was_above) {
                    $('.' + ke.getPrefix() + 'tooltip-main-wrap')
                        .animate({
                            'top': parseInt($('.' + ke.getPrefix() + 'tooltip-main-wrap').css('top')) + tt_height - gen_height
                        }, 125);
                }
            }
        }
    });
})();