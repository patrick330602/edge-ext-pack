if (window.browser !== undefined) {
    (function () {
        Object.defineProperty(window, "chrome", {
            get: delayInitchrome,
            configurable: true,
            enumerable: true
        });

        function delayInitchrome() {
            var wrapchrome = Object.defineProperties({}, {
                "browserAction": {
                    value: browser.browserAction,
                    configurable: true,
                    enumerable: true
                },
                "contextMenus": {
                    value: browser.contextMenus,
                    configurable: true,
                    enumerable: true
                },
                "extension": {
                    value: browser.extension,
                    configurable: true,
                    enumerable: true
                },
                "i18n": {
                    value: browser.i18n,
                    configurable: true,
                    enumerable: true
                },
                "pageAction": {
                    value: browser.pageAction,
                    configurable: true,
                    enumerable: true
                },
                "pageEntities": {
                    value: browser.pageEntities,
                    configurable: true,
                    enumerable: true
                },
                "runtime": {
                    value: browser.runtime,
                    configurable: true,
                    enumerable: true
                },
                "storage": {
                    value: browser.storage,
                    configurable: true,
                    enumerable: true
                },
                "tabs": {
                    value: browser.tabs,
                    configurable: true,
                    enumerable: true
                },
                "windows": {
                    value: browser.windows,
                    configurable: true,
                    enumerable: true
                },
                "webNavigation": {
                    value: browser.webNavigation,
                    configurable: true,
                    enumerable: true
                },
                "webRequest": {
                    value: browser.webRequest,
                    configurable: true,
                    enumerable: true
                }
            });

            // Replace delayInit with the initialized object to avoid repeated calls to delayInit.
            Object.defineProperty(window, "chrome", {
                value: wrapchrome,
                configurable: true,
                enumerable: true
            });
            return wrapchrome;
        }
    })();
}