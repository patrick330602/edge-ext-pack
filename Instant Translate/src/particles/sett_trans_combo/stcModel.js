(function (undefined) {
    ke.import('ext.util.storageUtil');

    var isSel = function (n, offset) {
        for (var i = 0 + offset; i <= n; i += 3) {
            if (i === n) {
                return true;
            }
        }
        return false;
    };

    pl.extend(ke.particles.sett_trans_combo.model, {
        onCCheckboxChange: function (flag) {
            ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['key_combo', flag]);
            ke.particles.sett_trans_combo.model.ctrlComboVisibility('slide' + (flag ? 'Down' : 'Up'));
        },

        onComboDropdownOpen: function (elem_index, ot) {
            ke.particles.scrollbars.model.setupComboOptionsDropdownScroll(elem_index, ot);
        },

        isFromSel: function (n) {
            return isSel(n, -2);
        },

        isComboSel: function (n) {
            return false;
        },

        getCombinationItemData: function (e) {
            e = e.get ? e : pl(e);
            if (!e.hasClass('combo-select')) {
                var i = 0;
                while (!(e = e.parent()).hasClass('combo-select') && ++i < 100) {
                }
            }
            return {
                node: e.get(),
                is_main: e.hasClass('main-combo'),
                from: e.attr('data-from'),
                to: e.attr('data-to'),
                combo: e.attr('data-combo'),
                index1: +e.attr('data-index1'),
                index2: +e.attr('data-index2'),
                index3: +e.attr('data-index3')
            };
        },

        onComboDropdownChange: function (serial, v, prev_val) {
            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (combinations) {
                var item = ke.particles.sett_trans_combo.model.getCombinationItemData('.opt-' + serial);
                var int_reinit = false;

                if (item.is_main) {
                    if (ke.particles.sett_trans_combo.model.isFromSel(serial)) {
                        ke.ext.util.langUtil.setFromLang(v);
                        $(item.node).attr('data-from', v);
                    } else {
                        ke.ext.util.langUtil.setToLang(v);
                        $(item.node).attr('data-to', v);
                    }

                    int_reinit = true;

                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'opt', 'generateDropdownHtml'),
                        serial: serial
                    }, function (data) {
                        ke.app.initCombinationsDropdown(data.old_data.serial);
                    });
                } else {
                    combinations[item.combo] = combinations[item.combo] || {};

                    if (ke.particles.sett_trans_combo.model.isFromSel(serial)) {
                        combinations[item.combo].from = v;
                        $(item.node).attr('data-from', v);
                    } else {
                        combinations[item.combo].to = v;
                        $(item.node).attr('data-to', v);
                    }
                }

                ke.ext.util.storageUtil.requestBackgroundOption('encodeAndSet', ['add_trans_combinations', combinations], function () {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'option', 'updateContextMenu')
                    });
                });

                if (!int_reinit) {
                    ke.app.initCombinationsDropdown(serial);
                }
            });
        },

        ctrlComboVisibility: function (forced_action, time) {
            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['key_combo'], function (is_true) {
                ke.ui_views.visibility.ctrl(
                    forced_action,
                    ke.getSelectorConst('settings', 'col_combo'),
                    is_true,
                    ke.particles.sett_trans_combo.model.ctrlComboVisibility,
                    time
                );
            });
        },

        removeCombination: function (event) {
            var item = ke.particles.sett_trans_combo.model.getCombinationItemData(this);

            ke.ext.util.storageUtil.requestBackgroundOption('deleteJsonElementByKey', ['add_trans_combinations', item.combo], function () {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'updateContextMenu')
                });
            });

            $(".combo-select[data-combo='" + item.combo + "']").animate({
                height: 0,
                opacity: 0
            }, ke.getAnimSpeed('fast_slide_up'), 'easeOutQuint', function () {
                $(this).remove();

                --ke.app.temp.combos;
                ke.particles.sett_trans_combo.model.ctrlNewComboClass();
            });
        },

        ctrlNewComboClass: function () {
            pl('.new-combo-button')[ke.app.temp.combos == 0 ? 'addClass' : 'removeClass']('no-combos');
        },

        addCombination: function (event) {
            if (ke.app.temp.combos < 9) {
                ke.particles.sett_trans_combo.view.renderCombination("", "", false, true, '', {
                    context: true,
                    action: 1
                });
                ke.app.initCombinationsDropdown('.cs-' + ke.particles.sett_trans_combo.view.getLastIndex());
                ke.app.render.events.bindCombinationRemoval();
                ke.app.render.events.bindCombinationChange();
                ke.particles.sett_trans_combo.model.ctrlNewComboClass();
            }
        },

        combinationStateSelectorClicked: function (event, data, id) {
            if (pl.empty(data.combo)) {
                return;
            }

            $(data.node).find('.' + id + '-state').find('.selected').removeClass('selected');
            $(this).addClass('selected');

            var option = $(this).data('id');

            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (combo) {
                if (data.is_main) {
                    combo['main'][id] = option;
                } else {
                    combo[data.combo][id] = option;
                }

                ke.ext.util.storageUtil.requestBackgroundOption('encodeAndSet', ['add_trans_combinations', combo], function () {
                    if (id == 'context') {
                        chrome.runtime.sendMessage({
                            action: ke.processCall('app', 'option', 'updateContextMenu')
                        });
                    }
                });
            });
        },

        validDownKeys: {},

        getDownKeysAsCombo: function (downKeys) {
            var keys = [];
            for (var key in downKeys || this.validDownKeys) {
                keys.push(ke.ext.event.getNicePresentationForKeyCode(key));
            }
            return keys.join('+');
        },

        activateKeysDetection: function (event) {
            $(this).addClass('ccw-active');

            ke.particles.sett_trans_combo.model.listenToCombinations();

            event.stopPropagation();

            $('.combo-change-window').on('click', ke.particles.sett_trans_combo.model.deactivateKeysDetection);
        },

        deactivateKeysDetection: function (event, forced) {
            if (forced || !$(this).hasClass('ccw-combo-layout')) {
                $('.ccw-combo-layout').removeClass('ccw-active');

                ke.ext.event.forget();

                $('.combo-change-window').off('click', ke.particles.sett_trans_combo.model.deactivateKeysDetection);
            }
        },

        clearKeys: function (event) {
            ke.particles.sett_trans_combo.model.validDownKeys = {};
            ke.particles.sett_trans_combo.model.updateCurrentState();
        },

        listenToCombinations: function () {
            ke.ext.event.listen(function (down_keys) {
                if (!ke.ext.event.isDenied(ke.particles.sett_trans_combo.model.getDownKeysAsCombo(down_keys))) {
                    ke.particles.sett_trans_combo.model.validDownKeys = $.extend({}, down_keys);
                }
            }, function (kc, mkc) {
                delete ke.particles.sett_trans_combo.model.validDownKeys[kc];
                delete ke.particles.sett_trans_combo.model.validDownKeys[mkc];
            }, this.updateCurrentState);
        },

        clearCurrentState: function () {
            ke.ext.event.keysDown = {};
            ke.particles.sett_trans_combo.model.validDownKeys = {};
        },

        placeholderToggleTimeout: null,

        getCurrentWindowSelectedKeyCodesAsString: function () {
            var keys = [];
            $('.w-' + ke.particles.sett_trans_combo.view.windowId).find('.ccw-combo').each(function () {
                keys.push($(this).data('code'));
            });
            return keys.join('+');
        },

        sortCurrentKeys: function (keys) {
            var ordered = [];

            if (!keys) {
                for (var key in ke.particles.sett_trans_combo.model.validDownKeys) {
                    ordered.push(key);
                }

                ordered.sort(function (a, b) {
                    if (ke.ext.event.isControlKey(a) && !ke.ext.event.isControlKey(b)) return -1;
                    if (ke.ext.event.isControlKey(b) && !ke.ext.event.isControlKey(a)) return 1;
                    return 0;
                });
            } else {
                ordered = keys;
            }

            $('.ccw-keys').empty();
            for (var i = 0, len = ordered.length; i < len; ++i) {
                $('.ccw-keys').append(
                    ke.ext.tpl.compile($('.t-ccw-combo').html(), {
                        code: ke.ext.event.checkMultipleKeyCodes(ordered[i]),
                        name: ke.ext.event.getNicePresentationForKeyCode(ordered[i])
                    })
                );
            }
        },

        updateCurrentState: function (keys) {
            ke.particles.sett_trans_combo.model.sortCurrentKeys(keys);

            if ($.isEmptyObject(ke.particles.sett_trans_combo.model.validDownKeys) && $.isEmptyObject(keys)) {
                $('.ccw-keys').hide();
                $('.ccw-placeholder').show();
                $('.ccw-clear').hide();
            } else {
                $('.ccw-placeholder').hide();
                $('.ccw-keys').show();
                $('.ccw-clear').show();
            }

            var denied = ke.ext.event.isDenied(ke.particles.sett_trans_combo.model.getDownKeysAsCombo(ke.ext.event.keysDown));

            clearTimeout(ke.particles.sett_trans_combo.model.placeholderToggleTimeout);
            ke.particles.sett_trans_combo.model.placeholderToggleTimeout = setTimeout(function () {
                if (denied) {
                    ke.particles.sett_trans_combo.model.blinkReservedCombo();
                }
            }, 450);
        },

        closeCombinationChange: function (event) {
            var $w = $('.w-' + ke.particles.sett_trans_combo.view.windowId);
            var combo_id = $w.data('combo-id');
            var item = ke.particles.sett_trans_combo.model.getCombinationItemData('.combo-' + combo_id);
            var new_combo = ke.particles.sett_trans_combo.model.getCurrentWindowSelectedKeyCodesAsString();

            if (item.is_main) {
                ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['trans_combination', new_combo], function () {
                    chrome.runtime.sendMessage({
                        action: ke.processCall('app', 'option', 'updateContextMenu')
                    });
                });
            } else {
                var prev_val = $('.combo-' + combo_id).data('combo');

                ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (combinations) {
                    combinations[prev_val] = combinations[prev_val] || {};
                    try {
                        combinations[prev_val].from = ke.ui.dropdown.getActiveOptionValue(item.index1);
                        combinations[prev_val].to = ke.ui.dropdown.getActiveOptionValue(item.index2);
                        combinations[prev_val].context = $('.cs-' + combo_id + ' .context-state .state.selected').data('id');
                        combinations[prev_val].action = +$('.cs-' + combo_id + ' .action-state .state.selected').data('id');
                    } catch (e) {
                    }
                    combinations[new_combo] = combinations[prev_val];

                    delete combinations[prev_val];

                    ke.ext.util.storageUtil.requestBackgroundOption('encodeAndSet', ['add_trans_combinations', combinations], function () {
                        chrome.runtime.sendMessage({
                            action: ke.processCall('app', 'option', 'updateContextMenu')
                        });
                    });
                });
            }

            $(item.node).attr('data-combo', new_combo);
            $('.combo-' + combo_id).removeClass('just-added').data('combo', new_combo);

            var $cs = $('.combo-' + combo_id).find('.combo-selector');
            if (new_combo) {
                $cs.html(ke.ext.event.getNameFromKeyCodeCombination(new_combo));
            } else {
                $cs.html(ke.getLocale('Settings_Combo'));
            }

            $w
                .animate({
                    'opacity': 0.0,
                    'top': parseInt($w.css('top')) - 100
                }, 300, 'easeInOutCubic', function () {
                    $(this).remove();
                });

            $w.parent()
                .animate({
                    'opacity': 0.0
                }, 300, 'easeInOutCubic', function () {
                    $(this).remove();
                });
        },

        blinkReservedCombo: function () {
            $('.ccw-combo-layout').addClass('ccw-blink');

            if (!$('.ccw-error').hasClass('proccessing')) {
                $('.ccw-error')
                    .addClass('proccessing')
                    .css({
                        'opacity': 0.0,
                        'margin-top': 10
                    })
                    .animate({
                        'opacity': 1.0,
                        'margin-top': 15
                    }, 300, 'easeInOutCubic');
            }

            setTimeout(function () {
                $('.ccw-combo-layout').removeClass('ccw-blink');

                $('.ccw-error').removeClass('proccessing').animate({
                    'opacity': 0.0,
                    'margin-top': 20
                }, 300, 'easeInOutCubic');
            }, 600);
        }
    });
})();