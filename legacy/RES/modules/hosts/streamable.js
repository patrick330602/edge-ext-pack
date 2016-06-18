'use strict';

addLibrary('mediaHosts', 'streamable', {
	domains: ['streamable.com'],
	detect: function detect(href, elem) {
		return href.indexOf('streamable.com') !== -1;
	},
	handleLink: function handleLink(elem) {
		var def = $.Deferred();
		var hashRe = /^https?:\/\/(?:www\.)?streamable\.com\/([\w]+)/i;
		var groups = hashRe.exec(elem.href);
		if (groups) {
			def.resolve(elem, '//streamable.com/res/' + groups[1]);
		} else {
			def.reject();
		}
		return def.promise();
	},
	handleInfo: function handleInfo(elem, info) {
		elem.type = 'IFRAME';
		elem.setAttribute('data-embed', info);
		elem.setAttribute('data-pause', '{"method":"pause"}');
		elem.setAttribute('data-play', '{"method":"play"}');
		return $.Deferred().resolve(elem).promise();
	}
});
//# sourceMappingURL=streamable.js.map
