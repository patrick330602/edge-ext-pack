/* Kumquat Hub Content Render
 * 
 **/

(function (undefined) {

    var ALLOWED_KC_TYPES = {
        search: true,
        text: true,
        '': true
    };

    pl.extend(ke.app.render, {
        organize: {},

        events: {
            onKeyCombinationClick: function () {
                $(window).dblclick(ke.app.handlers.onDoubleClick);

                //$(doc).bind('keyup', ke.app.handlers.onKeyCombinationClick);

                //if (pl('iframe').len() > 0) {
                ke.app.render.events.onKeyCombinationPressInIframe();
                //}
            },

            onKeyCombinationPressInIframe: function (event, contentWindow, iframe) {
                var is_root = false;

                if (!contentWindow) {
                    contentWindow = window;
                    is_root = true;
                }

                try {
                    if (!contentWindow.itInitialized) {
                        $(window).bind("keydown", function (event) {
                           ke.app.handlers.onKeyCombinationClick(event, contentWindow);
                        });

                        contentWindow.itInitialized = true;
                        ke.ext.event.listen(ke.EF, ke.EF, ke.EF, contentWindow);

                        if (!is_root) {
                            ke.app.temp.windows.push(contentWindow);
                        }

                        if (iframe) {
                            ke.app.temp.iframes.push(iframe);
                        }
                    } else {
                        return;
                    }
                } catch (e) {
                    return;
                }

                if (is_root) {
                    $('body').find('frame,iframe').each(function () {
                        if ($(this).hasClass('fb_ltr') && this.contentWindow) {
                            ke.app.render.events.onKeyCombinationPressInIframe(null, this.contentWindow, this);
                        }
                    });
                }
            },

            onKCClickInTextInput: function () {
            },

            listen: function () {
                pl('.' + ke.getPrefix() + 'listen-button').unbind().bind('click', ke.particles.listen.model.playTooltip);
            },

            showOnGoogleTranslate: function () {
                pl('.' + ke.getPrefix() + 'open-link').unbind().bind('click', ke.app.handlers.showOnGoogleTranslate);
            },

            listenSynonym: function () {
                pl('.' + ke.getPrefix() + 'listen-v-item').unbind().bind('click', ke.particles.listen.model.playSynonym);
            },

            reverseTranslation: function () {
                pl('.' + ke.getPrefix() + 'show-reversed').unbind().bind('click', ke.app.handlers.reverseTranslation);
            },

            highlight: function () {
                pl('.' + ke.getPrefix() + 'highlight-button').unbind().bind('click', ke.app.handlers.highlight);
            },

            unpin: function () {
                pl('.' + ke.getPrefix() + 'unpin').unbind().bind('click', ke.app.handlers.unpin);
            }
        }
    });

})();