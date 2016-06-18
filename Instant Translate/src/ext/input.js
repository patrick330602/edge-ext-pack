(function (undefined) {
    var clearField = function (input, callback) {
        var v = pl(input).val();
        if (v.length > 0) {
            $(input).val(v.substr(0, v.length - 1));
            setTimeout(function () {
                clearField(input, callback);
            }, 5);
        } else {
            callback();
        }
    };

    pl.extend(pl.fn, {
        caretToEnd: function () {
            var io;
            pl.each(this.elements, function () {
                io = pl(this);
                io.placeCaret(io.val().length);
            });
            return this;
        },

        placeCaret: function (pos) {
            var io;
            pl.each(this.elements, function () {
                io = pl(this);
                io.get().setSelectionRange(pos, pos);
                io.trigger('focus');
            });
            return this;
        },

        getCursorPosition: function () {
            var input = this.elements[0];
            if ('selectionStart' in input) {
                return input.selectionStart;
            }
            return 0;
        },

        clear: function (callback) {
            pl.each(this.elements, function () {
                clearField(this, callback);
            });
        }
    });
})();