if (window.browser !== undefined) {
    (function () {
        Object.defineProperty(window, "chrome", {
            get: delayInitchrome,
            configurable: true,
            enumerable: true
        });

        function delayInitchrome() {
            var wrapchrome = Object.defineProperties({}, {
                "runtime": {
                    value: browser.runtime,
                    configurable: true,
                    enumerable: true
                },
                "storage": {
                    value: browser.storage,
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