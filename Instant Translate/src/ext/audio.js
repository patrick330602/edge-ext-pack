(function (undefined) {

    var UNUTTERABLE_LANGS = 'auto,az,eu,be,bn,bg,ceb,ny,et,tl,gl,ka,gu,ha,' +
        'iw,hmn,ig,ga,jw,kn,kk,km,lo,lt,mg,ms,ml,mt,mi,mr,mn,my,ne,fa,pa,st,' +
        'si,sl,so,su,tg,te,uk,ur,zu,yi,yo,uz'.split(',');

    pl.extend(ke.ext.audio, {
        current: null,

        play: function (contents, callback) {
            var interrupt = false;
            var that = this;

            //if (ke.IS_EDGE) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', contents, true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function (e) {
                if (this.status == 200) {
                    var blob = new Blob([this.response], {type: 'audio/mpeg'});
                    var reader = new FileReader();

                    reader.addEventListener('loadend', function () {
                        that.current = new Audio(reader.result);
                        that.current.onerror = function () {
                            callback({
                                error: true
                            });
                        };

                        that.current.play();

                        var _int = setInterval(function () {
                            if (!ke.ext.audio.current || ke.ext.audio.current.ended) {
                                ke.ext.audio.current = null;
                                clearInterval(_int);

                                try {
                                    callback();
                                } catch (error) {
                                    ke.log('Error in audio callback:', error.toString());
                                }
                            }
                        }, 100);
                    });

                    reader.readAsDataURL(blob);
                } else {
                    alert('Unable to download.');
                }
            };
            xhr.send();
            /*} else {
             this.current = new Audio(contents);
             this.current.onerror = function () {
             interrupt = true;
             callback({
             error: true
             });
             };

             if (interrupt) {
             return;
             }

             this.current.play();
             }*/


        },

        stopCurrentAudio: function () {
            if (ke.ext.audio.current) {
                ke.ext.audio.current.pause();
                ke.ext.audio.current = null;
            }
        },

        isUtterable: function (lang) {
            return !~pl.inArray(lang, UNUTTERABLE_LANGS);
        },

        intId: null,

        playBigText: function (text, lang, callback) {
            var parts = text.split(' ');
            var current_part = '';
            var playing_parts = [];

            for (var i = 0, len = parts.length; i < len; ++i) {
                if (current_part.length + parts[i].length < 100) {
                    current_part += parts[i].trim() + ' ';
                } else {
                    playing_parts.push(current_part.trim());
                    current_part = parts[i].trim() + ' ';
                }
            }

            playing_parts.push(current_part.trim());

            var can = true;
            var i = -1;
            this.intId = setInterval(function () {
                if (can) {
                    can = false;
                    var part = playing_parts[++i];
                    if (part) {
                        ke.ext.audio.play(ke.ext.googleApi.getAudioFileLink(lang, part), function () {
                            can = true;

                            if (i === playing_parts.length - 1) {
                                clearInterval(ke.ext.audio.intId);
                                callback();
                            }
                        });
                    }
                }
            }, 2);
        }
    });

})();