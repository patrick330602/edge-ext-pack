(function (undefined) {

    ke.import('templates.helpTooltip');
    ke.import('ui_components.tooltip.simple');

    if (ke.section !== 'content') {
        ke.import('s:ui_components.tooltip.help');
    }

    var Y_OFFSET = 10;
    var arrowXOffset = 0;

    pl.extend(ke.ui.tooltip.help, {
        setXOffset: function (offset) {
            arrowXOffset = offset;
        },

        show: function (text, e) {
            var elementPosition = ke.ext.dom.getPosition(e);
            var left = elementPosition[0];
            var top = elementPosition[1];
            var params = ke.ui.tooltip.help.getOParamsInstance(e);

            ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.helpTooltip, {
                content: text
            }), -100, -100, 250, 200, document);

            setTimeout(function () {
                ke.ui.tooltip.help.attachArrows();

                var ap = ke.ui.tooltip.help.computeArrowPosition(left, top, params);
                ke.ui.tooltip.help.computeTooltipPosition(left, top, params, function (tp) {
                    ke.ui.tooltip.help.applyArrowPosition(ap);
                    ke.ui.tooltip.help.applyTooltipPosition(tp);
                });
            }, 25);
        },

        getOParamsInstance: function (g) {
            g.width = g.width || 0;
            g.height = g.height || 0;
            g.pl = g.pl || 0;
            g.pr = g.pr || 0;
            g.pt = g.pt || 0;
            g.pb = g.pb || 0;
            return g;
        },

        getAllParams: function (e) {
            return pl.extend(ke.ui.tooltip.help.computeOParams(e), {
                left: ke.ext.dom.getPosition(e)[0],
                top: ke.ext.dom.getPosition(e)[1]
            });
        },

        computeOParams: function (e) {
            return ke.ui.tooltip.help.getOParamsInstance({
                width: parseInt(pl(e).css('width')),
                height: parseInt(pl(e).css('height')),
                pl: parseInt(pl(e).css('padding-left')),
                pr: parseInt(pl(e).css('padding-right')),
                pt: parseInt(pl(e).css('padding-top')),
                pb: parseInt(pl(e).css('padding-bottom'))
            });
        },

        attachArrows: function () {
            pl(ke.ui.tooltip.simple.Id).prepend(
                pl('<div>')
                    .addClass('TnITTtw-t').addClass(ke.getPrefix() + 'arrow').addClass(ke.getPrefix() + 'top-arrow')
                    .get()
            );

            pl(ke.ui.tooltip.simple.Id).append(
                pl('<div>')
                    .addClass('TnITTtw-t').addClass(ke.getPrefix() + 'arrow').addClass(ke.getPrefix() + 'bottom-arrow')
                    .get()
            );
        },

        computeArrowPosition: function (el, ix, iy, oparams) {
            var top = 0;
            var onBottom = true;

            var tooltip_width = 0;
            var tooltip_height = 0;

            $(el.get()).measure(function () {
                tooltip_width = this.width();
                tooltip_height = this.height();
            });

            var absolute_selection_top_scroll = iy + document.body.scrollTop;
            var selection_absolute_height = oparams.height + oparams.pt + oparams.pb;

            top = absolute_selection_top_scroll - tooltip_height - Y_OFFSET;

            if (top - document.body.scrollTop < 1) {
                onBottom = false;
            }

            var selection_absolute_width = oparams.height + oparams.pl + oparams.pr;
            var cursorLeftMargin = (tooltip_width - selection_absolute_width) / 2 + arrowXOffset;

            return [onBottom ? 'bottom' : 'top', cursorLeftMargin];
        },

        computeTooltipPosition: function (el, ix, iy, oparams, callback) {
            var pos = [0, 0];

            var tooltip_width = 0;
            var tooltip_height = 0;

            $(el.get()).measure(function () {
                tooltip_width = this.width();
                tooltip_height = this.height();

                var absolute_selection_left_scroll = ix + document.body.scrollLeft;
                var absolute_selection_top_scroll = iy + document.body.scrollTop;

                var selection_absolute_width = oparams.width + oparams.pl + oparams.pr;
                var selection_absolute_height = oparams.height + oparams.pt + oparams.pb;

                pos[0] = absolute_selection_left_scroll - tooltip_width / 2 + selection_absolute_width / 2;
                pos[1] = absolute_selection_top_scroll - tooltip_height - Y_OFFSET;

                // Horizontal alignment
                if (pos[0] - document.body.scrollLeft < 1) {
                    pos[0] = absolute_selection_left_scroll;
                } else if (pos[0] + tooltip_width > document.body.clientWidth) {
                    pos[0] = document.body.clientWidth - tooltip_width;
                }

                // A vertical one
                if (pos[1] - document.body.scrollTop < 1) {
                    pos[1] = absolute_selection_top_scroll + selection_absolute_height + Y_OFFSET;
                }

                callback(pos)
            });
        },

        applyArrowPosition: function (c, wrap_class) {
            pl('.' + ke.getPrefix() + (wrap_class || 'help-selected-wrap')).addClass(ke.getPrefix() + 'has-' + c[0] + '-arrow');

            pl('.' + ke.getPrefix() + c[0] + '-arrow')
                .css('margin-left', c[1])
                .show();
        },

        applyTooltipPosition: function (el, pos) {
            var $el = $(el.get());
            var real_y = pos[1] - 5;
            var y_offset = 10;

            $el
                .css({
                    left: pos[0] - 7,
                    top: real_y - y_offset
                })
                .animate({
                    top: real_y
                }, 300, ke.getAnimType('slide_up'));
        }
    });

})();