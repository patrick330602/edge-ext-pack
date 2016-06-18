var Utils;
(function (Utils) {
    var SmartValue = (function () {
        function SmartValue(t) {
            if (t === void 0) { t = null; }
            this._t = null;
            this._subscriptions = [];
            this._t = t;
        }
        SmartValue.prototype.Subscribe = function (func) {
            this._subscriptions.push(func);
            func(this._t);
        };
        SmartValue.prototype.Set = function (t) {
            if (this._t !== t) {
                this._t = t;
                for (var i = 0; i < this._subscriptions.length; i++) {
                    this._subscriptions[i](this._t);
                }
            }
        };
        SmartValue.prototype.Get = function () {
            return this._t;
        };
        SmartValue.prototype.Equals = function (t) {
            return this._t === t;
        };
        SmartValue.prototype.ToString = function () {
            return this._t == null ? "null" : this._t.toString();
        };
        // Subscribe to multiple SVs.
        // Example:
        // var appleColor: SmartValue<string>;
        // var appleCount: SmartValue<number>;
        // Subscribe( [appleColor, appleCount], function(color, count) { /*Do something*/});
        SmartValue.Subscribe = function (values, func) {
            for (var i = 0; i < values.length; i++) {
                values[i].Subscribe(function () {
                    var currValues = [];
                    for (var i = 0; i < values.length; i++) {
                        currValues.push(values[i].Get());
                    }
                    // ReSharper disable once SuspiciousThisUsage
                    func.apply(this, currValues);
                });
            }
        };
        return SmartValue;
    }());
    Utils.SmartValue = SmartValue;
})(Utils || (Utils = {}));
/****************************************************************************
    Events.ts

    This module is used for the initialization and tracking of events.

    UnitTests: EmailSettingsUnitTests.ts
****************************************************************************/
var Events;
(function (Events) {
    var KeyCode;
    (function (KeyCode) {
        KeyCode.Tab = 9;
        KeyCode.Enter = 13;
        KeyCode.Esc = 27;
    })(KeyCode = Events.KeyCode || (Events.KeyCode = {}));
    // Keep a list of all added element listeners
    var ActiveListeners = [];
    function AddEventListener(object, type, listener) {
        if (object.addEventListener) {
            object.addEventListener(type, listener);
        }
        else {
            object["attachEvent"]("on" + type, listener);
        }
        ActiveListeners.push({ Element: object, Type: type, Listener: listener });
    }
    Events.AddEventListener = AddEventListener;
    function RemoveEventListener(object, type, listener) {
        if (object.removeEventListener) {
            object.removeEventListener(type, listener);
        }
        else {
            object["detachEvent"]("on" + type, listener);
        }
    }
    Events.RemoveEventListener = RemoveEventListener;
    /**
     * Attach a click handler to an HTMLElement, referenced by ID and also attach an event listener to the window so that
     * the same handler is called if the element is in focus and the user presses enter
     *
     * @param id The id of the HTMLElement to register an event listener on
     * @param listener The function to be attached to the event
     */
    function RegisterAccesibleSelectionListener(id, listener) {
        var element = document.getElementById(id);
        if (element != null) {
            RegisterAccesibleSelectionListenerByElement(element, listener);
        }
    }
    Events.RegisterAccesibleSelectionListener = RegisterAccesibleSelectionListener;
    function SetCss(element, attribute, value) {
        if (element.style[attribute] === value) {
            return;
        }
        if (element.style.setProperty) {
            element.style.setProperty(attribute, value);
        }
        else {
            element.style.setAttribute(attribute, value);
        }
    }
    /**
     * Attach a click handler to an HTMLElement and also attach an keyup listener to the element so that
     * the same handler is called if the element is in focus and the user presses enter
     *
     * @param element The HTMLElement to register an event listener on
     * @param listener The function to be attached to the event
     */
    function RegisterAccesibleSelectionListenerByElement(element, listener) {
        //  Hide the outline if they are using a mouse, but show it if they are using the keyboard
        // (idea from http://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/)
        AddEventListener(element, "mousedown", function () {
            SetCss(element, "outline-style", "none");
        });
        AddEventListener(element, "click", listener);
        AddEventListener(element, "keyup", function (event) {
            // keyboard events always fire, don't do anything if we are not the active element
            if (document.activeElement !== element) {
                return;
            }
            if (event.keyCode === KeyCode.Enter) {
                // Hitting Enter on <a> tags that contains an href automatically fire the click event, so don't do it again
                if (!((element.tagName === "a" || element.tagName === "A") && element.hasAttribute("href"))) {
                    listener(event);
                }
            }
            else if (event.keyCode === KeyCode.Tab) {
                // Since they are using the keyboard, revert to the default value of the outline so it is visible
                SetCss(element, "outline-style", "");
            }
        });
    }
    Events.RegisterAccesibleSelectionListenerByElement = RegisterAccesibleSelectionListenerByElement;
    /**
        * Attach an event to an existing HTMLElement, referenced by ID
        *
        * @param id The id of the HTMLElement to register an event listener on
        * @param type The type of event we are listening for (e.g. 'mouseover')
        * @param listener The function to be attached to the event
        */
    function RegisterEventListenerById(id, type, listener) {
        var element = document.getElementById(id);
        if (element) {
            AddEventListener(element, type, listener);
        }
    }
    Events.RegisterEventListenerById = RegisterEventListenerById;
    /**
        * Attach an event to the window
        *
        * @param type The type of event we are listening for (e.g. 'mouseover')
        * @param listener The function to be attached to the event
        */
    function RegisterWindowEventListener(type, listener) {
        AddEventListener(window, type, listener);
    }
    Events.RegisterWindowEventListener = RegisterWindowEventListener;
    /**
        * Register an effect for when the user presses Esc
        */
    function RegisterEscListener(listener) {
        Events.RegisterWindowEventListener("keyup", function (event) {
            if (event.keyCode === KeyCode.Esc) {
                listener(event);
            }
        });
    }
    Events.RegisterEscListener = RegisterEscListener;
    /**
        * Dismiss the Events module and de-register any active event listeners
        */
    function DismissAllListeners() {
        for (var i = 0; i < ActiveListeners.length; i++) {
            var listenerData = ActiveListeners[i];
            RemoveEventListener(listenerData.Element, listenerData.Type, listenerData.Listener);
        }
    }
    Events.DismissAllListeners = DismissAllListeners;
})(Events || (Events = {}));
/// <reference path="SmartValue.ts" />
/// <reference path="Events.ts" />
var Utils;
(function (Utils) {
    // communication manager class for handling message passing between windows
    var Communicator = (function () {
        function Communicator(getOtherWindow, communicationChannel) {
            var _this = this;
            this._otherSideInitialized = false;
            this._otherSideKeys = [];
            this._thisSideKeys = [];
            this._queuedCalls = {};
            this._functionMap = {};
            this._registrationKey = "REGISTER-FUNCTION-234234f24";
            this._initializationKey = "INIT-3n083nk6";
            this._setValuePrefix = "SETVALUE-";
            this.handleMessage = function (event) {
                var dataPackage;
                try {
                    dataPackage = JSON.parse(event.data);
                }
                catch (error) {
                    // Ignore messages that aren't in the expected format
                    return;
                }
                // If it came from self, ignore it :)
                if (dataPackage.commId === _this._myUniqueCommId) {
                    return;
                }
                // If we specified a channel, then check it, if we didn't, then we ignore anything with one
                if ((_this._channel && (!dataPackage.channel || dataPackage.channel !== _this._channel))
                    || (!_this._channel && dataPackage.channel != null)) {
                    return;
                }
                if (dataPackage.functionKey === _this._registrationKey) {
                    // The other side is registering a function with us.
                    var newKey = dataPackage.data.toString();
                    _this._otherSideKeys.push(newKey);
                    _this.OnNewFunctionAvailable(newKey);
                    if (_this._queuedCalls[newKey]) {
                        // Pass any calls to that function that we had saved up
                        var calls = _this._queuedCalls[newKey];
                        for (var i = 0; i < calls.length; i++) {
                            _this.PostMessage(calls[i]);
                        }
                    }
                }
                else if (dataPackage.functionKey === _this._initializationKey) {
                    // The other side is coming online now, let's let them know we're alive.
                    _this._otherSideInitialized = true;
                    if (dataPackage.data) {
                        // they already know about our functions, not need to sent initialization key again
                        _this.SendInitializationMessage(false);
                    }
                    // And tell it about our sweet functions
                    for (var i = 0; i < _this._thisSideKeys.length; i++) {
                        _this.PostMessage({ functionKey: _this._registrationKey, data: _this._thisSideKeys[i] });
                    }
                }
                else {
                    // Handle a normal function call from the other side
                    var func = _this._functionMap[dataPackage.functionKey];
                    if (func) {
                        var result = func(dataPackage.data);
                        if (dataPackage.callbackKey) {
                            _this.CallRemoteFunction(dataPackage.callbackKey, result);
                        }
                    }
                }
                // Since the message was correctly handled, we don't want any pre-established handlers getting called
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                else {
                    event.cancelBubble = true;
                }
            };
            this._getOtherWindow = getOtherWindow;
            this._channel = communicationChannel;
            this._myUniqueCommId = this.CreateUniqueId();
            Events.RegisterWindowEventListener("message", this.handleMessage);
            this.SendInitializationMessage(true);
        }
        Communicator.prototype.SendInitializationMessage = function (firstTime) {
            this.PostMessage({ functionKey: this._initializationKey, data: firstTime });
        };
        Communicator.prototype.RegisterFunction = function (name, func) {
            this._functionMap[name] = func;
            if (this._otherSideInitialized) {
                this.PostMessage({ functionKey: this._registrationKey, data: name });
            }
            // always keeps track of what we have
            this._thisSideKeys.push(name);
        };
        Communicator.prototype.CallRemoteFunction = function (name, data, callback) {
            var dataPackage = { functionKey: name, data: data };
            if (callback)
                dataPackage.callbackKey = callback;
            if (this._otherSideKeys.indexOf(name) >= 0) {
                this.PostMessage(dataPackage);
            }
            else {
                this._queuedCalls[name] = this._queuedCalls[name] || [];
                this._queuedCalls[name].push(dataPackage);
            }
        };
        Communicator.prototype.SubscribeAcrossCommunicator = function (sv, name) {
            this.RegisterFunction(this._setValuePrefix + name, function (val) { sv.Set(val); });
        };
        Communicator.prototype.BroadcastAcrossCommunicator = function (sv, name) {
            var _this = this;
            sv.Subscribe(function (val) { _this.CallRemoteFunction(_this._setValuePrefix + name, val); });
        };
        Communicator.prototype.OnNewFunctionAvailable = function (functionKey) {
        };
        Communicator.prototype.Dismiss = function () {
            Events.RemoveEventListener(window, "message", this.handleMessage);
        };
        Communicator.prototype.PostMessage = function (dataPackage) {
            // If we specified a channel, then we always send that with the message
            if (this._channel) {
                dataPackage.channel = this._channel;
            }
            dataPackage.commId = this._myUniqueCommId;
            this._getOtherWindow().postMessage(JSON.stringify(dataPackage), "*");
        };
        Communicator.prototype.CreateUniqueId = function () {
            var id = "";
            var salt = Date.now();
            for (var i = 0; i < 16; i++) {
                var value = (salt + Math.random() * 16) % 16 | 0;
                id += value.toString(16);
                salt = Math.floor(salt / 16);
            }
            return id;
        };
        return Communicator;
    }());
    Utils.Communicator = Communicator;
})(Utils || (Utils = {}));
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
/// <reference path="../../Communicator.ts"/>
/// <reference path="../ClipperConstants.ts"/>
var Clipper;
(function (Clipper) {
    var Extensions;
    (function (Extensions) {
        var ClipperInjectBase = (function () {
            function ClipperInjectBase() {
            }
            /*
             * This code invokes the clipper code from our site
             * Note: The bookmarklet version of this code is in "GetInstallButtonLink" (ClipperViewPage.cs)
             */
            ClipperInjectBase.prototype.InvokeClipperScript = function (clipperRootUrl) {
                var jsCode = document.createElement("script");
                jsCode.setAttribute("src", clipperRootUrl);
                jsCode.setAttribute("id", "oneNoteCaptureRootScript");
                jsCode.setAttribute("type", "text/javascript");
                document.body.appendChild(jsCode);
            };
            /*
             * Allows the Extension code to communicate with this Content Script
             */
            ClipperInjectBase.prototype.InitializeCommunicationBridge = function (extensionMessageHandler) {
                var _this = this;
                if (this._communicator == null) {
                    this._communicator = new Utils.Communicator(function () { return window; }, Clipper.Constants.CommunicationChannels.MainAndExtension);
                    this._communicator.RegisterFunction(Clipper.Constants.FunctionKeys.TakeTabScreenshot, function () {
                        extensionMessageHandler(Clipper.Constants.ExtensionMessages.CaptureVisibleTab, function (dataUrl) {
                            _this._communicator.CallRemoteFunction(Clipper.Constants.FunctionKeys.TakeTabScreenshotCallback, dataUrl);
                        });
                    });
                }
            };
            return ClipperInjectBase;
        }());
        Extensions.ClipperInjectBase = ClipperInjectBase;
    })(Extensions = Clipper.Extensions || (Clipper.Extensions = {}));
})(Clipper || (Clipper = {}));
/// <reference path="../../../../Definitions/chrome.d.ts"/>
/// <reference path="../../ClipperInjectBase.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Clipper;
(function (Clipper) {
    var Extensions;
    (function (Extensions) {
        var EdgeInject = (function (_super) {
            __extends(EdgeInject, _super);
            function EdgeInject() {
                _super.call(this);
                this.InitializeCommunicationBridge(function (message, callback) {
                    chrome.runtime.sendMessage({ action: message }, function (result) {
                        callback(result);
                    });
                });
            }
            return EdgeInject;
        }(Extensions.ClipperInjectBase));
        Extensions.EdgeInject = EdgeInject;
    })(Extensions = Clipper.Extensions || (Clipper.Extensions = {}));
})(Clipper || (Clipper = {}));
// Initialize the first time
var edgeInject = edgeInject ? edgeInject : new Clipper.Extensions.EdgeInject();
edgeInject.InvokeClipperScript(clipperRootUrl);
