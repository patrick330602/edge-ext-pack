'use strict';

addLibrary('mediaHosts', 'imgflip', {
	domains: ['imgflip.com'],
	detect: function detect(href, elem) {
		return (/^https?:\/\/imgflip\.com\/(i|gif)\/[a-z0-9]+/.test(elem.href)
		);
	},
	handleLink: function handleLink(elem) {
		var def = $.Deferred(),
		    groups = /^https?:\/\/imgflip\.com\/(i|gif)\/([a-z0-9]+)/.exec(elem.href);
		def.resolve(elem, '//i.imgflip.com/' + groups[2] + '.' + (groups[1] === 'gif' ? 'gif' : 'jpg'));
		return def.promise();
	},
	handleInfo: function handleInfo(elem, info) {
		elem.type = 'IMAGE';
		elem.src = info;
		if (RESUtils.pageType() === 'linklist') {
			$(elem).closest('.thing').find('.thumbnail').attr('href', elem.href);
		}
		return $.Deferred().resolve(elem).promise();
	}
});
//# sourceMappingURL=imgflip.js.map
