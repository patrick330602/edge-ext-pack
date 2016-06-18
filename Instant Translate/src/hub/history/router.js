/* Kumquat Hub History Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.util.langUtil',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.dom',
            'ext.event',
            'ext.tpl',
            'ext.googleApi',
            'ext.time',
            'ext.string',
            'ext.errorManager',
            'ext.cache',
            'ext.arr',
            'ext.file',

            'ui_components.tooltip.help',
            'ui_components.tooltip.confirm',

            'templates.historyListItem',
            'templates.historyEmptyCap',
            'templates.deleteSelectedButton',

            'particles.hist_search.hsView',
            'particles.hist_search.hsModel',
            'particles.hist_list.hlView',
            'particles.hist_list.hlModel',
            'particles.hist_opt_delete.hodModel',
            'particles.listen.lModel',
            'particles.scrollbars.sModel',

            'ui_components.tooltip.modal',

            'ui_views.i18n',
            'ui_views.multi_variant'
        ],

        temp: {
            window_height: 0,

            all_items: [],
            expanded: [],
            item_ids: [],
            selected: []
        },

        callbacksInitialization: {},

        flags: {
            is_searching: false,
            quick_access_shown: false,
            delete_mode: false,
            all_loaded_cap_exists: false,
            isPlayingTrans: false,
            isPlayingOriginal: false,
            isTickerWrapActive: true,
            isMouseDown: false,
            isShiftDown: false
        },

        init: function () {
            console.time('page');

            var self = this;

            //ke.app.render.organize.ctrlOptionsVisibility();
            ke.particles.hist_search.model.toggleClearTick();

            ke.ui_views.i18n.init();
            ke.ui_views.i18n.setHistoryTitle();

            ke.ext.cache.getIdListOfAll(function (ids) {
                self.temp.all_items = ids;
            });
            ke.particles.hist_list.view.populateHistoryList(function () {
                ke.app.initHistoryList();
                $(window).trigger('scroll');
            }, null, true);

            ke.app.render.events.onPageScroll();
            ke.app.render.events.toggleMouseOverOption();
            ke.app.render.events.enableDeleteMode();
            ke.app.render.events.onClearHistoryClick();
            ke.app.render.events.onDeleteSelectionClick();
            ke.app.render.events.onClearTickClick();
            ke.app.render.events.onSearchKeyRelease();
            ke.app.render.events.bindDeleteSelectionActions();
            ke.app.render.events.bindQuickAccessBarActions();
            ke.app.render.events.bindScrollingOnGoUpButton();
            ke.app.render.events.bindExport();

            if (ke.IS_CHROME_PRO) {
                // TODO Position bottom only
                // TODO Save instances globally
                var picker1 = new Pikaday({
                    field: $('.sol-exact-time')[0],
                    format: 'D MMM YYYY'
                });

                var picker2 = new Pikaday({
                    field: $('.sol-time-from')[0],
                    format: 'D MMM YYYY'
                });

                var picker3 = new Pikaday({
                    field: $('.sol-time-until')[0],
                    format: 'D MMM YYYY'
                });
            } else {
                $('.search-options').hide();
            }

            $('.search-options').hide();

            this.initAutomaticUpdate();
        },

        initHistoryList: function (noRetoggle) {
            pl('.listen-layout').remove();

            ke.app.render.events.onItemMouseOver();
            ke.app.render.events.onItemMouseOut();
            ke.app.render.events.onItemClick();
            ke.app.render.events.onDeleteClick();
            ke.app.render.events.onListenClick();
            ke.app.render.events.onSynonymListenClick();
            ke.app.render.events.onTickerClick();

            if (!noRetoggle) {
                ke.particles.hist_opt_delete.model.toggleSlidingWrap();
                //ke.particles.hist_list.model.toggleListenWrap(null, true);
            }

            ke.app.render.events.onWindowResize();
            ke.app.handlers.onWindowResize();

            console.timeEnd('page');
        },

        // todo
        // Create a port listener in order to receive updates on demand
        initAutomaticUpdate: function () {
            setInterval(function () {
                ke.particles.hist_list.model.automaticUpdate();
            }, 3525);
        },

        setPageScrollSize: function () {
            pl('#page-vis-scroll').css('height', this.temp.window_height);
            pl('#page-track').css('height', this.temp.window_height - 8);
            pl('#page-scrollbar').css('height', this.temp.window_height);

            ke.particles.scrollbars.model.setupHistoryPageScroll();

//            ke.particles.hist_list.model.onPageScroll();
        },

        canPerformActions: function () {
            return !this.flags.isTickerWrapActive;
        }
    });

})();