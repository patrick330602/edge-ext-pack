/****************************************************************************
    Constants.ts

    Necessary constants for the Clipper.
****************************************************************************/
var Clipper;
(function (Clipper) {
    var Constants;
    (function (Constants) {
        // These objects are populated by the Root generated JS file at run time
        var Urls;
        (function (Urls) {
        })(Urls = Constants.Urls || (Constants.Urls = {}));
        var ClientIds;
        (function (ClientIds) {
            ClientIds.OneNote = "OneNote Clipper";
        })(ClientIds = Constants.ClientIds || (Constants.ClientIds = {}));
        var Cookies;
        (function (Cookies) {
            var Keys;
            (function (Keys) {
                // General Clipper
                Keys.ClipperUseCountOnThisBrowser = "clipperUseCountOnThisBrowser";
            })(Keys = Cookies.Keys || (Cookies.Keys = {}));
        })(Cookies = Constants.Cookies || (Constants.Cookies = {}));
        var QueryParams;
        (function (QueryParams) {
            QueryParams.FeedbackOriginalUrlId = "originalUrl";
            QueryParams.AuthQueryParamName = "auth";
            QueryParams.AuthQueryParamValueMsa = "1";
            QueryParams.AuthQueryParamValueAad = "2";
        })(QueryParams = Constants.QueryParams || (Constants.QueryParams = {}));
        var Headers;
        (function (Headers) {
            Headers.CorrelationIdHeaderName = "X-CorrelationId";
        })(Headers = Constants.Headers || (Constants.Headers = {}));
        var Tags;
        (function (Tags) {
            Tags.Anchor = "a";
            Tags.Base = "base";
            Tags.Br = "br";
            Tags.Canvas = "canvas";
            Tags.Div = "div";
            Tags.IFrame = "iframe";
            Tags.Image = "img";
            Tags.Input = "input";
            Tags.Link = "link";
            Tags.NoScript = "noscript";
            Tags.Script = "script";
            Tags.Span = "span";
            Tags.Style = "style";
            Tags.Svg = "svg";
        })(Tags = Constants.Tags || (Constants.Tags = {}));
        var Attributes;
        (function (Attributes) {
            Attributes.AllowTransparency = "allowtransparency";
            Attributes.AutoFocus = "autofocus";
            Attributes.Direction = "direction";
            Attributes.HRef = "href";
            Attributes.Placeholder = "placeholder";
            Attributes.Source = "src";
            Attributes.Scrolling = "scrolling";
            Attributes.Type = "type";
            Attributes.Value = "value";
            Attributes.Name = "name";
            Attributes.Title = "title";
            Attributes.TabIndex = "tabindex";
            Attributes.Target = "target";
        })(Attributes = Constants.Attributes || (Constants.Attributes = {}));
        var AttributeValues;
        (function (AttributeValues) {
            AttributeValues.None = "none";
            AttributeValues.True = "true";
        })(AttributeValues = Constants.AttributeValues || (Constants.AttributeValues = {}));
        var Classes;
        (function (Classes) {
            Classes.Css = "oneNoteClipperCss";
            Classes.Js = "oneNoteClipperJs";
            Classes.MainContainerClass = "oneNoteClipperWindow";
            Classes.SelectedClipOption = "selectedClipOption";
        })(Classes = Constants.Classes || (Constants.Classes = {}));
        var IDs;
        (function (IDs) {
            IDs.FeedbackButton = "feedbackButton";
            IDs.CloseButton = "closeButton";
            IDs.LaunchOneNoteButton = "launchOneNoteButton";
            IDs.SigninButton = "signinButton";
            IDs.SignoutButton = "signoutButton";
            IDs.ClipButton = "clipButton";
            IDs.TryAgainButton = "tryAgainButton";
            IDs.BackToHomeButton = "backToHomeButton";
            IDs.RegionClipCancelButton = "regionClipCancelButton";
            IDs.O365BetaTag = "o365BetaTag";
            IDs.CurrentUserControl = "currentUserControl";
            IDs.UserSettingsContainer = "userSettingsContainer";
            IDs.UserSettingsList = "userSettingsList";
            IDs.ClipperUIContainer = "clipperUIContainer";
            IDs.ParentClipperContainer = "contentContainer";
            IDs.SignInContainer = "clipperSignInContainer";
            IDs.ClipperContainer = "clipperButtonContainer";
            IDs.FooterContainer = "clipperFooterContainer";
            IDs.ApiProgressContainer = "clipperApiProgressContainer";
            IDs.SuccessContainer = "clipperSuccessContainer";
            IDs.FailureContainer = "clipperFailureContainer";
            IDs.CloseButtonContainer = "closeButtonContainer";
            IDs.RegionClipContainer = "clipperRegionClipContainer";
            IDs.ThirdPartyCookiesDisabledContainer = "clipperThirdPartyDisabledContainer";
            // Clip-type buttons
            IDs.FullPageButton = "fullPageButton";
            IDs.RegionModeButton = "regionModeButton";
            IDs.AugmentationButton = "augmentationButton";
            // Augmentation button elements
            IDs.AugmentationButtonImage = "augmentationButtonImage";
            IDs.AugmentationButtonLabel = "augmentationButtonLabel";
            // Location Picker
            IDs.LocationPickerContainer = "locationPickerContainer";
            // Annotations/Notes
            IDs.AnnotationContainer = "annotationContainer";
            IDs.AnnotationField = "annotationField";
            IDs.AnnotationFieldContainer = "annotationFieldContainer";
            IDs.AnnotationPlaceholder = "annotationPlaceholder";
            // High-level Clipper UI elements
            IDs.ClipperUI = "oneNoteClipperUI";
            IDs.PreviewUI = "oneNoteAugmentedPreviewUI";
            IDs.RegionClipUI = "oneNoteRegionClipUI";
            IDs.PreviewTextContainer = "oneNoteAugmentedTextContainer";
            // Preview elements
            IDs.PreviewTitleElement = "oneNoteAugmentedTitleContainer";
            IDs.PreviewTimestampElement = "oneNotePreviewTimestamp";
            IDs.PreviewBodyElement = "oneNoteAugmentedBodyContainer";
            // Image Animation elements
            IDs.CheckMarkContainer = "checkMarkContainer";
            IDs.SpinnerInContainer = "spinnerInContainer";
            IDs.SpinnerLoopContainer = "spinnerLoopContainer";
            IDs.SpinnerOutContainer = "spinnerOutContainer";
            // Failure message
            IDs.ApiErrorMessage = "apiErrorMessage";
        })(IDs = Constants.IDs || (Constants.IDs = {}));
        var Styles;
        (function (Styles) {
            // These should be kept in sync with ClipperConstants.less
            Styles.ClipperUIWidth = 322;
            Styles.ClipperUITopRightOffset = 20;
            Styles.HorizontalSlidingAnimationBuffer = 20;
            Styles.ClipperUIDropShadowBuffer = 7;
        })(Styles = Constants.Styles || (Constants.Styles = {}));
        var Numbers;
        (function (Numbers) {
        })(Numbers = Constants.Numbers || (Constants.Numbers = {}));
        var Strings;
        (function (Strings) {
        })(Strings = Constants.Strings || (Constants.Strings = {}));
        var Brs;
        (function (Brs) {
        })(Brs = Constants.Brs || (Constants.Brs = {}));
        var SmartValueKeys;
        (function (SmartValueKeys) {
            SmartValueKeys.ClipperInfo = "CLIPPER_INFO";
            SmartValueKeys.PageInfo = "PAGE_INFO";
            SmartValueKeys.AugmentationApiStatus = "AUGMENTATION_API_STATUS";
            SmartValueKeys.AugmentationResponseJson = "AUGMENTATION_RESPONSE_JSON";
        })(SmartValueKeys = Constants.SmartValueKeys || (Constants.SmartValueKeys = {}));
        var FunctionKeys;
        (function (FunctionKeys) {
            FunctionKeys.CheckForNewerPageInfo = "CHECK_FOR_NEWER_PAGE_INFO";
            FunctionKeys.CheckForNewerPageInfoCallback = "CHECK_FOR_NEWER_PAGE_INFO_Callback";
            FunctionKeys.CloseClipper = "CLOSE_CLIPPER";
            FunctionKeys.CollapseUI = "COLLAPSE_UI";
            FunctionKeys.Dismiss = "DISMISS";
            FunctionKeys.ExpandUI = "EXPAND_UI";
            FunctionKeys.HideAllPreviews = "HIDE_PREVIEW";
            FunctionKeys.RefreshContainerHeight = "REFRESH_CONTAINER_HEIGHT";
            FunctionKeys.RefreshFrameHeight = "REFRESH_FRAME_HEIGHT";
            FunctionKeys.ShowAugmentationPreview = "SHOW_AUGMENTATION_PREVIEW";
            FunctionKeys.Telemetry = "TELEMETRY";
            // For RegionMode
            FunctionKeys.StartRegionMode = "START_REGION_MODE";
            FunctionKeys.SelectionInProgress = "SELECTION_IN_PROGRESS";
            FunctionKeys.RegionSelected = "REGION_SELECTED";
            FunctionKeys.RegionNotSelected = "REGION_NOT_SELECTED";
            FunctionKeys.StartRegionClip = "START_REGION_CLIP";
            FunctionKeys.RegionClipComplete = "REGION_CLIP_COMPLETE";
            FunctionKeys.StopRegionMode = "STOP_REGION_MODE";
            FunctionKeys.TakeTabScreenshot = "TAKE_TAB_SCREENSHOT";
            FunctionKeys.TakeTabScreenshotCallback = "TAKE_TAB_SCREENSHOT_CALLBACK";
        })(FunctionKeys = Constants.FunctionKeys || (Constants.FunctionKeys = {}));
        var ExtensionMessages;
        (function (ExtensionMessages) {
            // Note: since "captureVisibleTab" is used both client and server side, changing it would break current extensions
            ExtensionMessages.CaptureVisibleTab = "captureVisibleTab";
            ExtensionMessages.ExtensionCallbackMessage = "ExtensionCallback";
            ExtensionMessages.InvokeClipperCommand = "ClipperInvoker";
            ExtensionMessages.Ping = "Ping";
            ExtensionMessages.Pong = "Pong";
        })(ExtensionMessages = Constants.ExtensionMessages || (Constants.ExtensionMessages = {}));
        var CommunicationChannels;
        (function (CommunicationChannels) {
            // Note: since "EXTENSION_CHANNEL" is used both client and server side, changing it would break current extensions
            CommunicationChannels.MainAndExtension = "EXTENSION_CHANNEL";
            CommunicationChannels.MainAndUI = "MAIN_AND_UI";
            CommunicationChannels.MainAndRegion = "MAIN_AND_REGION";
            CommunicationChannels.MainAndPreview = "MAIN_AND_PREVIEW";
        })(CommunicationChannels = Constants.CommunicationChannels || (Constants.CommunicationChannels = {}));
        var VersionNumbers;
        (function (VersionNumbers) {
            VersionNumbers.RequiredVersionForRegionClipping = "2.0.0";
        })(VersionNumbers = Constants.VersionNumbers || (Constants.VersionNumbers = {}));
        var AuthTypes;
        (function (AuthTypes) {
            AuthTypes.WindowsLiveId = "WindowsLiveId";
        })(AuthTypes = Constants.AuthTypes || (Constants.AuthTypes = {}));
        (function (LogLevel) {
            LogLevel[LogLevel["Error"] = 0] = "Error";
            LogLevel[LogLevel["Warning"] = 1] = "Warning";
            LogLevel[LogLevel["Info"] = 2] = "Info";
            LogLevel[LogLevel["Verbose"] = 3] = "Verbose";
            LogLevel[LogLevel["Spam"] = 4] = "Spam";
        })(Constants.LogLevel || (Constants.LogLevel = {}));
        var LogLevel = Constants.LogLevel;
        (function (AugmentationApiStatus) {
            AugmentationApiStatus[AugmentationApiStatus["Waiting"] = 0] = "Waiting";
            AugmentationApiStatus[AugmentationApiStatus["Success"] = 1] = "Success";
            AugmentationApiStatus[AugmentationApiStatus["NoContent"] = 2] = "NoContent";
            AugmentationApiStatus[AugmentationApiStatus["Error"] = 3] = "Error";
        })(Constants.AugmentationApiStatus || (Constants.AugmentationApiStatus = {}));
        var AugmentationApiStatus = Constants.AugmentationApiStatus;
        (function (ClipperClientType) {
            ClipperClientType[ClipperClientType["Bookmarklet"] = 0] = "Bookmarklet";
            ClipperClientType[ClipperClientType["ChromeExtension"] = 1] = "ChromeExtension";
            ClipperClientType[ClipperClientType["FirefoxExtension"] = 2] = "FirefoxExtension";
            ClipperClientType[ClipperClientType["SafariExtension"] = 3] = "SafariExtension";
            ClipperClientType[ClipperClientType["EdgeExtension"] = 4] = "EdgeExtension";
        })(Constants.ClipperClientType || (Constants.ClipperClientType = {}));
        var ClipperClientType = Constants.ClipperClientType;
    })(Constants = Clipper.Constants || (Clipper.Constants = {}));
})(Clipper || (Clipper = {}));
/**
 * Helper utility methods
 */
var Utils;
(function (Utils) {
    /**
     * Gets the locale of the document
     */
    function GetLocale(doc) {
        if (doc === void 0) { doc = document; }
        // window.navigator.userLanguage is defined for IE, and window.navigator.language is defined for other browsers
        var docLocale = doc.getElementsByTagName("html")[0].getAttribute("lang");
        return docLocale ? docLocale : (window.navigator.userLanguage || window.navigator.language);
    }
    Utils.GetLocale = GetLocale;
    /**
     * Sets a browser cookie
     */
    function SetCookie(key, value, expires) {
        if (expires === void 0) { expires = null; }
        var cookieBody = key + "=" + value;
        if (expires) {
            cookieBody += ";expires=" + expires.toUTCString();
        }
        // Mark the cookie as secure
        cookieBody += ";secure";
        document.cookie = cookieBody;
    }
    Utils.SetCookie = SetCookie;
    /**
     * Expires/deletes a browser cookie
     */
    function ExpireCookie(key) {
        SetCookie(key, "", new Date("2000-01-01"));
    }
    Utils.ExpireCookie = ExpireCookie;
    /**
     * Gets a browser cookie
     */
    function GetCookie(key) {
        var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
        return keyValue ? keyValue[2] : null;
    }
    Utils.GetCookie = GetCookie;
    /**
    * Disable click event by preventing and stopping its propagation
    */
    function DisableClick(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    Utils.DisableClick = DisableClick;
    /**
    * Creates a random Guid
    */
    function GenerateGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    Utils.GenerateGuid = GenerateGuid;
    /**
     * Add an <link> tag for a CSS file at a specific location and call a callback function on success.
     *
     * @param fileName The URL of the CSS file.
     * @param callback The function to be called after the CSS is properly loaded.
     */
    function LoadCSS(fileName, className, callback) {
        var fileRef = document.createElement("link");
        fileRef.rel = "stylesheet";
        fileRef.type = "text/css";
        fileRef.href = fileName;
        fileRef.className = className;
        document.head.appendChild(fileRef);
        // Call the callback function once we have downloaded the CSS. We do this by telling the browser to load 
        // the CSS as an image. This causes an error because of the differing MIME types and thus the callback 
        // is called onerror.
        if (callback) {
            var image = new Image();
            image.onerror = callback;
            image.src = fileName;
        }
    }
    Utils.LoadCSS = LoadCSS;
    /**
     * Gets the css value of the attribute on the element
     */
    function GetCssAttribute(element, attribute) {
        if (window.getComputedStyle) {
            return getComputedStyle(element).getPropertyValue(attribute);
        }
        else {
            return element["currentStyle"][attribute];
        }
    }
    Utils.GetCssAttribute = GetCssAttribute;
    /**
     * Sets the css value of the attribute on the element
     */
    function SetCssAttribute(element, attributeName, value) {
        var attributes = [attributeName];
        // Deal with browser prefixed versions
        if (attributeName[0] === "-") {
            attributes = [
                "-ms" + attributeName,
                "-moz" + attributeName,
                "-webkit" + attributeName,
                "-o" + attributeName,
                attributeName.substr(1)
            ];
        }
        for (var i = 0; i < attributes.length; i++) {
            if (element.style.setProperty) {
                element.style.setProperty(attributes[i], value);
            }
            else {
                element.style["setAttribute"](attributes[i], value);
            }
        }
    }
    Utils.SetCssAttribute = SetCssAttribute;
    /**
     * Add a name/value pair to the query string of a URL
     *
     * @param originalUrl The URL to add the name/value to
     * @param name New value name
     * @param value New value
     * @return Resulting URL
     */
    function AddUrlQueryValue(originalUrl, name, value) {
        var newUrl = originalUrl;
        if (-1 === newUrl.indexOf("?")) {
            newUrl += "?";
        }
        else {
            newUrl += "&";
        }
        newUrl += name + "=" + value;
        return newUrl;
    }
    Utils.AddUrlQueryValue = AddUrlQueryValue;
    /**
     * Call the /count/{id}?paramData route
     *
     * This can be used to log telemetry when we are unable to use BrowserUls
     * (for instance, if we are not on our domain)
     *
     * @param hostName The name of the host to hit (ex: www.onenote.com)
     * @param id The Id of the datapoint
     * @param paramData The data to send, usually in the format of params ("key1=value1,key2=value2")
     */
    function SendDataToCountEndpoint(hostName, id, paramData) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "https://" + hostName + "/count/" + id + "?" + paramData);
        xmlhttp.send();
    }
    Utils.SendDataToCountEndpoint = SendDataToCountEndpoint;
    /*
     * Retrieve the localized string from the server for the given id using /Strings?ids={ids}
     *
     * @param hostName The name of the server to use (ex: www.onenote.com)
     * @param stringId The resourceId to look up in the strings table
     * @param defaultString Optional string in case we are unable to get a result, defaults to null
     * @return The localized string. If unobtained then we return "" or optionally the defaultString value
     */
    function GetLocalizedStringFromServer(hostName, stringId, defaultString) {
        if (defaultString === void 0) { defaultString = ""; }
        var stringResults = GetLocalizedStringsFromServer(hostName, stringId);
        if (stringResults[stringId] == null || stringResults[stringId] === "") {
            return defaultString;
        }
        return stringResults[stringId];
    }
    Utils.GetLocalizedStringFromServer = GetLocalizedStringFromServer;
    /*
     * Retrieve the localized strings from the server for the given ids using /Strings?ids={ids}
     *
     * @param hostName The name of the server to use (ex: www.onenote.com)
     * @param stringIds The resourceIds to look up in the strings table
     * @return an associative array of any values obtained. If there was an error, then an empty object is returned
     */
    function GetLocalizedStringsFromServer(hostName, stringPrefix) {
        try {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "https://" + hostName + "/Strings?ids=" + stringPrefix, false);
            xmlhttp.send();
            return JSON.parse(xmlhttp.responseText);
        }
        catch (error) {
            // Either there was an error communicating with the server, or an error parsing the results
            SendDataToCountEndpoint(hostName, "StringsUtil", "error=" + error);
            return {};
        }
    }
    Utils.GetLocalizedStringsFromServer = GetLocalizedStringsFromServer;
    /*
     * There are times when we want to log message to console, but we don't want to ship it that way. This allows us
     * to be able to turn on logging locally and see the messages.
     *
     * @param message The message you want to output to the console.
     */
    function LogToConsole(message) {
        var consoleOutputEnabledInLocalStorage = false;
        // If you want to enable ULS logging to the console, run this in your console window:
        //    localStorage.EnableConsoleLogging = true
        try {
            if (typeof (Storage) !== "undefined") {
                consoleOutputEnabledInLocalStorage = (localStorage.getItem("EnableConsoleLogging") === "true");
            }
        }
        catch (error) {
        }
        if (consoleOutputEnabledInLocalStorage) {
            console.log(message);
        }
    }
    Utils.LogToConsole = LogToConsole;
})(Utils || (Utils = {}));
//extend String.prototype.format() function
//so that "Showing {0} result".format(num) will work for js
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined"
                ? args[number]
                : match;
        });
    };
}
/// <reference path="../ClipperConstants.ts"/>
/// <reference path="../../Utils.ts"/>
/// <reference path="../../StringFunctions.ts"/>
if (typeof (HostName) === "undefined") {
    HostName = "www.onenote.com";
}
if (typeof (ClipperDomains) === "undefined") {
    ClipperDomains = [
        "https://www.onenote.com",
        "https://cdn.onenote.net",
        "https://login.live.com"
    ];
}
var Clipper;
(function (Clipper) {
    var Extensions;
    (function (Extensions) {
        /*
         * The base class for all of the Clipper extensions
         * Note: This class should be extended, and the following methods should be defined:
         *     GetLocalValue(key:string, callback:(value:string)=>void)
         *     SetLocalValue(key:string, value:string)
         *     GetExtensionVersion(): string
         */
        var ClipperExtensionBase = (function () {
            function ClipperExtensionBase(clipperType) {
                var _this = this;
                // Note: can't change this or we'll break existing values stored
                this._clipperIdStorageKey = "clipperId";
                this.ClipperType = Clipper.Constants.ClipperClientType[clipperType];
                this.ClipperVersion = this.GetExtensionVersion();
                this.GetLocalValue(this._clipperIdStorageKey, function (clipperId) {
                    if (clipperId == null || clipperId === "") {
                        // New install
                        clipperId = _this.GenerateClipperId();
                        _this.SetLocalValue(_this._clipperIdStorageKey, clipperId);
                        _this.ClipperId = clipperId;
                        _this.OnFirstRun();
                    }
                    else {
                        _this.ClipperId = clipperId;
                    }
                });
            }
            /*
             * PLEASE OVERRIDE: Gets a value from local storage
             */
            ClipperExtensionBase.prototype.GetLocalValue = function (key, callback) {
                throw "Not Implemented";
            };
            /*
             * PLEASE OVERRIDE: Set a value in local storage
             */
            ClipperExtensionBase.prototype.SetLocalValue = function (key, value) {
                throw "Not Implemented";
            };
            /*
             * PLEASE OVERRIDE: Get the current installed extension's version
             */
            ClipperExtensionBase.prototype.GetExtensionVersion = function () {
                throw "Not Implemented";
            };
            /*
             * PLEASE OVERRIDE: Called when the extension is run for the first time
             */
            ClipperExtensionBase.prototype.OnFirstRun = function () {
            };
            /*
             * Returns the URL that should be injected when the Clipper is invoked
             */
            ClipperExtensionBase.prototype.GetClipperRootUrl = function (additionalQueryString) {
                return "https://" + HostName + "/clipper/root?ClipperType=" + this.ClipperType + "&ClipperId=" + this.ClipperId + "&ClipperVersion=" + this.ClipperVersion + (additionalQueryString ? additionalQueryString : "");
            };
            /*
             * Returns the URL for more information about the Clipper
             */
            ClipperExtensionBase.prototype.GetClipperInstalledPageUrl = function () {
                return "https://" + HostName + "/clipper/installed?ClipperType=" + this.ClipperType + "&ClipperId=" + this.ClipperId + "&ClipperVersion=" + this.ClipperVersion;
            };
            /*
             * Determines if the url is on our domain or not
             */
            ClipperExtensionBase.prototype.IsOnOneNoteDomain = function (url) {
                return url.indexOf("onenote.com") >= 0 || url.indexOf("onenote-int.com") >= 0;
            };
            /*
             * Generates a new clipperId, should only be called on first run
             */
            ClipperExtensionBase.prototype.GenerateClipperId = function () {
                var clipperPrefix = "ON";
                return clipperPrefix + "-" + Utils.GenerateGuid();
            };
            /*
             * Utility method used to send data to our servers when one of our extensions NoOps or hits a reserved URL
             */
            ClipperExtensionBase.prototype.SendDataToEndpointAndAlertUser = function (logIdentifier, tabContentWindow) {
                var defaultString = "Sorry, this type of page can't be clipped.";
                var userErrorString = Utils.GetLocalizedStringFromServer(HostName, "ClipperUI.UnsupportedPageTypeError", defaultString);
                Utils.SendDataToCountEndpoint(HostName, "Clipper", "ClipperId={0}, ClipperType={1}, ClipperVersion={2}, Message={3}".format(this.ClipperId, this.ClipperType, this.ClipperVersion, logIdentifier));
                if (tabContentWindow) {
                    tabContentWindow.alert(userErrorString);
                }
                else {
                    alert(userErrorString);
                }
            };
            return ClipperExtensionBase;
        }());
        Extensions.ClipperExtensionBase = ClipperExtensionBase;
    })(Extensions = Clipper.Extensions || (Clipper.Extensions = {}));
})(Clipper || (Clipper = {}));
/// <reference path="../../../../Definitions/chrome.d.ts" />
/// <reference path="../../../ClipperConstants.ts"/>
/// <reference path="../../ClipperExtensionBase.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chrome = browser;
var ChromeStorage = chrome.storage.local;
var Clipper;
(function (Clipper) {
    var Extensions;
    (function (Extensions) {
        var EdgeExtension = (function (_super) {
            __extends(EdgeExtension, _super);
            function EdgeExtension() {
                var _this = this;
                _super.call(this, Clipper.Constants.ClipperClientType.EdgeExtension);
                // Register the actual button in the chrome UI
                chrome.browserAction.onClicked.addListener(function (tab) {
                    _this.InvokeClipper(tab.id);
                });
            }
            /*
             * Inject the clipper code into the tab
             */
            EdgeExtension.prototype.InvokeClipper = function (tabId, additionalQueryString, callback) {
                chrome.tabs.executeScript(tabId, { code: "var clipperRootUrl = \"" + this.GetClipperRootUrl(additionalQueryString) + "\";" }, function () {
                    // TODO
                    //if (chrome.runtime.lastError)
                    //{
                    //this.SendDataToEndpointAndAlertUser(chrome.runtime.lastError.message);
                    //return;
                    //}
                    chrome.tabs.executeScript(tabId, { file: "edgeinject.js" }, function () {
                        if (callback) {
                            callback();
                        }
                    });
                });
            };
            /*
             * Get a value from local storage
             */
            EdgeExtension.prototype.GetLocalValue = function (key, callback) {
                ChromeStorage.get(key, function (data) {
                    callback(data[key]);
                });
            };
            /*
             * Set a value in local storage
             */
            EdgeExtension.prototype.SetLocalValue = function (key, value) {
                var data = {};
                data[key] = value;
                ChromeStorage.set(data);
            };
            /*
             * Get the extension's version.
             */
            EdgeExtension.prototype.GetExtensionVersion = function () {
                return chrome.runtime.getManifest().version;
            };
            /*
             * Called when the extension is run for the first time
             */
            EdgeExtension.prototype.OnFirstRun = function () {
                var _this = this;
                // Send users to our installed page (redirect if they're already on our page, else open a new tab)
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
                    if (_this.IsOnOneNoteDomain(tabs[0].url)) {
                        chrome.tabs.update(tabs[0].id, { url: _this.GetClipperInstalledPageUrl() });
                    }
                    else {
                        chrome.tabs.create({ url: _this.GetClipperInstalledPageUrl() });
                    }
                });
            };
            return EdgeExtension;
        }(Extensions.ClipperExtensionBase));
        Extensions.EdgeExtension = EdgeExtension;
    })(Extensions = Clipper.Extensions || (Clipper.Extensions = {}));
})(Clipper || (Clipper = {}));
var ClipperObject = new Clipper.Extensions.EdgeExtension();
/// <reference path="../../../../Definitions/chrome.d.ts" />
/// <reference path="../../../ClipperConstants.ts"/>
/// <reference path="EdgeExtension.ts"/>
// Register a message listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === Clipper.Constants.ExtensionMessages.CaptureVisibleTab) {
        chrome.tabs.captureVisibleTab(null, function (dataUrl) {
            sendResponse(dataUrl);
        });
        return true;
    }
    else {
        return false;
    }
});
