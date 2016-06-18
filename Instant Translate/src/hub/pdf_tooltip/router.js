/* Kumquat Hub Content Router
 * 
 **/

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.tpl',
            'ext.audio',
            'ext.dom',

            'particles.listen.lModel',
            'particles.translate_ctt.tcModel',
            'particles.scrollbars.sModel',

            'ui_components.scrollbar.scrollbar',
            'ui_components.tooltip.helpSelected',

            'templates.helpSelectedTooltip'
        ],

        callbacksInitialization: {},

        flags: {
            isCurrentTranslationMulti: false,
            isTranslating: false
        },

        temp: {
            currentDetectedLang: ''
        },

        lastTranslationCallArgs: {},

        init: function () {
            if (pl.empty(document.location.hash)) return;

            var hash_parts = document.location.hash.substr(1).split('|');
            this.lastTranslationCallArgs.from = hash_parts[0];
            this.lastTranslationCallArgs.to = hash_parts[1];
            this.lastTranslationCallArgs.text = hash_parts.splice(2).join('');
            var ttid = 1;

            document.title = this.lastTranslationCallArgs.text;

            $('body').css('overflow', 'hidden');

            ke.particles.translate_ctt.model.currentSelectedText = this.lastTranslationCallArgs.text;

            ke.particles.translate_ctt.model.getTranslation(this.lastTranslationCallArgs.text, function (is_offline, id, t) {
                if (is_offline) {
                    $('.' + ke.getPrefix() + 'tooltip-' + ttid).find('.' + ke.getPrefix() + 'offline')['show']();
                    return;
                }

                $('body').html(ke.ext.tpl.compile(ke.templates.helpSelectedTooltip, {
                    prefix: ke.getPrefix(),
                    content: t,
                    ttid: ttid,
                    l_open: ke.getLocale('Kernel_OpenGt'),
                    l_reversed: ke.getLocale('Kernel_Reverse'),
                    l_original: ke.getLocale('Kernel_Original'),
                    l_highlight: ke.getLocale('Kernel_Highlight')
                }));

                $('.' + ke.getPrefix() + 'listen-original').data('from', ke.app.lastTranslationCallArgs.from);
                $('.' + ke.getPrefix() + 'unpin').remove();

                setTimeout(function () {
                    ke.particles.scrollbars.model.setupHelpSelectedScroll(ttid);

                    ke.app.render.events.listen();
                    ke.app.render.events.listenSynonym();
                    ke.app.render.events.showOnGoogleTranslate();
                    ke.app.render.events.reverseTranslation();
                }, 15);
            }, this.lastTranslationCallArgs.from, this.lastTranslationCallArgs.to);
        }
    });

})();