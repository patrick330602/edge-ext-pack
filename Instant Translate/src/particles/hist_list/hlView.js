(function (undefined) {
    ke.import('ext.googleApi');

    pl.extend(ke.particles.hist_list.view, {
        populateHistoryList: function (callback, bounds, descending_order, no_retoggle) {
            ke.idb.enum('it', 'history', 25, bounds, descending_order, function (items) {
                if (items.length === 0) {
                    if (bounds && descending_order) {
                        //ke.particles.hist_list.view.appendAllItemsCap();
                        ke.app.flags.all_loaded_cap_exists = true;
                    } else if (!bounds) {
                        ke.particles.hist_list.view.toggleEmptyHistoryCap();
                    }
                } else {
                    items.forEach(function (item) {
                        ke.particles.hist_list.view.drawHistoryItem(item, undefined, descending_order);
                    });
                }

                callback(no_retoggle || false, items.length);
            });
        },

        drawHistoryItem: function (item, hl, descending_order) {
            if (~pl.inArray(item.id, ke.app.temp.item_ids)) {
                return;
            } else {
                ke.app.temp.item_ids[descending_order ? 'unshift' : 'push'](item.id);
            }

            var input = item.input;
            var json = item.it_resp;
            var output = ke.ext.googleApi.parseReceivedTranslation(json, true, '', false);
            var emptyVariants = output[0] ? '' : ' ' + 'collapsed';
            var time = ke.ext.time.beautify(item.time);

            output[2] = output[2] || '';

            if (!output[0]) {
                output[2] = output[1];
                output[1] = json[3];
            }

            if (!pl.type(hl, 'undef')) {
                input = ke.ext.string.highlight(input, hl);
                output[1] = ke.ext.string.highlight(output[1], hl);
            }

            var add_info = '';
            if (item.sources) {
                var sources = item.sources;

                var main = true;
                for (var source in sources) {
                    if (main) {
                        add_info += '<div class="main-item">';
                    }

                    var source_copy = source;
                    if (source != 'popup') {
                        source_copy = '<a class="source-link" href="' + source + '" target="_blank">' + decodeURI(source) + '</a>';
                    } else {
                        source_copy = ke.getLocale('History_InPopup');
                    }

                    add_info += '<div class="source-item"><div class="source">' + source_copy + '</div><div class="time-small">' + ke.ext.time.beautify(sources[source]) + '</div></div>';

                    if (main) {
                        main = false;
                        add_info += '</div><div class="rest-items">';
                    }
                }

                add_info += '</div>'
            } else {
                add_info = '<div class="time">' + time + '</div>';
            }

            pl('.history-list')[descending_order ? 'prepend' : 'append'](
                ke.ext.tpl.compile(ke.templates.historyListItem, {
                    id: item.id,
                    input: input,
                    main_output: output[1],
                    collapse_variants: emptyVariants,
                    variants: ke.ext.tpl.compile(output[2], {
                        from: item.l_from,
                        to: item.l_to
                    }),
                    sliding_wrap_visibility: !ke.app.flags.isTickerWrapActive ? 'invisible-sw' : '',
                    listen_wrap_visibility: pl.inArray(item.id, ke.app.temp.expanded) === -1 ? 'invisible-sw' : '',
                    selected: ~pl.inArray(item.id, ke.app.temp.selected) ? 'active-st' : '',
                    from_lang: item.l_from,
                    to_lang: item.l_to,
                    time: time,
                    sources: add_info,
                    lang_from: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.l_from)),
                    lang_to: ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(item.l_to))
                })
            );

            var $context = $('.i-' + item.id);
            ke.particles.listen.model.ctrlHistoryOrigVisibility(null, item.l_from, $context);
            ke.particles.listen.model.ctrlHistoryTransVisibility(null, item.l_to, $context);
            ke.particles.listen.model.ctrlSynonymVis(null, item.l_to, $context);

            ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['show_translit'], function (is_true) {
                if (is_true && $context.find('.translit-row .translit-main').html() != '') {
                    $context.find('.translit-row').show();
                } else {
                    $context.find('.translit-row').hide();
                }
            });

            if (pl.empty(output[2])) {
                pl('.i-' + item.id).find('.additional-info-wrap').addClass('stuck-to-top');
            }
        },

        toggleEmptyHistoryCap: function () {
            return ke.particles.hist_list.model.toggleListEndCap('History_Content_List_OnEmpty');
        }
    });

})();