/* Kumquat Hub Content Render
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.render, {
        organize: {},

        events: {
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
            }
        }
    });

})();