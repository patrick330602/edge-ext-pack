(function (undefined) {
    ke.import('ext.util.storageUtil');

    var COMBOS = 'Shift+T,Alt+T'.split(',').reverse();

    // Names of keys which require localization
    // E.g., Ctrl => Strg
    var LOCALIZABLE = {
        de: ['Ctrl']
    };

    if (~window.navigator.appVersion.indexOf('Mac')) {
    }

    // Will be changed
    var langSelType = 2;
    var index = 1;

    pl.extend(ke.particles.sett_trans_combo.view, {
        getLastIndex: function () {
            return index - 1;
        },

        getCurrentIndex: function () {
            return index;
        },

        renderCombinationState: function (field, combo, index, id) {
            var $parent = $('.cs-' + index).find('.' + id + '-state');

            if (field != undefined) {
                $parent.find('.selected').removeClass('selected');
                $parent.find('.state-' + field).addClass('selected');
            }

            $parent.find('.state').on('click', function (event) {
                ke.particles.sett_trans_combo.model.combinationStateSelectorClicked.call(
                    this, event, ke.particles.sett_trans_combo.model.getCombinationItemData($parent.get(0)), id);
            });
        },

        renderCombination: function (from, to, main, is_new, combo, settings) {
            pl('.combination-list').find(main ? '.main-combinations' : '.add-combinations').append(
                ke.ext.tpl.compile(pl('.t-combinations').html(), {
                    from: from,
                    to: to,
                    combo: combo,
                    index1: index++,
                    index2: index++,
                    index3: index++,
                    main_class: main ? 'main-combo' : '',
                    new_identifier: is_new ? 'just-added' : ''
                })
            );

            for (var i = index - 2; i <= index; ++i) {
                pl('.opt-' + i).removeClass('templated');
            }

            if (!pl.empty(combo)) {
                pl('.combo-' + (index - 1))
                    .find('.combo-selector')
                    .html(ke.ext.event.getNameFromKeyCodeCombination(combo))
                    .removeClass('need-html-locale');
            }

            combo = main ? 'main' : combo;

            this.renderCombinationState(settings.context, combo, index - 1, 'context');
            this.renderCombinationState(settings.action, combo, index - 1, 'action');

            if (!main) {
                ke.app.temp.combos++;
            }
        },

        renderAllCombinations: function (callback) {
            var that = this;

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'getDecodedVal', args: ['add_trans_combinations']},
                {fn: 'getVal', args: ['trans_combination']}
            ], function (responses) {
                that.renderCombination(ke.ext.util.langUtil.getFromLang(), ke.ext.util.langUtil.getToLang(), true, false, responses[1].response, responses[0].response["main"]);

                for (var key in responses[0].response) {
                    if (key != 'main') {
                        that.renderCombination(responses[0].response[key].from, responses[0].response[key].to, false, false, key, responses[0].response[key]);
                    }
                }

                callback();

                ke.app.render.events.bindCombinationRemoval();
                ke.app.render.events.bindCombinationChange();
                ke.particles.sett_trans_combo.model.ctrlNewComboClass();
            });
        },

        // 1 2 4 5 7 8 ... - languages
        // 3 6 9 ... - combinations
        getComboVariants: function (num, data, callback) {
            var current_data = ke.particles.sett_trans_combo.model.getCombinationItemData(pl('.opt-' + num));
            langSelType = ke.particles.sett_trans_combo.model.isFromSel(num)
                ? ke.particles.lang_selectors.view.TYPES.FROM
                : ke.particles.lang_selectors.view.TYPES.TO;
            ke.particles.lang_selectors.view.fillDropdown(langSelType, num, current_data, callback);
        },

        windowId: 0,

        showCombinationChange: function (event) {
            var combo_id = $(this).parent().data('combo-id');
            var new_id = ++ke.particles.sett_trans_combo.view.windowId;
            var combo = $('.cs-' + combo_id).data('combo');

            pl('body').append(
                ke.ext.tpl.compile(pl('.t-combo-change-window').html(), {
                    window_id: new_id,
                    combo_id: combo_id
                })
            );

            ke.particles.sett_trans_combo.model.updateCurrentState(('' + combo).split('+'));

            $('.combo-change-layout').css('height', $(document).height());
            $('.ccw-combo-layout').on('click', ke.particles.sett_trans_combo.model.activateKeysDetection);
            $('.ccw-done').on('click', ke.particles.sett_trans_combo.model.closeCombinationChange);
            $('.ccw-close').on('click', ke.particles.sett_trans_combo.model.closeCombinationChange);
            $('.ccw-clear').on('click', ke.particles.sett_trans_combo.model.clearKeys);

            var $w = $('.w-' + new_id);
            var browser_window_height = $(window).height();
            var window_height = $w.height();
            var y_center = $(window).scrollTop() + (browser_window_height - window_height) / 2;
            var offset = 100;

            $w
                .show()
                .css({
                    'opacity': 0.0,
                    'top': y_center - offset
                })
                .animate({
                    'opacity': 1.0,
                    'top': y_center
                }, 300, 'easeInOutCubic');

            //ke.particles.sett_trans_combo.model.listenToCombinations();
        }
    });
})();