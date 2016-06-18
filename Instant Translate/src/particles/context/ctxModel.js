(function (undefined) {

    var getLangSetByMenuId = function (id) {
        return ke.app.temp.menus[id];
    };

    pl.extend(ke.particles.context.model, {
        onMenuClick: function (info, tab) {
            var data = getLangSetByMenuId(info.menuItemId);

            if (data != null) {
                var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');

                if (combinations[data.combo].action == 1) {
                    var to_check = [];
                    if (info) to_check.push(info.srcUrl);
                    if (tab) to_check.push(tab.url);

                    var pdf = false;
                    var local_file = false;
                    pl.each(to_check, function (k, v) {
                        if (v && v.indexOf('.pdf') >= 0) {
                            pdf = true;
                        }
                    });

                    if (!pdf && info.srcUrl == "about:blank") {
                        local_file = true;
                    }

                    if (pdf || local_file) {
                        window.open("../public/pdf_tooltip.html#" + data.from + "|" + data.to + "|" + info.selectionText, "_blank", "resizable=no, scrollbars=no, titlebar=no, width=337, height=300, top=10, left=10");
                    } else {
                        chrome.tabs.sendMessage(tab.id, {
                            action: ke.processCall('app', 'trans', 'displayAsTooltip'),
                            message: info.selectionText,
                            from: data.from,
                            to: data.to
                        });
                    }
                } else if (combinations[data.combo].action === 2) {
                    chrome.tabs.create({
                        url: ke.ext.googleApi.getTranslationPageLink(info.selectionText, data.from, data.to),
                        active: true
                    });
                }
            }
        }
    });

})();