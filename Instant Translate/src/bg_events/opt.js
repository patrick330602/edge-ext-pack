(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.opt, {
        generateDropdownHtml: function (data, sendResponse) {
            ke.app.handlers.generateDropdownHtml();
            sendResponse({
                old_data: data
            });
        },

        chainRequestBackgroundOption: function (data, sendResponse) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption(data.calls, sendResponse, true);
        }
    });

})();