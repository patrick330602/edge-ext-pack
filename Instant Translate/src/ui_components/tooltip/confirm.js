(function (undefined) {

    ke.import('templates.confirmTooltip');
    ke.import('ui_components.tooltip.simple');
    ke.import('s:ui_components.tooltip.confirm');

    pl.extend(ke.ui.tooltip.confirm, {
        temp: {
            callback: ke.EF
        },

        _createPrompt: function (data, margin_top) {
            return ke.ui.tooltip.simple.create(ke.ext.tpl.compile(ke.templates.confirmTooltip, {
                headline: data[0],
                text: data[1],
                positive_button: data[2],
                negative_button: data[3]
            }), 'center', margin_top, 400, 150, false);
        },

        _bindPositiveAnswer: function () {
            pl('.pos-but').unbind().bind('click', function () {
                ke.ui.tooltip.confirm.temp.callback(true);
                ke.ui.tooltip.confirm._finishEnquire();
            });
        },

        _bindNegativeAnswer: function () {
            pl('.neg-but', ke.ui.tooltip.simple.Id).bind('click', function () {
                ke.ui.tooltip.confirm.temp.callback(false);
                ke.ui.tooltip.confirm._finishEnquire();
            });
        },

        _finishEnquire: function () {
            ke.ui.tooltip.simple.close(true);
            ke.ui.tooltip.confirm.temp.callback = ke.EF;
        },

        ask: function (data, callback, margin_top) {
            this.temp.callback = callback;

            var prompt = this._createPrompt(data, margin_top || 'center');
            var that = this;

            setTimeout(function () {
                pl('body').append(prompt.get());
                ke.ui.tooltip.simple._computeAndAdjustPosition(prompt, 'center', 'center');
                that._bindPositiveAnswer();
                that._bindNegativeAnswer();
            }, 20);
        }
    });

})();