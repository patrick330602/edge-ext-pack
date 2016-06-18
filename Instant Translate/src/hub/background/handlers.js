/* Kumquat Hub Background Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        _processEventHandlers: {
            app: {
                opt: {},
                translate: {},
                audio: {},
                option: {},
                commands: {}
            }
        },

        getGeneratedCallback: function (data, name, port) {
            return function (o) {
                port.postMessage(pl.extend(o || {}, {
                    old_data: data,
                    action: data.identificator
                        ? ke.processCall('callback', data.identificator, name)
                        : ke.processCall('callback', name)
                }));
            };
        },

        generateDropdownHtml: function (callback) {
            ke.particles.lang_selectors.view.getDropdownHtml(ke.particles.lang_selectors.view.TYPES.FROM, 1, null, function (from_gen) {
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.num', from_gen.num);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.code', from_gen.code);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'from.select', from_gen.select);
            }, true);

            ke.particles.lang_selectors.view.getDropdownHtml(ke.particles.lang_selectors.view.TYPES.TO, 2, null, function (to_gen) {
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.num', to_gen.num);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.code', to_gen.code);
                ke.ext.util.storageUtil.setJsonField('dropdown_html', 'to.select', to_gen.select);
            }, true);
        }
    });

})();