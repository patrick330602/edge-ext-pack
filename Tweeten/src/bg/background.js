if (typeof msBrowser !== 'undefined') {
	chrome = msBrowser;
}
else if (typeof browser != 'undefined')
{
	chrome = browser;
}

chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({ url: 'src/options/options.html' }, null);
});

var detective = new Detector();

if (localStorage.theme != "light") {
	if (localStorage.theme != "dark") {
		localStorage["theme"] = "dark";
	}
}

var cssfile;

function setcss() {
    if (localStorage.theme == "dark"){
        cssfile = "src/assets/dark.css";
    } else if (localStorage.theme == "light"){
        cssfile = "src/assets/light.css";
    } else{
        cssfile = "src/assets/dark.css";
    }
}

setcss();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.indexOf("https://tweetdeck.twitter.com/") > -1) {
        chrome.tabs.insertCSS(tabId, {file:"src/assets/common.css"});
        chrome.tabs.insertCSS(tabId, {file:cssfile});
        if (detective.detect('Segoe MDL2 Assets')) {
            chrome.tabs.insertCSS(tab.id, { file: 'src/assets/font.css' });
        }
    }
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.indexOf("https://tweetdeck.twitter.com/") > -1) {
        chrome.tabs.insertCSS(tabId, { file:"src/assets/common.css" });
        chrome.tabs.insertCSS(tabId, {file:cssfile});
        if (detective.detect('Segoe MDL2 Assets')) {
            chrome.tabs.insertCSS(tab.id, { file: 'src/assets/font.css' });
        }
    }
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.gettheme) {
			sendResponse({theme: localStorage.theme});
		} else {
			localStorage.theme = request.theme;
			setcss();
			chrome.tabs.query({}, function(tabs) { 
				for (var i = 0; i < tabs.length; i++) {
					if (tabs[i].url == "https://tweetdeck.twitter.com/") {
						chrome.tabs.insertCSS(tabs[i].id, { file: "src/assets/common.css" });
						chrome.tabs.insertCSS(tabs[i].id, { file: cssfile });
						if (detective.detect('Segoe MDL2 Assets')) {
							chrome.tabs.insertCSS(tabs[i].id, { file: 'src/assets/font.css' });
						}
					}
				}
			});
		}
	}
);