'use strict';

addLibrary('mediaHosts', 'soundcloud', {
	domains: ['soundcloud.com'],
	detect: function detect(href, elem) {
		if (href.indexOf('soundcloud.com') !== -1) {
			if (elem.className.indexOf('title') === -1) return true;
		}
		return false;
	},
	handleLink: function handleLink(elem) {
		var def = $.Deferred();
		var apiURL = 'http://soundcloud.com/oembed?url=' + encodeURIComponent(elem.href) + '&format=json&iframe=true';
		RESEnvironment.ajax({
			method: 'GET',
			url: apiURL,
			// aggressiveCache: true,
			onload: function onload(response) {
				try {
					def.resolve(elem, JSON.parse(response.responseText));
				} catch (error) {
					def.reject();
				}
			},
			onerror: function onerror(response) {
				def.reject();
			}
		});

		return def.promise();
	},
	handleInfo: function handleInfo(elem, info) {
		// Get src from iframe html returned
		var src = $(info.html).attr('src');
		elem.type = 'IFRAME';
		elem.setAttribute('data-embed', src);
		elem.setAttribute('data-pause', '{"method":"pause"}');
		elem.setAttribute('data-play', '{"method":"play"}');
		return $.Deferred().resolve(elem).promise();
	}
});
//# sourceMappingURL=soundcloud.js.map
