(function (undefined) {

    var PROMO_ITEM = '<a class="app-button-link" href="<%=link%>" target="_blank">\
        <div class="app-button">\
            <div class="promo-platform-img platform-<%=platform%>"></div>\
            <div class="app-title"><%=platform_name%></div>\
        </div>\
    </a>';

    pl.extend(ke.app.handlers._processEventHandlers.app.option, {
        getPromotionalTable: function (data, sendResponse) {
            sendResponse({
                promotional_table: ke.app.promotional_table
            });
        },

        getPromotionalTableButtons: function (data, sendResponse) {
            var buttons = '';
            for (var app in ke.app.promotional_table) {
                if (ke.app.promotional_table[app][0] && app !== ke.PLATFORM_CODE) {
                    buttons += ke.ext.tpl.compile(PROMO_ITEM, {
                        link: ke.app.promotional_table[app][1],
                        platform: app,
                        platform_name: ke.getLocale('Promo_Short' + ke.capitalize(app))
                    });
                }
            }

            sendResponse({
                buttons_code: buttons
            });
        },

        toggleMonetization: function (data, sendResponse) {
            if (ke.IS_CHROME) {
                ke.ext.util.storageUtil.setOptionAsBoolean('monetization', data.state);

                if (data.state) {
                    ANALYTICS.moduleInitializer.enable();
                } else {
                    ANALYTICS.moduleInitializer.disable();
                }

                if (ke.ext.util.storageUtil.isTrueOption('mon_is_cis')) {
                    sovetnik.setRemovedState(!data.state);
                }
            }
        },

        getKeyComboOptionActiveness: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.util.storageUtil.isTrueOption('key_combo')
            });
        },

        getDoubleClickOptionActiveness: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.util.storageUtil.isTrueOption('double_click')
            });
        },

        getCurrentKeyCombo: function (data, sendResponse) {
            sendResponse({
                combo: ke.ext.util.storageUtil.getVal('trans_combination'),
                event: data.event
            });
        },

        isMainKeyCombo: function (data, sendResponse) {
            sendResponse({
                is_active: ke.ext.event.is(ke.ext.util.storageUtil.getVal('trans_combination'), data.event)
            });
        },

        isKeyCombo: function (data, sendResponse) {
            var is_active = false;
            var k, val = {from: '', to: ''};
            var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');

            for (var key in combinations) {
                if (ke.ext.event.isDown(key, ke.ext.event.IN_CODES, data.keys_down)) {
                    is_active = true;
                    k = key;
                    val = combinations[key];
                    break;
                }
            }

            if (!is_active) {
                is_active |= ke.ext.event.isDown(ke.ext.util.storageUtil.getVal('trans_combination'), ke.ext.event.IN_CODES, data.keys_down);

                if (is_active || data.dblclick) {
                    k = ke.ext.util.storageUtil.getVal('trans_combination');
                    val.from = ke.ext.util.langUtil.getFromLang();
                    val.to = ke.ext.util.langUtil.getToLang();
                }
            }

            sendResponse({
                is_active: !!is_active,
                combo: k,
                from: val.from,
                to: val.to
            });
        },

        getMainLanguagePair: function (data, sendResponse) {
            sendResponse({
                from_lang: ke.ext.util.langUtil.getFromLang(),
                to_lang: ke.ext.util.langUtil.getToLang()
            });
        },

        getToLang: function (data, sendResponse) {
            sendResponse({
                to_lang: ke.ext.util.langUtil.getToLang()
            });
        },

        ctrlContextActiveness: function (data, sendResponse) {
            var a = data.active;
            ke.app.flags.context = a;

            if (a) {
                ke.app.initContextMenu();
            } else if (!a) {
                chrome.contextMenus.removeAll();
            }
        },

        updateContextMenu: function (data, sendResponse) {
            ke.app.initContextMenu();
        },

        getCurrentSelectedText: function (data, sendResponse) {
            sendResponse({
                selected_text: ke.particles.context.model.currentSelectedText
            });
        },

        isMonetizationOn: function (data, sendResponse) {
            sendResponse({
                active: ke.ext.util.storageUtil.isTrueOption('monetization'),
                is_cis: ke.ext.util.storageUtil.isTrueOption('mon_is_cis')
            });
        }
    });

})();