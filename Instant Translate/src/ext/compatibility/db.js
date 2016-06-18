(function (undefined) {

    pl.extend(ke.ext.compatibility.db, {
        /*sync: function () {
         ke.db.execSql('SELECT * FROM ' + ke.getAppConst('t_history'), [], function (tx) {
         ke.app.flags.newlyInstalled = tx.rows.length === 0;

         for (var i = 0; i < tx.rows.length; ++i) {
         var output_it_format = ke.ext.googleApi.getInternalJSONFormat(tx.rows.item(i).output);
         var converted = JSON.stringify(output_it_format);
         var from_lang = tx.rows.item(i).l_from;

         if (from_lang === 'auto') {
         from_lang = output_it_format[5];
         }

         ke.db.execSql('UPDATE ' + ke.getAppConst('t_history') + ' SET l_from = ?, output = ? WHERE id = ?', [from_lang, converted, tx.rows.item(i).id], function (tx) {
         //console.log('converted one item... ok.');
         });
         }
         });
         },*/

        switchToIDB: function () {
            if (!window.openDatabase) {
                return;
            }

            ke.db.choose(ke.getAppConst('db'), '100 mB');

            ke.db.execSql('SELECT * FROM ' + ke.getAppConst('t_history'), [], function (tx) {
                var sql_items_len = tx.rows.length;
                var idb_items_len = 0;

                for (var i = 0; i < tx.rows.length; ++i) {
                    var item = tx.rows.item(i);

                    ke.idb.exists('it', 'history', ['input', item.input], {
                        l_from: item.l_from,
                        l_to: item.l_to
                    }, function (exists, primaryKey, existing_obj, pass_obj) {
                        if (!exists) {
                            ke.idb.add('it', 'history', pass_obj, 'translation', function () {
                                console.log('WebSQl->IDB for:', exists, pass_obj);
                            });
                        }

                        ++idb_items_len;
                    }, {
                        l_from: item.l_from,
                        l_to: item.l_to,
                        input: item.input,
                        it_resp: JSON.parse(item.output),
                        time: item.time,
                        sources: JSON.parse(item.sources)
                    });
                }

                var i = setInterval(function () {
                    console.log(idb_items_len, sql_items_len);
                    if (idb_items_len === sql_items_len) {
                        clearInterval(i);
                        ke.db.execSql('DROP TABLE ' + ke.getAppConst('t_history'), [], function () {
                            console.log('trunc history table after switch onto idb OK');
                        });
                    }
                }, 10);
            });
        }
    });

})();