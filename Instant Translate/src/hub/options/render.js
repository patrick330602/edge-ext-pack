/* Kumquat Hub Options Render
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.render, {
        organize: {
        },

        events: {
            bindBeforeUnload: function () {
                window.addEventListener("beforeunload", ke.app.handlers.beforeUnload);
            },

            tabChange: function () {
                $('.tab').on('click', ke.particles.sett_tabber.model.setTab);
            },

            clickableLabel: function () {
                var labels = 'all-variants,instant-translation,key-combo,context,save,history,pamazon'.split(',');

                pl.each(labels, function (k, v) {
                    pl('.' + v + '-label').unbind().bind('click', ke.app.handlers.onLabelClick);
                });
            },

            bindCombinationRemoval: function () {
                pl('.combo-del-tick').unbind().bind('click', ke.particles.sett_trans_combo.model.removeCombination);
            },

            bindCombinationAddition: function () {
                pl('.new-combo-button').bind('click', ke.particles.sett_trans_combo.model.addCombination);
            },

            bindCombinationChange: function () {
                $('.combo-selector').off('click').on('click', ke.particles.sett_trans_combo.view.showCombinationChange);
            }
        }
    });

})();