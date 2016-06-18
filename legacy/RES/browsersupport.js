'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* exported RESEnvironment, BrowserDetect, xhrQueue */

var RESEnvironment = {
	localStorage: function () {
		var original = typeof unsafeWindow !== 'undefined' ? unsafeWindow.localStorage : typeof localStorage !== 'undefined' ? localStorage : typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined;

		return function () {
			return original;
		};
	}(),
	location: function (_location) {
		function location() {
			return _location.apply(this, arguments);
		}

		location.toString = function () {
			return _location.toString();
		};

		return location;
	}(function () {
		return location;
	}),
	getMutationObserver: function getMutationObserver() {
		if (!this.MutationObserver) {
			// set up MutationObserver variable to take whichever is supported / existing...
			this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null;

			// null out MutationObserver to test legacy DOMNodeInserted
			// this.MutationObserver = null;
		}

		return this.MutationObserver;
	},
	sanitizeJSON: function sanitizeJSON(data) {
		return data;
	},
	parseHtmlAsDocument: function () {
		var domParserCanHandleHtml = false;

		try {
			if (new DOMParser().parseFromString('<html />', 'text/html')) {
				// text/html parsing is natively supported
				// Expected to work in Firefox, Chrome, OperaBlink, Opera, Safari 7
				// Not expected to work in Safari ... 6?
				domParserCanHandleHtml = true;
			}
		} catch (ex) {
			// ignore
		}

		return function (markup) {
			var doc;
			if (domParserCanHandleHtml) {
				doc = new DOMParser().parseFromString(markup, 'text/html');
			} else {
				doc = document.implementation.createHTMLDocument('');
				if (markup.toLowerCase().indexOf('<!doctype') !== -1) {
					doc.documentElement.innerHTML = markup;
				} else {
					doc.body.innerHTML = markup;
				}
			}
			return doc;
		};
	}(),
	ajax: function ajax(obj) {
		// return nothing
	},
	storageSetup: function storageSetup(thisJSON) {
		// return nothing
	},
	RESInitReadyCheck: function RESInitReadyCheck() {
		if (typeof $ !== 'function') {
			console.log('Uh oh, something has gone wrong loading jQuery...');
		}

		$(document).ready(RESInit);
		// return nothing
	},
	sendMessage: function sendMessage(thisJSON) {
		// return nothing
	},
	deleteCookies: function deleteCookies(cookieNames, callback) {
		var deferreds = [].concat(cookieNames).map(RESEnvironment.deleteCookie);
		$.when.apply($, deferreds).done(callback);
	},
	deleteCookie: function deleteCookie(cookieName) {
		var deferred = new $.Deferred();

		document.cookie = cookieName + '=null;expires=' + Date.now() + '; path=/;domain=reddit.com';
		deferred.resolve(cookieName);

		return deferred;
	},
	getOutlineProperty: function getOutlineProperty() {
		// return string or nothing
	},
	openNewWindow: function openNewWindow(thisHREF) {
		window.open(thisHREF);
	},
	addURLToHistory: function addURLToHistory(url) {
		var thisJSON = {
			requestType: 'addURLToHistory',
			url: url
		};

		RESEnvironment.sendMessage(thisJSON);

		// return nothing
	},
	_addURLToHistory: function () {
		// NOTE TO REVIEWERS: Not used by Chrome or Firefox
		// This is the poor man's implementation of browser.history.push()

		var frame;
		var urls = [];

		function addURLToHistory(url) {
			if (url) {
				urls.push(url);
			}
			handleUrls();
			// return nothing
		}

		function handleUrls() {
			setup();
			var url;
			while (url = urls.shift()) {
				sendMessage(url);
			}
		}

		function setup() {
			RESEnvironment._addURLToHistoryViaForeground = loadInFrame;
			if (frame) return;

			frame = document.createElement('iframe');
			function onload() {
				setTimeout(handleUrls, 300);
				frame.removeEventListener('load', onload, false);
				frame.contentWindow.location.replace('about:blank');
			}
			frame.addEventListener('load', onload, false);
			frame.style.display = 'none';
			frame.style.width = '0px';
			frame.style.height = '0px';
			document.body.appendChild(frame);
		}

		function sendMessage(url) {
			var thisJSON = {
				requestType: 'addURLToHistory',
				url: url
			};

			RESEnvironment.sendMessage(thisJSON);
		}

		function loadInFrame(url) {
			frame.contentWindow.location.replace(url);
		}

		return addURLToHistory;
	}()
};

var BrowserDetect = {
	init: function init() {
		if (typeof navigator === 'undefined') {
			return;
		}
		this.browser = this.searchString(this.dataBrowser()) || 'An unknown browser';
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version';
		this.OS = this.searchString(this.dataOS()) || 'an unknown OS';
	},
	searchString: function searchString(datas) {
		var data = datas.find(function (data) {
			this.versionSearchString = data.versionSearch || data.identity;
			return data.string && data.string.indexOf(data.subString) !== -1 || data.prop;
		}, this);

		return data ? data.identity : undefined;
	},
	searchVersion: function searchVersion(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) {
			return;
		}
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	},
	isChrome: function isChrome() {
		return typeof chrome !== 'undefined';
	},
	isFirefox: function isFirefox() {
		return typeof self !== 'undefined' && typeof self.on === 'function';
	},
	isOperaBlink: function isOperaBlink() {
		return typeof chrome !== 'undefined' && BrowserDetect.browser === 'Opera';
	},
	isSafari: function isSafari() {
		return typeof safari !== 'undefined';
	},
	dataBrowser: function dataBrowser() {
		return [{
			string: navigator.userAgent,
			subString: 'OPR/',
			identity: 'Opera'
		}, {
			string: navigator.userAgent,
			subString: 'Chrome',
			identity: 'Chrome'
		}, {
			string: navigator.userAgent,
			subString: 'OmniWeb',
			versionSearch: 'OmniWeb/',
			identity: 'OmniWeb'
		}, {
			string: navigator.vendor,
			subString: 'Apple',
			identity: 'Safari',
			versionSearch: 'Version'
		}, {
			prop: window.opera,
			identity: 'Opera',
			versionSearch: 'Version'
		}, {
			string: navigator.vendor,
			subString: 'iCab',
			identity: 'iCab'
		}, {
			string: navigator.vendor,
			subString: 'KDE',
			identity: 'Konqueror'
		}, {
			string: navigator.userAgent,
			subString: 'Firefox',
			identity: 'Firefox'
		}, {
			string: navigator.vendor,
			subString: 'Camino',
			identity: 'Camino'
		}, { // for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: 'Netscape',
			identity: 'Netscape'
		}, {
			string: navigator.userAgent,
			subString: 'MSIE',
			identity: 'Explorer',
			versionSearch: 'MSIE'
		}, {
			string: navigator.userAgent,
			subString: 'Gecko',
			identity: 'Mozilla',
			versionSearch: 'rv'
		}, {
			// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: 'Mozilla',
			identity: 'Netscape',
			versionSearch: 'Mozilla'
		}];
	},
	dataOS: function dataOS() {
		return [{
			string: navigator.platform,
			subString: 'Win',
			identity: 'Windows'
		}, {
			string: navigator.platform,
			subString: 'Mac',
			identity: 'Mac'
		}, {
			string: navigator.userAgent,
			subString: 'iPhone',
			identity: 'iPhone/iPod'
		}, {
			string: navigator.platform,
			subString: 'Linux',
			identity: 'Linux'
		}];
	}
};

BrowserDetect.init();

// This object will store xmlHTTPRequest callbacks for Safari because Safari's extension architecture seems stupid.
// This really shouldn't be necessary, but I can't seem to hold on to an onload function that I pass to the background page...
var xhrQueue = {
	count: 0,
	onloads: []
};

if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	exports.RESEnvironment = RESEnvironment;
	exports.BrowserDetect = BrowserDetect;
	exports.xhrQueue = xhrQueue;
}
//# sourceMappingURL=browsersupport.js.map
