/* Kumquat Hub Options Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        onLabelClick: function (e) {
            var _class = $(this).data('option');
            ke.ui.checkbox.externalElementClicked(ke.getSelectorConst('settings', _class[0].toUpperCase() + '_CHECK'));
        },

        // Remove all empty or partially filled combinations
        beforeUnload: function (event) {
            ke.ext.util.storageUtil.requestBackgroundOption('getDecodedVal', ['add_trans_combinations'], function (c) {
                for (var key in c) {
                    if (key != 'main' && (pl.empty(key) || (pl.empty(c[key]) || !c[key].from || !c[key].to))) {
                        ke.ext.util.storageUtil.requestBackgroundOption('deleteJsonElementByKey', ['add_trans_combinations', key]);
                    }
                }
            });
        },

        showSharingWindow: function (event) {
            var platform = $(this).data('pl');
            window.open(ke.ext.tpl.compile(ke.app.share_links[platform], {
                link: ke.app.store_links[ke.PLATFORM_CODE],
                text: ke.getLocale('Settings_ShareText')
            }), "Share Instant Translate", "fullscreen=no,width=520,height=480");
        },

        stateChangeCallbacks: {
            DEFAULT_CALLBACK: function (n, f) {
                ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', [n, f]);
            },

            'key_combo': function (f) {
                ke.particles.sett_trans_combo.model.onCCheckboxChange(f);
            },

            monetization: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'toggleMonetization'),
                    state: f
                });
            }
        }
    });

})();