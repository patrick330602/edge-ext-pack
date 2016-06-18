'use strict';

addLibrary('mediaHosts', 'ctrlv', {
	name: 'CtrlV.in',
	domains: ['ctrlv.in'],
	detect: function detect(href, elem) {
		return elem.href.toLowerCase().indexOf('ctrlv.in/') !== -1;
	},
	handleLink: function handleLink(elem) {
		var hashRe = /^http:\/\/((m|www)\.)?ctrlv\.in\/([0-9]+)/i;
		var def = $.Deferred();
		var groups = hashRe.exec(elem.href);
		if (groups) {
			def.resolve(elem, {
				type: 'IMAGE',
				src: 'http://img.ctrlv.in/id/' + groups[3],
				href: elem.href
			});
		} else {
			def.reject();
		}
		return def.promise();
	},
	handleInfo: function handleInfo(elem, info) {
		var def = $.Deferred();

		elem.type = info.type;
		elem.src = info.src;

		if (RESUtils.pageType() === 'linklist') {
			$(elem).closest('.thing').find('.thumbnail').attr('href', elem.href);
		}

		def.resolve(elem);
		return def.promise();
	}
});
//# sourceMappingURL=ctrlv.js.map
