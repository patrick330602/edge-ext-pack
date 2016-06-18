/* Kumquat Hub Options Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.util.langUtil',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.tpl',
            'ext.dom',
            'ext.input',

            'particles.sett_trans_combo.stcView',
            'particles.sett_trans_combo.stcModel',
            'particles.sett_tabber.tabView',
            'particles.sett_tabber.tabModel',
            'particles.scrollbars.sModel',
            'particles.lang_selectors.lsView',

            'ui_views.i18n',
            'ui_views.visibility',

            'ui_components.dropdown.dropdown',
            'ui_components.scrollbar.scrollbar',
            'ui_components.ss_selector.ss_selector'
        ],

        callbacksInitialization: {},
        temp: {
            combos: 0
        },

        share_links: {
            fb: 'http://www.facebook.com/sharer/sharer.php?u=<%=link%>',
            tw: 'https://twitter.com/intent/tweet?url=<%=link%>&text=<%=text%>&via=insttranslate',
            vk: 'https://vk.com/share.php?url=<%=link%>',
            gp: 'https://plus.google.com/share?url=<%=link%>'
        },

        store_links: {
            chrome: 'https://chrome.google.com/webstore/detail/instant-translate-transla/ihmgiclibbndffejedjimfjmfoabpcke',
            //chromepr: 'https://chrome.google.com/webstore/detail/instant-translate-pro/jlchdnnckapmdfniehlbbeaplhpjjogn',
            opera: 'https://addons.opera.com/de/extensions/details/instant-translate-2',
            edge: 'https://insttranslate.com/browsers'
        },

        init: function () {
            var that = this;

            ke.import('s:ui_components.dropdown_narrow', function () {
                ke.ui_views.i18n.setSettingsTitle();

                ke.ui.ss_selector.init(ke.app.handlers.stateChangeCallbacks);

                $('.ss-button').each(function () {
                    var option = $(this).data('option');
                    ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', [option], function (is_true) {
                        ke.ui.ss_selector.setState(option, is_true);
                    });
                });

                ke.particles.sett_tabber.view.displayCurrentTab(1);

                // Render the list
                ke.particles.sett_trans_combo.view.renderAllCombinations(function () {
                    that.initCombinationsDropdown();
                });
                ke.app.render.events.bindCombinationRemoval();
                ke.app.render.events.bindCombinationAddition();

                ke.particles.sett_trans_combo.model.ctrlComboVisibility();

                ke.app.render.events.bindCombinationChange();
                ke.app.render.events.tabChange();
                ke.app.render.events.clickableLabel();

                ke.app.render.events.bindBeforeUnload();

                $('.mail-button').attr('href', $('.mail-button').attr('href') + ke.currentBrowser);

                /* === Start of showing promotion === */

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getPromotionalTableButtons')
                }, function (data) {
                    if (data.buttons_code) {
                        $('.promo-layout').html(data.buttons_code);
                    }
                });

                /* Sharing */

                if (!ke.ext.util.storageUtil.isTrueOption('mon_is_cis')) {
                    $('.vk-button').remove();
                }

                $('.share-button').on('click', ke.app.handlers.showSharingWindow);

                /* Platform- and country-dependant */

                if (ke.IS_CHROME) {
                    $('.monetization-block').show();
                    $('.opt-in-button').remove();

                    ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['mon_is_cis'], function (is_cis) {
                        if (is_cis) {
                            $('#Tour_MonDesc').attr('id', 'Tour_MonCisDesc');
                        }
                    });
                }

                if (ke.IS_CHROME_PRO) {
                    $('.chrome-pro').remove();
                }

                ke.ui_views.i18n.init();
            });
        },

        initCombinationsDropdown: function (opt) {
            ke.ui.dropdown.init(
                ke.particles.sett_trans_combo.model.onComboDropdownChange,
                [ke.particles.sett_trans_combo.model.onComboDropdownOpen, ke.EF],
                ke.particles.sett_trans_combo.view.getComboVariants,
                opt || undefined,
                function () {
                }
            );
        }
    });

})();