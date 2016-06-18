(function (undefined) {

    ke.import("ext.string");

    pl.extend(ke.ext.cache, {
        saveOrUpdate: function (from, to, input, output, source, callback) {
            callback = callback || ke.EF;

            ke.idb.exists('it', 'history', ['input', input], {
                l_from: from,
                l_to: to
            }, function (exists, primaryKey, existing_obj) {
                if (exists) {
                    var updated_sources = existing_obj.sources || {};
                    updated_sources[source] = Date.now();

                    ke.idb.update('it', 'history', primaryKey, {
                        it_resp: output,
                        sources: updated_sources
                    }, function () {
                        callback();
                    });
                } else {
                    var sources = {};
                    sources[source] = Date.now();

                    ke.idb.add('it', 'history', {
                        l_from: from,
                        l_to: to,
                        input: input,
                        it_resp: output,
                        sources: sources,
                        time: Date.now()
                    }, 'translation', function () {
                        callback();
                    });
                }
            });
        },

        lookUpInCache: function (from, to, input, callback) {
            ke.idb.exists('it', 'history', ['input', input], {
                l_from: from,
                l_to: to
            }, function (exists, primaryKey, existing_obj) {
                if (!exists) {
                    callback(true);
                } else {
                    callback(false, existing_obj);
                }
            });
        },

        getIdListOfAll: function (callback) {
            ke.idb.enum('it', 'history', Number.MAX_VALUE, null, false, function (items) {
                var ids = [];
                for (var i = 0, len = items.length; i < len; ++i) {
                    ids.push(items[i].id);
                }
                callback(ids);
            });
        },

        deleteById: function (id, callback) {
            ke.idb.del('it', 'history', [id], function () {
                callback(true);
            });
        },

        deleteFewById: function (ids, callback) {
            ke.idb.del('it', 'history', ids, function () {
                callback(true);
            });
        }
    });

})();