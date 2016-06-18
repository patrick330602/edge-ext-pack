/* Kumquat Hub Options Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        gotIt: function (event) {
            window.close();
        },

        stateChangeCallbacks: {
            monetization: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'toggleMonetization'),
                    state: f
                });
            },

            'double_click': function (f) {
                ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['double_click', f]);
            }
        }
    });

})();