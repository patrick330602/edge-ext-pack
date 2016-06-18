/* Kumquat Extension - String
 * 
 **/

(function (undefined) {

    pl.extend(ke.ext.string, {
        leadToDbOutputLike: function (i) {
            return i
                .replace(/\{/g, '').replace(/\}/g, '')
                .replace(/\[/g, '').replace(/\]/g, '')
                .replace(/\"/g, '').replace(/\,/g, '')
                .replace(/\:/g, '');
        },

        highlight: function (obj, subj) {
            var node = $('<div>').html(obj); // to avoid replacing in html tags

            return node.text().replace(new RegExp(subj, 'gi'), function (match) {
                return '<span class="highlighting">' + match + '</span>';
            });
        }
    });

})();