(function (undefined) {

    var prev_scroll_y;

    pl.extend(ke.particles.hist_list.model, {
        onItemMouseOver: function (e) {
            if (ke.app.canPerformActions()) {
                //var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);
                //pl('.i-' + id).addClass('hovered');
            }
        },

        onItemMouseOut: function (e) {
            //var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);
            //pl('.i-' + id).removeClass('hovered');
        },

        collapseAll: function () {
            $('.expanded').each(function () {
                ke.particles.hist_list.model.onItemClick({
                    target: this
                }, true);
            });
        },

        onItemClick: function (e, forced) {
            var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);

            var initScroll = function () {
                return;
                //ke.particles.hist_list.model.toggleListenWrap(id);
                ke.particles.scrollbars.model.setupHistoryPageScroll();
                var new_instance = ke.particles.scrollbars.model.getScrollInstance('page-scrollbar');
                new_instance.y = prev_scroll.y;
                new_instance.on_update();
            };

            if (ke.app.canPerformActions() || forced) {
                var isOnPlaqueClick = ke.ext.util.selectorsUtil.isMainVariantPlaque(e.target) || forced;
                var s = '.i-' + id;
                var prev_scroll = ke.particles.scrollbars.model.getScrollInstance('page-scrollbar');

                if (!$(s).hasClass('expanded')) {
                    $(s).addClass('expanded');
                    ke.app.temp.expanded.push(id);

                    $(s).find('.variants-wrap')
                        .css('opacity', 0)
                        .slideDown(ke.getAnimSpeed('slide_down'), ke.getAnimType('slide_down'))
                        .animate({opacity: 1}, ke.getAnimSpeed('fade_in'), ke.getAnimType('fade_in'))
                        .parent()
                        .find('.additional-info-wrap')
                        .css('opacity', 0)
                        .slideDown(ke.getAnimSpeed('slide_down'), ke.getAnimType('slide_down'), initScroll)
                        .animate({opacity: 1}, ke.getAnimSpeed('fade_in'), ke.getAnimType('fade_in'));

                    $(s).prev().addClass('before-expanded');
                } else if ($(s).hasClass('expanded') && isOnPlaqueClick) {
                    $(s).removeClass('expanded');
                    ke.ext.arr.delete(ke.app.temp.expanded, id);
                    $(s).find('.variants-wrap')
                        .slideUp(ke.getAnimSpeed('slide_up') * 1.5, ke.getAnimType('slide_up'))
                        .parent()
                        .find('.additional-info-wrap')
                        .slideUp(ke.getAnimSpeed('slide_up') * 1.25, ke.getAnimType('slide_up'), initScroll)
                        .parent().parent()
                        .prev()
                        .removeClass('before-expanded');
                }
            } else if (ke.app.flags.isTickerWrapActive) {
                ke.particles.hist_opt_delete.model.onTickerClick.call(pl('.i-' + id).find('.selection-ticker').get(), {}, 'item');
            }
        },

        toggleListenWrap: function (id, forced) {
            var req = '.i-' + id;
            if (pl.type(id, 'undef')) {
                req = '.history-list';
            }

            var is_active = $(req).find('.listen-sliding-wrap').hasClass('active-lsw') || forced;
            var sw = $(req).find('.listen-sliding-wrap').toggleClass('active-lsw');

            // Used only once on scroll loading
            sw.removeClass('invisible-sw');

            if (is_active) {
                sw.animate({
                    width: 0,
                    opacity: 0
                }, ke.getAnimSpeed('slide_up') * 1.755, ke.getAnimType('slide_up'), function () {
                    $(this).fadeOut(1);
                });
            } else {
                sw.animate({
                    width: 41,
                    opacity: 1
                }, ke.getAnimSpeed('slide_up') * 1.255, ke.getAnimType('fast_slide_up'), function () {
                    $(this).fadeIn(1, ke.getAnimType('fade_out'));
                });
            }
        },

        // There is no can-perform-check because
        // buttons are not shown in unperformable state
        onItemDeleteClick: function (e) {
            var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);

            e.stopPropagation();

            ke.ext.cache.deleteById(id, function (deleted) {
                if (deleted) {
                    ke.particles.hist_list.model.removeItemFromListById(id, ke.particles.hist_list.view.toggleEmptyHistoryCap);
                }
            });
        },

        removeItemFromListById: function (id, callback) {
            $('.i-' + id).prev().removeClass('before-expanded');
            $('.i-' + id)
                .find('.main-variant-wrap')
                .slideUp(ke.getAnimSpeed('slide_up'), ke.getAnimType('slide_up'), function () {
                    $(this).parent().parent().remove();
                    callback();
                })
                .fadeOut(ke.getAnimSpeed('fade_out'), ke.getAnimType('fade_out'));

            ke.ext.arr.delete(ke.app.temp.all_items, id);

            if (ke.app.temp.all_items.length === 0) {
                ke.particles.hist_list.model.fadeOutList();
            }
        },

        automaticUpdate: function () {
            if (!ke.app.flags.is_searching) {
                ke.particles.hist_list.view.populateHistoryList(function (noRetoggle, len) {
                    if (len > 0) {
                        // If it's in the deletion mode,
                        // let it remain in it
                        ke.app.initHistoryList(true);
                    }
                }, IDBKeyRange.lowerBound(ke.app.temp.item_ids[0] || 0, true), true);
            }
        },

        scrollTop: function () {

            //ke.particles.scrollbars.model.scrollTo('page-scrollbar', 0, ke.particles.hist_list.model.onPageScroll);
        },

        onPageScroll: function () {
            var y = $(this).scrollTop();
            var max_y = $(document.body).prop('scrollHeight');

            if (y + window.innerHeight + 250 >= max_y) {
                ke.particles.hist_list.model.showMoreItems(y);
            }

            var up_scroll = 15 - y;
            if (up_scroll < 0) {
                up_scroll = 0;
            }

            pl('.up-shortcut').css({
                marginTop: up_scroll
            })[(up_scroll === 0 ? 'add' : 'remove') + 'Class']('sticked-top');

            // When start showing the shortcut / starting at which offset at y axis
            var threshold = 50;
            if ((prev_scroll_y < threshold && y >= threshold) || (y < threshold && prev_scroll_y >= threshold)) {
                $('.up-shortcut')[y < threshold ? 'fadeOut' : 'fadeIn'](ke.getAnimSpeed('fade_out') * 1.789, ke.getAnimType('fade_out'));
            }

            ke.particles.hist_list.model.onScrollingStateChange(y);
            prev_scroll_y = y;
        },

        onScrollingStateChange: function (y) {
            var start_pos = 65;
            //var scroll = scroll || ke.particles.scrollbars.model.getScrollInstance('page-scrollbar');
            var top, opacity;

            if (y >= start_pos && ke.app.flags.isTickerWrapActive) {
                top = 0;
                opacity = 1;

                if (ke.app.flags.quick_access_shown) return;
                else ke.app.flags.quick_access_shown = true;
            } else if (!ke.app.flags.isTickerWrapActive || (ke.app.flags.isTickerWrapActive && y < start_pos)) {
                top = -59;
                opacity = 0;

                if (!ke.app.flags.quick_access_shown) return;
                else ke.app.flags.quick_access_shown = false;
            }

            $('.quick-access-bar').animate({
                top: top,
                opacity: opacity
            }, ke.getAnimSpeed('slide_down') * 2.25, ke.getAnimType('slide_down'));
        },

        showMoreItems: function (scrollTo) {
            var last_id = ke.app.temp.item_ids[ke.app.temp.item_ids.length - 1];

            if (!ke.app.flags.is_searching && last_id) {
                ke.particles.hist_list.view.populateHistoryList(function () {
                    ke.app.initHistoryList(true);
                }, IDBKeyRange.upperBound(last_id, true), false);
            }
        },

        getListenValue: function (s, e) {
            var id = ke.ext.util.selectorsUtil.getHistoryItemId(e.target);
            var text;

            if (s == 'orig') {
                text = $('.i-' + id).find('.input-particle .text-part').text();
            } else {
                text = $('.i-' + id).find('.main-output-particle .tpart').text();

                if (!text) {
                    text = $('.i-' + id).find('.main-output-particle .text-part').text();
                }
            }

            return text;
        },

        // Returns whether ec shown or not
        toggleListEndCap: function (locale) {
            var $hl = $('.history-list');
            var $ec = $('.ec-wrap');
            var $mb = $('.more-button');

            if ($('.history-item-wrap').length > 0) {
                $hl.show();
                $ec.hide();
                $mb.show();
                return false;
            } else {
                $hl.hide();
                $ec.find('.ec-text').html(ke.getLocale(locale));
                $ec.show();
                $mb.show();
                return true;
            }
        },

        fadeOutList: function () {
            this.toggleListEndCap('History_Content_List_OnEmpty');
        },

        // Ordinary clear of the list, without any effects
        clear: function () {
            ke.app.temp.expanded = [];
            ke.app.temp.selected = [];
            ke.app.flags.all_loaded_cap_exists = false;

            pl('.history-list').empty();
        },

        downloadHistoryAsCSV: function () {
            ke.idb.enum('it', 'history', Number.MAX_VALUE, null, false, function (items) {
                var raw_rows = [[
                    ke.getLocale('Csv_TimeDate'),
                    ke.getLocale('Csv_FromLang'),
                    ke.getLocale('Csv_IntoLang'),
                    ke.getLocale('Csv_Input'),
                    ke.getLocale('Csv_Translation'),
                    ke.getLocale('Csv_Transliteration'),
                    ke.getLocale('Csv_Synonyms'),
                    ke.getLocale('Csv_WhereTranslated')
                ]];

                items.forEach(function (v) {
                    var synonyms = [];
                    var sources = [];

                    v.it_resp[6].forEach(function (__) {
                        __.forEach(function (sv) {
                            synonyms.push(sv[0]);
                        });
                    });

                    for (var key in v.sources) {
                        sources.push(key);
                    }

                    raw_rows.push([
                        '"' + ke.ext.time.beautify(v.time) + '"',
                        ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(v.it_resp[5])),
                        ke.getLocale("Kernel_Lang_" + ke.ext.util.langUtil.getLangNameByKey(v.l_to)),
                        '"' + v.input + '"',
                        '"' + v.it_resp[3] + '"',
                        '"' + v.it_resp[4] + '"',
                        '"' + synonyms.join(', ') + '"',
                        '"' + sources.join('\n') + '"'
                    ]);
                });

                var rows = [];
                for (var i = 0; i < raw_rows.length; ++i) {
                    rows.push(raw_rows[i].join(','));
                }

                var csv = rows.join('\n');
                delete raw_rows;
                delete rows;

                ke.ext.file.downloadAsCSV(csv, 'Instant Translate History');
            });
        }
    });

})();