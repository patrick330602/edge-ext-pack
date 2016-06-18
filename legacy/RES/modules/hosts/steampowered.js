'use strict';

addLibrary('mediaHosts', 'steampowered', {
	name: 'steam',
	domains: ['steampowered.com', 'steamusercontent.com'],
	detect: function detect(href, elem) {
		return (/^cloud(?:-\d)?\.(?:steampowered|steamusercontent)\.com$/i.test(elem.host)
		);
	},
	handleLink: function handleLink(elem) {
		return $.Deferred().resolve(elem, elem.href).promise();
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
//# sourceMappingURL=steampowered.js.map
