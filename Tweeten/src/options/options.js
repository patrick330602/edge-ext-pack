if (typeof msBrowser !== 'undefined') {
	chrome = msBrowser;
}
else if (typeof browser != 'undefined')
{
	chrome = browser;
}

var currenttheme;

chrome.runtime.sendMessage({theme: null, gettheme: true}, function(response) {
	var radios_theme = document.getElementsByName('theme');
    for (var i = 0, length = radios_theme.length; i < length; i++) {
        if (radios_theme[i].value == response.theme) {
            radios_theme[i].checked = true;
			currenttheme = response.theme;
        }
    }
});

var apply = document.getElementById('Apply');
if (prev == null) {
    var prev = null;
}

apply.addEventListener('click', function () {
    var radios_theme = document.getElementsByName('theme');
    for (var i = 0, length = radios_theme.length; i < length; i++) {
        if (radios_theme[i].checked) {
            if (radios_theme[i].value != currenttheme) {
				chrome.runtime.sendMessage({ theme: radios_theme[i].value, gettheme: false}, function(response) {});
                currenttheme = radios_theme[i].value;
            }
        }
    }
});