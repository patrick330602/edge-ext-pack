'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

addLibrary('mediaHosts', 'redditbooru', {
	domains: ['redditbooru.com'],
	detect: function detect(href, elem) {
		return href.indexOf('redditbooru.com/gallery/') >= 0;
	},
	handleLink: function handleLink(elem) {
		var urlRegEx = /^http[s]?:\/\/([\w\.]+)?redditbooru\.com\/gallery\/([\w]+)(\/[\w\-]+)?/i,
		    href = elem.href.split('?')[0],
		    groups = urlRegEx.exec(href),
		    def = $.Deferred(),
		    apiUrl = 'http://redditbooru.com/images/?postId=',
		    id;

		if (groups) {

			// this will only be set for base36 IDs
			if (groups[3].length > 0) {
				id = parseInt(groups[2], 36);
			} else {
				id = groups[2];
			}

			apiUrl += encodeURIComponent(id);
			RESEnvironment.ajax({
				method: 'GET',
				url: apiUrl,
				onload: function onload(response) {
					var json = {};
					try {
						json = JSON.parse(response.responseText);
						def.resolve(elem, json);
					} catch (error) {
						def.reject(elem);
					}
				}
			});
		}
		return def.promise();
	},
	handleInfo: function handleInfo(elem, info) {
		if ((typeof info === 'undefined' ? 'undefined' : _typeof(info)) === 'object' && info.length > 0) {
			elem.src = info.map(function (e, i, a) {
				return {
					title: e.caption,
					src: e.cdnUrl,
					href: e.cdnUrl,
					caption: e.sourceUrl.length ? 'Source: <a href="' + e.sourceUrl + '">' + e.sourceUrl + '</a>' : ''
				};
			});
			elem.imageTitle = info[0].title;
			elem.type = 'GALLERY';
		}
		return $.Deferred().resolve(elem).promise();
	}
});
//# sourceMappingURL=redditbooru.js.map
