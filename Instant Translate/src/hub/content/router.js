/* Kumquat Hub Content Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.tpl',
            'ext.event',
            'ext.audio',
            'ext.dom',
            'ext.googleApi',
            'ext.util.selectorsUtil',
            'ext.util.langUtil',

            'particles.listen.lModel',
            'particles.translate_ctt.tcModel',
            'particles.scrollbars.sModel',

            'ui_components.scrollbar.scrollbar',
            'ui_components.tooltip.helpSelected'
        ],

        callbacksInitialization: {},

        flags: {
            isCurrentTranslationMulti: false,
            tt_transUtterancePermission: false,
            isPlayingTooltipTrans: false
        },

        temp: {
            iframes: [],
            windows: [],
            documents: [],
            currentDetectedLang: ''
        },

        init: function () {
            ke.ext.event.listen(ke.EF, ke.EF, ke.EF);

            //ke.app.render.events.onKCClickInTextInput();
            ke.app.render.events.onKeyCombinationClick();

            ke.app.initBackgroundEventListener();

            //
            // Greedy block of code

            if (ke.IS_CHROME) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'isMonetizationOn')
                }, function (data) {
                    if (data.is_cis) {
                        ke.import('ext.ps.sovetnik-inject-content');
                    }
                });
            }
        },

        initBackgroundEventListener: function () {
            chrome.runtime.onMessage.addListener(function (data) {
                var parts = ke.parseProcessCall(data.action);
                (ke.app.handlers._processEventHandlers[parts.lib][parts.cmd][parts.exact] || ke.EF)(data);
            });
        }
    });

})();