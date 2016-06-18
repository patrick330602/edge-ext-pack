/* Kumquat Hub Content Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        getListenValue: function (s) {
            if (s === 'orig') {
                return ke.particles.translate_ctt.model.getCurrentSelectedText();
            } else if (s === 'trans') {
                if (ke.app.flags.isCurrentTranslationMulti) {
                    return pl('.' + ke.getPrefix() + 'main-variant .' + ke.getPrefix() + 'mv-text-part').text();
                } else {
                    return pl('.' + ke.getPrefix() + 'padded-single-translation').text();
                }
            }

            return '';
        },

        showOnGoogleTranslate: function (event) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'translate', 'getTranslationPageLink'),
                from: $('.' + ke.getPrefix() + 'listen-original').data('from'),
                to: $('.' + ke.getPrefix() + 'listen-translation').data('to'),
                text: ke.particles.translate_ctt.model.getCurrentSelectedText()
            }, function (data) {
                window.open(data.link, '_newtab');
            });
        },

        reverseTranslation: function (event) {
            if (ke.app.lastTranslationCallArgs.from != null
                && ke.app.lastTranslationCallArgs.to != null
                && ke.app.lastTranslationCallArgs.text != null) {
                window.open("../public/pdf_tooltip.html#" + ke.app.lastTranslationCallArgs.to + "|" + ke.app.lastTranslationCallArgs.from + "|" + ke.app.lastTranslationCallArgs.text, "_blank", "resizable=no, scrollbars=no, titlebar=no, width=337, height=300, top=10, left=10");
                window.close();
            }
        }
    });
})();