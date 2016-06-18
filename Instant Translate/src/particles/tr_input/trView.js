(function (undefined) {

    pl.extend(ke.particles.tr_input.view, {
        displaySaveValue: function (callback) {
            ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['saved_val'], function (val) {
                pl('.translation-input').val(val).caretToEnd();
                callback(pl.empty(val));
            });
        }
    });

})();