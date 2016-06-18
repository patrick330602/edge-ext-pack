/* Kumquat Hub Options Render
 * 
 **/

(function (undefined) {

    function imageExists(image_url) {
        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status != 404;
    }

    pl.extend(ke.app.render, {
        organize: {
            setupChangeableImages: function () {
                $('img[class$=changeable]').each(function () {
                    var $this = $(this);

                    setInterval(function () {
                        var $clone = $this.clone();

                        $this.before($clone);
                        $this.css('z-index', 999);

                        var nc = +$this.data('cur') + 1 > +$this.data('max') ? 1 : +$this.data('cur') + 1;

                        $clone
                            .attr('src', 'http://insttranslate.com/files/browser_tutorial_img/' + $this.data('name') + '_' + nc + (ke.IS_OPERA ? '_opera' : '') + '.png')
                            .data('cur', nc);

                        $this.fadeOut(1750, 'easeInOutCubic', function () {
                            $this.remove();
                            $this = $clone;
                        });
                    }, +$this.data('delay') + 1750);
                });
            }
        },

        events: {
            gotIt: function () {
                pl('.got-it').bind('click', ke.app.handlers.gotIt);
            }
        }
    });

})();