(function (undefined) {

    ke.import('ext.audio');

    pl.extend(ke.particles.listen.model, {
        _getTransValue: function (source, s2, e) {
            if (source === 'window') {
                if (ke.app.flags.isCurrentTranslationMulti) {
                    return $('.translation-layout .main-variant .mv-text-part').html();
                } else {
                    return $('.trans-wrap').find('.tpart').html();
                }
            } else if (source === 'history') {
                return ke.particles.hist_list.model.getListenValue(s2, e);
            } else if (source === 'tooltip') {
                return ke.app.handlers.getListenValue(s2, e);
            }
        },

        target_id: 0,
        targets: {},

        _playPrototype: function (flag, dir, input, vis_fn, dl, ctx) {
            if (ke.app.flags[flag]) {
                return;
            }

            var lang = dl || ( dir.substr(0, 5) === 'lang:' ?
                    dir.substr(5) :
                    ke.ext.util.langUtil['get' + ke.capitalize(dir) + 'Lang']());

            ke.app.flags[flag] = true;
            ke.particles.listen.model[vis_fn](true, lang, ctx);

            var target_id = ++ke.particles.listen.model.target_id;
            ke.particles.listen.model.targets[target_id] = ctx;

            ke.particles.listen.model._play(lang, input, function (data) {
                ke.app.flags[data.old_data.flag] = false;
                ke.particles.listen.model[data.old_data.identificator](
                    false,
                    dl || lang,
                    ke.particles.listen.model.targets[data.old_data.target_id]
                );
                delete ke.particles.listen.model.targets[data.old_data.target_id];
            }, vis_fn, flag, target_id);
        },

        _play: function (lang, input, callback, id, flag, target_id) {
            if (!pl.empty(input)) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'audio', 'play'),
                    identificator: id,
                    text: input.trim(),
                    lang: lang,
                    flag: flag,
                    target_id: target_id
                }, function (data) {
                    console.log('Response for lModel.js:', data);
                    callback(data);
                });
            }
        },

        ctrlRawVisibility: function (playing, lang) {
            var allowed = !playing && !pl.empty(pl('.translation-input').val()) &&
                ke.ext.audio.isUtterable(ke.app.temp.currentDetectedLang || ke.ext.util.langUtil.getFromLang());

            pl('.listen-raw-button')[(allowed ? 'remove' : 'add') + 'Class']('listen-disabled');
            ke.app.flags.rawUtterancePermission = allowed;
        },

        ctrlTransVisibility: function (playing, lang) {
            var allowed = !playing;

            if (ke.ext.audio.isUtterable(ke.app.temp.toLang)) {
                pl('.listen-translation').show();
            } else {
                pl('.listen-translation').hide();
            }

            if (!allowed) {
                pl('.listen-translation').addClass('listen-disabled');
            } else {
                pl('.listen-translation').removeClass('listen-disabled');
            }

            ke.app.flags.transUtterancePermission = allowed;
        },

        ctrlSynonymVis: function (playing, lang, $context) {
            var allowed = !playing;
            var prefix = ke.data.kernel.info.section === 'content' ? ke.getPrefix() : '';

            if (ke.ext.audio.isUtterable(ke.app.temp.toLang || lang)) {
                if ($context) {
                    //console.log('toggle synonym in ' + prefix);
                    $context.find('.' + prefix + 'listen-v-item').show();
                } else
                    pl('.' + prefix + 'listen-v-item').show();
            } else {
                if ($context)
                    $context.find('.' + prefix + 'listen-v-item').hide();
                else
                    pl('.' + prefix + 'listen-v-item').hide();
            }

            pl('.' + prefix + 'listen-v-item')[(allowed ? 'remove' : 'add') + 'Class'](prefix + 'listen-disabled');
            ke.app.flags.transUtterancePermission = allowed;
        },

        ctrlTooltipTransVisibility: function (p, lang, e) {
            var to_lang = $('.' + ke.getPrefix() + 'h-listen-selector').data('to');
            var playing = p === true;
            //console.log('ctrl tooltip trans vis:', e);
            var allowed = !playing
                && !pl.empty(ke.particles.listen.model._getTransValue('tooltip', 'orig', e))
                && !pl.empty(ke.particles.listen.model._getTransValue('tooltip', 'trans', e))
                && ke.ext.audio.isUtterable(to_lang);

            pl('.TnITTtw-listen-button')[(allowed ? 'remove' : 'add') + 'Class']('TnITTtw-listen-disabled');
            ke.app.flags.tt_transUtterancePermission = allowed;
        },

        ctrlHistoryOrigVisibility: function (e, lang, $context) {
            //console.log(arguments);
            if (ke.ext.audio.isUtterable(lang)) {
                $context.find('.listen-original .listen-button').show();
            } else {
                $context.find('.listen-original .listen-button').hide();
            }

            pl('.listen-button')[(ke.app.flags.isPlayingOriginal ? 'add' : 'remove') + 'Class']('listen-disabled');
        },

        ctrlHistoryTransVisibility: function (e, lang, $context) {
            if (ke.ext.audio.isUtterable(lang)) {
                $context.find('.listen-translation .listen-button').show();
            } else {
                $context.find('.listen-translation .listen-button').hide();
            }

            pl('.listen-button')[(ke.app.flags.isPlayingTrans ? 'add' : 'remove') + 'Class']('listen-disabled');
        },

        playRaw: function () {
            ke.particles.listen.model._playPrototype(
                'isPlayingRaw',
                'from',
                pl('.translation-input').val(),
                'ctrlRawVisibility',
                ke.app.temp.currentDetectedLang
            );
        },

        playTranslation: function () {
            ke.particles.listen.model._playPrototype(
                'isPlayingTrans',
                'to',
                ke.particles.listen.model._getTransValue('window'),
                'ctrlTransVisibility'
            );
        },

        playTooltip: function (e) {
            e.stopPropagation();
            if (pl(this).hasClass(ke.getPrefix() + 'listen-original')) {
                ke.particles.listen.model.playTooltipOriginal(e, $(this).data('from'));
            } else {
                ke.particles.listen.model.playTooltipTranslation(e, $(this).data('to'));
            }
        },

        playTooltipOriginal: function (e, lang) {
            ke.particles.listen.model._playPrototype(
                'isPlayingTooltipTrans',
                'lang:' + lang,
                ke.particles.listen.model._getTransValue('tooltip', 'orig', e),
                'ctrlTooltipTransVisibility', ke.app.temp.currentDetectedLang, e
            );
        },

        playTooltipTranslation: function (e, lang) {
            ke.particles.listen.model._playPrototype(
                'isPlayingTooltipTrans',
                'lang:' + lang,
                ke.particles.listen.model._getTransValue('tooltip', 'trans', e),
                'ctrlTooltipTransVisibility', null, e
            );
        },

        playHistoryItem: function (e) {
            e.stopPropagation();

            var $item = $('.i-' + ke.ext.util.selectorsUtil.getHistoryItemId(e.target));

            if (pl(this).hasClass('listen-original')) {
                ke.particles.listen.model.playHistoryOriginal(e, $item);
            } else {
                ke.particles.listen.model.playHistoryTranslation(e, $item);
            }
        },

        playHistoryOriginal: function (e, context) {
            ke.particles.listen.model._playPrototype(
                'isPlayingOriginal',
                'lang:' + ke.ext.util.selectorsUtil.getHistoryOriginalLang(e),
                ke.particles.listen.model._getTransValue('history', 'orig', e),
                'ctrlHistoryOrigVisibility', null, context
            );
        },

        playHistoryTranslation: function (e, context) {
            ke.particles.listen.model._playPrototype(
                'isPlayingTrans',
                'lang:' + ke.ext.util.selectorsUtil.getHistoryToLang(e),
                ke.particles.listen.model._getTransValue('history', 'trans', e),
                'ctrlHistoryTransVisibility', null, context
            );
        },

        playSynonym: function (event) {
            var val = $(this).next().html();
            ke.particles.listen.model._playPrototype(
                'isPlayingSynonym',
                'lang:' + $(this).data('langto'),
                val,
                'ctrlSynonymVis'
            );
        }
    });

})();