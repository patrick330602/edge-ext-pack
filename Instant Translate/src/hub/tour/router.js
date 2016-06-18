/* Kumquat Hub Options Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.storage',
            'ext.util.storageUtil',
            'ext.tpl',
            'ui_views.i18n',
            'ui_components.ss_selector.ss_selector'
        ],

        temp: {
            currentBid: 1
        },

        callbacksInitialization: {},

        init: function () {
            document.title = ke.getLocale("Tour_Title");

            ke.ui.ss_selector.init(ke.app.handlers.stateChangeCallbacks);

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['monetization']},
                {fn: 'isTrueOption', args: ['double_click']}
            ], function (responses) {
                ke.ui.ss_selector.setState('monetization', responses[0].response);
                ke.ui.ss_selector.setState('double_click', responses[1].response);
            });

            ke.app.render.events.gotIt();


            ke.app.render.organize.setupChangeableImages();

            /* === Start of showing promotion === */

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getPromotionalTableButtons')
            }, function (data) {
                if (data.buttons_code) {
                    $('.promo-layout').html(data.buttons_code);
                }
            });

            if (ke.IS_CHROME) {
                $('.monetization-block').show();
                $('.opt-in-button').remove();

                if (ke.ext.util.storageUtil.isTrueOption('mon_is_cis')) {
                    $('#Tour_MonDesc').attr('id', 'Tour_MonCisDesc');
                }
            }

            if (ke.IS_OPERA) {
                $('.chang-popup').attr('src', 'http://insttranslate.com/files/browser_tutorial_img/popup_1_opera.png');
            }

            ke.ui_views.i18n.init();
        }
    });

})();