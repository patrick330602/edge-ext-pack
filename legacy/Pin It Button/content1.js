/* jshint indent: false, maxlen: false */
// disqualify domains we know can't show the pinmarklet
try{
(function (w, d, n, c, a) {
  var $ = w[a.k] = {
    'w': w,
    'd': d,
    'a': a,
    'n': n,
    'c': c,
    's': {},
    'v': {'debug': false, 'noPin': false, 'og': {} },
    'f': (function () {
      return {

        // debug
        debug: function (str) {
          if (str && $.v.debug === true) {
            console.log($.v.xv + ': ' + str);
          }
        },

        // compute the SHA-1 hash for a string
        getHash: function (str) {
          function rstr2binb (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++) {
              output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
              output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            }
            return output;
          }
          function binb2rstr (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
              output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
            }
            return output;
          }
          function safe_add (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
          }
          function bit_rol (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
          }
          function binb_sha1 (x, len) {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;
            var w = Array(80);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
            var e = -1009589776;
            for (var i = 0; i < x.length; i += 16) {
              var olda = a;
              var oldb = b;
              var oldc = c;
              var oldd = d;
              var olde = e;
              for (var j = 0; j < 80; j++) {
                if (j < 16) {
                  w[j] = x[i + j];
                } else {
                  w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                }
                var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = bit_rol(b, 30);
                b = a;
                a = t;
              }
              a = safe_add(a, olda);
              b = safe_add(b, oldb);
              c = safe_add(c, oldc);
              d = safe_add(d, oldd);
              e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);
          }
          function sha1_ft (t, b, c, d) {
            if(t < 20) return (b & c) | ((~b) & d);
            if(t < 40) return b ^ c ^ d;
            if(t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
          }
          function sha1_kt (t) {
            return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 : (t < 60) ? -1894007588 : -899497514;
          }
          function rstr_sha1 (s) {
            return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
          }
          function rstr2hex (input) {
            var hex_tab = "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
              x = input.charCodeAt(i);
              output = output + hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
            }
            return output;
          }
          return rstr2hex(rstr_sha1(str));
        },

        // get a DOM property or text attribute
        get: function (el, att) {
          var v = null;
          if (typeof el[att] === 'string') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },

        // set a DOM property or text attribute
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },

        // create a DOM element
        make: function (obj) {
          var el = false, tag, att, key;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  } else {
                    if (att === 'style') {
                      for (key in obj[tag][att]) {
                        el.style[key] = obj[tag][att][key];
                      }
                    }
                  }
                }
              }
              break;
            }
          }
          return el;
        },

        // remove a DOM element
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },

        // find an event's target element
        getEl: function (e) {
          var el = null;
          if (e.target) {
            el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
          } else {
            el = e.srcElement;
          }
          return el;
        },

        // listen for events
        listen: function (el, ev, fn) {
          if (el) {
            if (typeof $.w.addEventListener !== 'undefined') {
              el.addEventListener(ev, fn, false);
            } else if (typeof $.w.attachEvent !== 'undefined') {
              el.attachEvent('on' + ev, fn);
            }
          }
        },

        // return the domain part of an URL
        getDomain: function (url) {
          var p = url.split('/');
          if (p[2]) {
            return p[2];
          } else {
            return url;
          }
        },

        // get the position of a DOM element
        getPos: function (el) {
          var x = 0, y = 0;
          if (el.offsetParent) {
            do {
              x = x + el.offsetLeft;
              y = y + el.offsetTop;
            } while (el = el.offsetParent);
            return {"left": x, "top": y};
          }
        },

        // get negative top or left margins
        getMargin: function (el, prop) {
          var margin;
          margin = getComputedStyle(el).getPropertyValue("margin-" + prop);
          if (margin) {
            margin = margin.split('px')[0];
          }
          if (margin > 0) {
            margin = 0;
          }
          margin = parseInt(margin);
          return margin;
        },

        // send a message
        sendMessage: function (obj) {
          $.f.debug('Sending message');
          $.f.debug(JSON.stringify(obj));
          $.c.runtime.sendMessage(obj, function() {});
        },

        // log from the background process
        log: function (obj) {
          var i, str = '';
          // optional parameters
          if (obj) {
            for (i in obj) {
              if (typeof obj[i] !== 'undefined') {
                str = str + '&' + i + '=' + obj[i];
              }
            }
          }
          str = str + '&via=' + encodeURIComponent($.d.URL);
          $.f.debug('logging');
          $.f.debug(JSON.stringify(obj));
          $.f.sendMessage({'logAction': str});
        },

        // if we have more parts in our domain left to try, concatenate and try again
        hashDomain: function () {
          $.f.debug('getting hash for ' + $.v.hashDomain);
          $.f.gotDomainHash($.f.getHash($.v.hashDomain));
        },

        // check meta tags
        metaCheck: function () {
          var canHaz = true, i, n, name, content, property;
          $.v.meta = $.d.getElementsByTagName('META');
          for (i = 0, n = $.v.meta.length; i < n; i = i + 1) {
            name = $.v.meta[i].getAttribute('name');
            content = $.v.meta[i].getAttribute('content');
            property = $.v.meta[i].getAttribute('property');

            if (property && property.match(/^og:/) && content) {
              var tag = property.split(':')[1];
              $.v.og[tag] = content;
            }

            if (name && content && name.toLowerCase() === 'pinterest') {
              content = content.toLowerCase();
              if (content === 'nopin') {
                $.v.noPin = true;
                canHaz = false;
              }
              if (content === 'nohover') {
                $.v.hideHoverButtons = true;
                canHaz = false;
              }
            }
          }
          return canHaz;
        },

        // mouse over; only active if we have floaters
        over: function (e) {
          var p, el, url, media, h, w, marginTop, marginLeft;

          if (!$.v.hideHoverButtons && $.s.button) {
            el = $.f.getEl(e);
            if (el && !$.v.noPin) {
              if (el === $.s.button) {
                $.w.clearTimeout($.v.hazFade);
                return;
              }
              if (el.tagName === 'IMG') {
                if (el.src) {
                  if (!el.src.match(/^data/)) {
                    if (!$.f.get(el, 'nopin') && !$.f.get(el, 'data-pin-nopin')) {
                      if (!$.f.get(el, 'data-pin-no-hover')) {
                        h = el.naturalHeight || el.height;
                        w = el.naturalWidth || el.width;
                        if (((h > 99 && w > 199) || (h > 199 && w > 99)) && (el.height > 79 && el.width > 79)) {
                          if (w / h < $.a.maxAspectRatio) {
                            if ($.v.hazButton === false) {
                              p = $.f.getPos(el);
                              if (p.left && p.top) {
                                marginTop = $.f.getMargin(el, 'top');
                                marginLeft = $.f.getMargin(el, 'left');
                                $.w.clearTimeout($.v.hazFade);
                                $.v.hazButton = true;
                                url = $.f.get(el, 'data-pin-url') || $.d.URL;
                                media = $.f.get(el, 'data-pin-media') || el.src;
                                $.s.button.style.top = (p.top + $.a.position.offsetTop - marginTop) + 'px';
                                $.s.button.style.left = (p.left + $.a.position.offsetLeft - marginLeft) + 'px';
                                $.s.button.style.display = 'block';
                                $.v.hoverImage = el;
                              }
                            }
                          }
                        } else {
                          $.f.set(el, 'data-pin-nopin', true);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        // hide hoverbutton
        hide: function () {
          if (!$.v.noPin && $.s.button) {
            $.v.hazButton = false;
            $.v.hazFade = $.w.setTimeout(function () {
              $.s.button.style.display = 'none';
            }, 10);
          }
        },

        // mouse out
        out: function () {
          if ($.v.hazButton === true) {
            $.v.hazButton = false;
            $.f.hide();
          }
        },

        // position and size the pin create form
        getPop: function () {
          var top, left, height, width, popTop, popLeft;
		  
          top = $.w.screenY || $.w.screenTop || 0;
          left = $.w.screenX || $.w.screenLeft || 0;
          height = $.d.b.clientHeight || $.w.innerHeight || 0;
          width = $.d.b.clientWidth || $.w.innerWidth || 0;
          popTop = top + 200;
          popLeft = left + (width / 2) - ($.a.pop.width / 2);
          return $.a.pop.base + 'height=' + $.a.pop.height + ',width=' + $.a.pop.width + ',left=' + popLeft + ',top=' + popTop;
        },

        // open the pin create form
        pop: function (img, method) {
          if ($.v.doNotPin === true) {
            $.v.doNotPin = false;
            return;
          }
          if (!method) {
            // default to hoverbutton method
            method = 'h';
          }
          var description, query, url, media, patched, id;
          patched = $.f.patchImage(img);
          id = $.f.get(img, 'data-pin-id');
          if (id) {
            // repin
            query = $.v.rePinCreate.replace(/%s/, id);
            $.f.log({'event': 'click', 'repin': id});
          } else {
            // new pin
            description = $.f.get(img, 'data-pin-description') || patched.description || img.title || img.alt || $.d.title;
            url = $.f.get(img, 'data-pin-url') || patched.url || $.d.URL;
            media = $.f.get(img, 'data-pin-media') || patched.media || img.src;
			
			query = $.v.pinCreate + '?url=' + encodeURIComponent(url) + '&media=' + encodeURIComponent(media) + '&xm=' + method + '&xv=' + $.v.xv + '&xuid=' + $.v.xuid + '&description=' + encodeURIComponent(description);
            var logMe = {'event': 'click', 'xm': method};
            $.f.log(logMe);
          }
          $.w.open(query, 'pin' + new Date().getTime(), $.f.getPop());
        },

        // called from background page on right-click to pin data:uri
        warn: function () {
          $.w.alert($.v.noPinError);
        },

        // check an image for pinnability
        check: function (img, method) {
          if ($.v.noPin || $.f.get(img, 'data-pin-nopin') || $.f.get(img, 'nopin')) {
            $.f.warn();
            return;
          } else {
            $.f.pop(img, method);
          }
        },

        // also called by extension framework for right-click-to-pin
        noPinList: function () {
          var i, n, domain, r;
          r = false;
          domain = $.f.getDomain($.d.URL);
          for (i = 0, n = $.a.privateList.length; i < n; i = i + 1) {
            if (domain.match($.a.privateList[i])) {
              $.v.noPin = true;
              r = true;
              break;
            }
          }
          return r;
        },

        // should we hide hoverbuttons?
        noHoverList: function () {
          var i, n, domain, r, j, k, parts, check, base, hash, h;
          r = false;
          // check list of known private/login domains
          for (i = 0, n = $.a.noHoverPageList.length; i < n; i = i + 1) {
            if ($.d.URL.match($.a.noHoverPageList[i])) {
              r = true;
              break;
            }
          }
          return r;
        },

        // called by background process for right-click-to-pin
        rightClick: function (src) {
          var i, n, images;
          // metaCheck may not already have been done
          $.f.metaCheck();
          if ($.v.noPin) {
            $.f.warn();
          } else {
            // convert source of image we've right-clicked into an image so we can check it
            images = $.d.getElementsByTagName('IMG');
            for (i = 0, n = images.length; i < n; i = i + 1) {
              if (images[i] && images[i].src && images[i].src === src) {
			  $.f.check(images[i], 'r');
                break;
              }
            }
          }
        },

        // hoverbutton click
        click: function () {
          $.f.check($.v.hoverImage);
        },

        // should the button appear on this page?
        canHazButton: function () {
          // no need to build structure if we're not showing hoverbuttons
          if ($.v.hideHoverButtons) {
            return false;
          }
          var i, n, script, src, meta, name, content;
          // no images? no button
          if (!$.d.getElementsByTagName('IMG').length) {
            $.v.hideHoverButtons = true;
            return false;
          }
          // if we find data-pin-hover, meaning pinit.js is already running with hoverbuttons
          if ($.f.get($.d.b, 'data-pin-hover')) {
            $.v.hideHoverButtons = true;
            return false;
          }
          // if we find pinit.js with data-pin-hover, meaning pinit.js has data-pin-hover but has not loaded yet
          script = $.d.getElementsByTagName('SCRIPT');
          for (i = 0, n = script.length; i < n; i = i + 1) {
            src = script[i].src;
            if (src && src.match($.a.urlPattern.pinitJs)) {
              if (src.getAttribute('data-pin-hover')) {
                $.v.hideHoverButtons = true;
                return false;
                break;
              }
            }
          }
          // meta name=pinterest content=hover or content=nopin
          if (!$.f.metaCheck()) {
            return false;
          }
          // if we find a Pinterest app domain, which has three or less numbers or letters, an optional dot, and then pinterest.com
          if ($.d.URL.match($.a.urlPattern.pinterestApp)) {
            $.v.hideHoverButtons = true;
            return false;
          }

          // check document.URL against gray list
         if ($.f.noPinList() || $.f.noHoverList()) {
            return false;
          }

          return true;
        },

        // trade a language for a domain
        langToDomain: function () {
          // this will run once on init and (eventually) once for every widget that has a data-pin-lang specified
          var i, n, str, langPart, locPart, strParts, checkDomain, thisDomain, domainMatch, langMatch, assetMatch, foundDomain;
          str = $.n.language;
          // clean input
          if (!str) {
            str = 'en';
          }
          str = str.toLowerCase();
          // find language part and optional location part
          strParts = str.split('-');
          langPart = strParts[0];
          if (strParts.length === 2) {
            locPart = strParts[1];
          }
          // defaults
          domainMatch = $.a.defaults.domain;
          langMatch = $.a.defaults.lang;
          assetMatch = $.a.defaults.assets;
          // if this goes to true we will break all loops and return
          foundDomain = false;
          // loop through all the domains we know about
          for (checkDomain in $.a.domains) {
            // not found?
            if (!foundDomain) {
              thisDomain = $.a.domains[checkDomain];
              // loop through all languages found in this domain
              for (i = 0, n = thisDomain.lang.length; i < n; i = i + 1) {
                // match language part or language plus location parts
                if (thisDomain.lang[i] === langPart || thisDomain.lang[i] === langPart + '-' + locPart) {
                  // set matches
                  domainMatch = checkDomain;
                  langMatch = langPart;
                  // match on two-parter like br-pt? you're done
                  if (thisDomain.lang[i] === langPart + '-' + locPart) {
                    // return full language string
                    langMatch = langPart + '-' + locPart;
                    // found = true will break outer loop
                    foundDomain = true;
                    // break inner loop
                    break;
                  }
                }
              }
            }
          }
          thisDomain = $.a.domains[domainMatch];
          // set strings if available (defaults to en)
          if (thisDomain.assets) {
            assetMatch = thisDomain.assets;
          }
          // this result should always be fully populated
          $.v.lang = langMatch;
          return {'lang': langMatch, 'domain': domainMatch, 'assets':  assetMatch };
        },

        // find and apply deep links on search engine results
        patchImage: function (img) {
          var k, r;
          r = {
            'description':'',
            'url':'',
            'media': ''
          };
          for (k in $.a.patchImage) {
            if ($.d.URL.match($.a.patchImage[k].seek)) {
              r = $.a.patchImage[k].patch(img, $);
              break;
            }
          }
          return r;
        },

        // do stuff with domain hash
        gotDomainHash: function (hash) {
          // fail out if we don't have a hash list to look at
          if ($.v.hashList && $.v.hashList.theList && $.v.hashList.theList.length && $.v.hashList.theOtherList && $.v.hashList.theOtherList.length) {
            $.f.debug('domain hash: ' + hash);
            var hashFrag = hash.substr(0, 12);
            // check gray list
            if (!$.v.hideHoverButtons) {
              for (i = 0, n = $.v.hashList.theList.length; i < n; i = i + 1) {
                if (hashFrag === $.v.hashList.theList[i]) {
                  $.f.debug($.d.URL + ' is on theList');
                  $.v.hideHoverButtons = true;
                  break;
                }
              }
            }
            // check banned doman list
            if (!$.v.hideHoverButtons) {
              for (i = 0, n = $.v.hashList.theOtherList.length; i < n; i = i + 1) {
                if (hashFrag === $.v.hashList.theOtherList[i]) {
                  $.f.debug($.d.URL + ' is on theOtherList');
                  $.v.hideHoverButtons = true;
                  $.v.noPin = true;
                  break;
                }
              }
            }
            // did not found on $.a.theList? got more parts? go again
            if (!$.v.hideHoverButtons) {
              if ($.v.hashDomainParts.length) {
                $.v.hashDomain = $.v.hashDomainParts.pop() + '.' + $.v.hashDomain;
                $.f.hashDomain();
              }
            }
          } else {
            $.f.debug(' cannot check ' + hash + ' because $.v.hashList is damaged or missing');
          }
        },

        // set an object in local storage
        setLocal: function (obj) {
          for (var k in obj) {
            $.f.debug('setting local items: ' + k);
          }
          $.c.storage.local.set(obj);
        },

        // configuration has been loaded into $.v from local storage; we are ready to go
        init: function (browser) {

          $.d.b = $.d.getElementsByTagName('BODY')[0];

          // do we need to update the uninstall URL?
          if ($.a.uninstallUrl) {
            // add xuid and xv
            var uninstallUrl = $.a.uninstallUrl + '?xuid=' + $.v.xuid + '&xv=' + $.v.xv;
            // if it's not already there, set it
            if ($.v.uninstallUrl !== uninstallUrl) {
              $.f.debug('current uninstallUrl is ' + $.v.uninstallUrl);
              $.f.debug('updating uninstallUrl to ' + uninstallUrl);
              $.f.sendMessage({'uninstallUrl': $.a.uninstallUrl});
            }
          }

          if (!$.v.hideHoverButtons) {
            var i, n;
            // check list of known private/login domains
            for (i = 0, n = $.a.noHoverPageList.length; i < n; i = i + 1) {
              if ($.d.URL.match($.a.noHoverPageList[i])) {
                $.f.debug($.d.URL + ' is on noHoverPageList');
                $.v.hideHoverButtons = true;
                break;
              }
            }
          }

          // start getting the hashes for this domain
          $.v.hashDomainParts = $.f.getDomain($.d.URL).split('.');
          $.v.hashDomain = $.v.hashDomainParts.pop();
          $.v.hashDomain = $.v.hashDomainParts.pop() + '.' + $.v.hashDomain;

          $.f.hashDomain();

          var map = $.f.langToDomain();
          $.v.pinCreate = $.a.endpoint.pinCreate.replace(/www/, map.domain);
          $.v.rePinCreate = $.a.endpoint.rePinCreate.replace(/www/, map.domain);
          $.d.b = $.d.getElementsByTagName('BODY')[0];
          $.v.noPinError = $.c.i18n.getMessage("errorPin");

          // don't make a button on pages that can't show a button
          if ($.f.canHazButton()) {
            $.a.style.backgroundImage = 'url(' + $.a.assets[$.a.buttonColor][map.assets] + ')';
            $.s.button = $.f.make({'SPAN':{ 'style': $.a.style }});
            $.d.b.appendChild($.s.button);
            $.v.hazButton = false;
            $.f.listen($.s.button, 'click', $.f.click);
            $.f.listen($.d.b, 'mouseover', $.f.over);
            $.f.listen($.d.b, 'mouseout', $.f.out);
            $.f.listen($.w, 'blur', $.f.hide);
          }

          // hide experiments
          if ($.v.lang === 'en') {
            if (exp) {
              for (var k in exp) {
                $[k] = exp[k];
              }
              if ($.x && typeof $.x.init === 'function') {
                $.x.init();
              }
            }
          }
        }
      };
    }())
  };
  if ($.c.storage.local) {
    // move everything we have in local storage into local variables
    $.c.storage.local.get(null, function(itemsFound) {

      // set this in advance so debug doesn't show undefined before this load is done
	  // EDGE : runtime.getManifest API
	  $.v.xv = 'cr1.39.1'
      //$.v.xv = 'cr' + c.runtime.getManifest().version;

      // loop through everything
      for (var item in itemsFound) {
        $.f.debug('Found ' + item + ' in local storage.');
        $.v[item] = itemsFound[item];
      }

      // fix it if localStorage overwrites it
      //$.v.xv = 'cr' + c.runtime.getManifest().version;

      $.f.init();
    });
  } else {
    $.f.debug('local storage missing; failing out');
  }
}(window, document, navigator, browser, {
  'k': 'EXT',
  'uninstallUrl': 'https://www.pinterest.com/settings/extension/uninstall/',
  'digits': '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz',
  'maxAspectRatio': 3,
  'position': {
    'offsetTop': 10,
    'offsetLeft': 10
  },
  'endpoint': {
    'pinCreate': 'https://www.pinterest.com/pin/create/extension/',
    'rePinCreate': 'https://www.pinterest.com/pin/%s/repin/x/',
    'log': 'https://log.pinterest.com/'
  },
  'urlPattern': {
    'pinterestApp': /^https?:\/\/(([a-z]{1,3})\.)?pinterest\.com\//,
    'pinitJs': /^https?:\/\/assets\.pinterest\.com\/js\/pinit.js/
  },
  'style': {
    'height': '20px',
    'width': '40px',
    'background-size': '40px 20px',
    'position': 'absolute',
    'opacity': '1',
    'zIndex': '8675309',
    'display': 'none',
    'cursor': 'pointer',
    'border': 'none',
    'backgroundColor': 'transparent'
  },
  'buttonColor': 'gray',
  'assets': {
    'white': {
      'en': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAYAAABpYH0BAAAF3ElEQVR4Ae1bA5Ak2xLd8MPXM9a2bdu2bdu2bdvW2LZt28rFqYnIqhtTs9Grnv/eq43I3dnMm9W3T+U9J7O6pxT++Pp6k7m5ARkYvNDBNANWwEwCz8/Pm2B5eXn09u1bzXQwYAXM/P19qRTQ1MD7NBCBXSmUpAbIpxmw0wDUAPxM0wDUANQAzAoIotAd+8i5xyCyrNSADP9XiQz/XUH62aXfcAo/dILyU1I0AItIeWwceY6ZIoFl8G25D5rZHzUp/MBRevvmjQYgLN3RmayqNWaATH6pSh5DxlLo9r0UdeYihe07TD4z5pNllYYCkF7jp9Ob/Px/NoCZvv5kXrYOg+I5egrlRESprgVYIdv2ClUauHrjPxdAHEGH1t0YDP/l63XKC9t9kHMMf6hEmT5+AsgJT15QioX1F3+TBZmZFH//Mb+emmWHhmGdfgCMv/eIgXDq2o85LT8pWQLTa9w0SrG2VQXeunZzzvWdv5TBc+o2gP0x125/MfAgXNb1WuG6krBleHoL8eCtu8iiQl0pHnX2kn4A9Bg+nt9ssoGpXJVte7Afm1LjOZ9ZC3mNbYPWki/plQn7YEHrtn4pAMHDwrVx85U31LxcXY6BlvQCoEWl+tILmpepTW8LCiRfwpPn8CkNCl0kN3jjdll0fq5SKEauHsyPeEPZQSFfDMCYa7fkG9aoLb3JzpZF0NmDY5ZVG+mPAw2+Ly+9qH3zLuwLWrelSMuilgvxYB78T0X2J5tZUsTR0wz6lzRUXdTZy8xxatXpNXaq/gA0+7NmIYDNOsuVtWmHAKDbgJGqud6TZvEaNNnwRZw8R26Dx0iWbGrBa6HqoAv4/RavgghILZBVzWaS4Vp58Qkf3Gvgmk1SvsfQcZQdXFjZXhNmvufu/mRZSW6vrGs1l3yeIyd+dQCZ60x+rEz5iYmFR/jZCwHAiGOnVHPtmnVSChB82Dz7UInwwcIPn2Q/ekn0mfhZlxsFy09NRZVzteP/2aGhnKtmAPErAyiWPkShkE9c2YcjnhMWodoqGPyrvCwWG7ZTdmCwfOx/ryEIj8cwWaxgDm17kv+ytWTXuC37oKy6dAvIlao6Kpr8l6wSrg1O91u0EoYT8PUBBBGDkKXSr9sSPoxo8nGo00I1z3fuEl4D0QCgEcfPsM+l/wilQgqNus+0eRxDr6iYfordp++cxcU17piWOOY9ebb+J5G82HjyHDkJG1O2NqykBVlZwvqk1yYATSRtMQ+VLYyJfL0ytQQBiLt5l2P2LbsVt0e+ybBkQ3Mh5tx7CMeiL1/XP4DFtDZsbgNHUoaHFzgHdxsti8xnlRtCbVFl3MTCMtw85QrZuZ/9nqMmF1fJOI6q+8mNjgaVcJW+ycsTph6z36oz3WAvJQkg1FE4UgyWYNxvYX2RPgxAFlchUafPK2MCByY+e6W6p+hL12Rh6D5QGYNQcQzXKvHngREnzvKGnHsOosSXBqysSmB9Zi5A26EqRmg1mB5iYqHwHEMVs7ImJLIQYZ7mxlg08Brno0dVxNAKCSJY0gCCz7AZGJ66sAikOjhS/IMnlGJpw5yoNHAok/yqjWq9ImZnISfh2UuO2dZvLcTEKm0nz9Y37rAfo6eiE0Dzzscac3JJAIimljeU5uCkc559i65yBQ4ajaONKhUq13vKHGUO+kuOoaFPsbGjxBevi1wbLZHyCKeYW1P0xatkXrqmcH08+Ei1c5DEDFWf5RegVwChjnxHMVno/rRZ4DmhvVFwKGZZISfu7gM1bsWoJqyDiKmtg2iwcImGh7/6r0AM/nwMV27QMY+PkzBdgDfxTNDs12qFvPlTFbRLyhyoKZpiYZ72njq3CEUUpKVBrVltYRjdYq7coGQTM8zqQtuFZ5XIKzEAsSGQv+65LAoQHUwyuldvQQGOHYBggIsxAIueEvyGPAHgVFsHvC74r8REBA9RASA+ddM+1vwMFf6EPA1AzTQANQA1ADUANQA/9yu+2ld8P/NL5tqXzD/z1xy0X3N4B5pLSG6j7UhBAAAAAElFTkSuQmCC',
      'ja': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAACEklEQVR4Ae2WA6wdQRiFb1Dbtm3btm3bCmu3UW3bbvfuPtu2bfuk9yTZPNs4yVjf4J8ZxZs3byoLwq/rgvA7UOVQMtyvIDKRTaHKuGZvb424uDiUFJFFxUTYcwQMLElwKSHJRkCUVJGt9AKGW1jBYPYiSJ37QdmsC8QOfWGyagMSIyKQUznfewBl254MCxbQ8/lLCHXaQtmqB0zXbYHdiVMwmLuUeZA69UNibGz6zuq2g+68pUgpGY4hZbRuM13+AZUtu0O9z3AgMRFxAUGIcnZOBq/WGlb7D2cLSDCx+8BUK6g5fjrbMx8ppT54NKI8PHIOyE7c7z1GrK8vhAYduMWQxbjW8AkZAnJgQgpNOrEPwqUb2Fw1OdZlvryqrGt79mIuAGu0geeT54RkY2j0HZ5c1rgTtMdMzRCQdQnHlfL6+g2ZSIZjHXliudtisU1PGC9ejRBdfXBQ79fvQAVp6oBpy+17cnAGsxRXjG04IQLn0khevIHD2Uuw3n8UBHK9dQ+U1rDxYKfR7h4ZAvIspVwlnr1AfYOU25vyCHDlWC/v96B6r6EQ2/WGskVXMC7Uaw/Xm3eRkWQDSOsIlOYY8GwSNv8XtVCrLUxWrEe0pze8335EfFgYshLPFAem4+oxnbY85YrlCzDWyxu89yLs7EvmSxLl6gbLnXuRA1W8xSX+u1WCP6x/zisofq/5zS6JX/7/HuMxUY2iu7sAAAAASUVORK5CYII='
    },
    'red': {
      'en': 'data:image/png;base64,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',
      'ja': 'data:image/png;base64,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'
    },
    'gray': {
      'en': 'data:image/png;base64,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',
      'ja': 'data:image/png;base64,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'
    }
  },
  'pop': {
    'base': 'status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,',
    'width': 750,
    'height': 520
  },
  'domains': {
    'www': { 'lang': ['en'], 'assets': 'en' },
    'br': { 'lang': ['pt-br']},
    'cz': { 'lang': ['cs']},
    'de': { 'lang': ['de']},
    'dk': { 'lang': ['da']},
    'es': { 'lang': ['es']},
    'fi': { 'lang': ['fi']},
    'fr': { 'lang': ['fr']},
    'uk': { 'lang': ['en-uk', 'en-gb', 'en-ie']},
    'id': { 'lang': ['id', 'in']},
    'it': { 'lang': ['it']},
    'jp': { 'lang': ['ja'], 'assets': 'ja'},
    'kr': { 'lang': ['ko', 'kr']},
    'nl': { 'lang': ['nl']},
    'no': { 'lang': ['nb']},
    'pl': { 'lang': ['pl']},
    'pt': { 'lang': ['pt']},
    'ru': { 'lang': ['ru']},
    'sk': { 'lang': ['sk']},
    'se': { 'lang': ['sv', 'sv-se']},
    'tr': { 'lang': ['tr']}
  },
  // default domain, language, and assets
  'defaults': {
    'domain': 'www',
    'lang': 'en',
    'assets': 'en'
  },
  'patchImage': {
    'twitterCard': {
      'seek': /^https?:\/\/twitter\.com\//,
      'patch': function (img, $) {
        var a, media, url, description;
        a = img.parentNode.parentNode;
        if (a && a.tagName === 'A') {
          media = $.f.get(a, 'data-resolved-url-large');
          url = a.href;
          var p = a.parentNode.parentNode.parentNode.getElementsByClassName('tweet-text')[0];
          if (p && p.tagName === 'P') {
            description = p.innerText;
          }
        }
        return {
          'url': url,
          'media': media,
          'description': description
        }
      }
    },
    'bingImageSearch': {
      'seek': /^https?:\/\/www\.bing\.com\/images\/search\?q=/,
      'patch': function (img, $) {
        var a, meta, t, media, url, description;
        a = img.parentNode;
        if (a && a.tagName === 'A') {
          meta = $.f.get(a, 'm');
          if (meta) {
            t = meta.split('surl:"');
            if (t[1]) {
              url = t[1].split('"')[0];
            }
            t = meta.split('imgurl:"');
            if (t[1]) {
              media = t[1].split('"')[0];
            }
            description = $.f.get(a, 't1');
          }
        }
        return {
          'url': url,
          'media': media,
          'description': description
        }
      }
    },
    'googleImageSearch': {
      'seek': /^https?:\/\/www\.google\.com\/search(.*&tbm=isch.*)/,
      'patch': function (img, $) {
        var a, meta, json, media, url, description;
        a = img.parentNode;
        if (a && a.tagName === 'A' && a.href) {
          meta = a.href.split('imgrefurl=');
          if (meta[1]) {
            // got url
            url = meta[1].split('&')[0];
            try {
              url = decodeURIComponent(url);
            } catch(e) {}
          }
          meta = a.href.split('imgurl=');
          if (meta[1]) {
            // got media
            media = meta[1].split('&')[0];
            try {
              media = decodeURIComponent(media);
            } catch(e) {}
          }
          meta = a.parentNode.getElementsByClassName('rg_meta');
          // see if we can find the description; otherwise, leave it blank to force pinner to do something
          // "Google Image Search Results" is not a useful description
          if (meta[0]) {
            try {
              json = JSON.parse(meta[0].innerHTML);
              if (json.pt) {
                description = json.pt;
              }
            } catch (e) { }
          }
        }
        return {
          'url': url,
          'media': media,
          'description': description
        }
      }
    }
  },
  // known private sites
  'privateList': [
    /^(.*?\.|)craigslist\.org/,
    /^(.*?\.|)chase\.com/,
    /^(.*?\.|)facebook\.com/,
    /^(.*?\.|)mail\.aol\.com/,
    /^(.*?\.|)atmail\.com/,
    /^(.*?\.|)contactoffice\.com/,
    /^(.*?\.|)fastmail\.fm/,
    /^(.*?\.|)webmail\.gandi\.net/,
    /^(.*?\.|)accounts\.google\.com/,
    /^(.*?\.|)mail\.google\.com/,
    /^(.*?\.|)docs\.google\.com/,
    /^(.*?\.|)gmx\.com/,
    /^(.*?\.|)hushmail\.com/,
    /^(.*?\.|)laposte\.fr/,
    /^(.*?\.|)mail\.lycos\.com/,
    /^(.*?\.|)mail\.com/,
    /^(.*?\.|)mail\.ru/,
    /^(.*?\.|)opolis\.eu/,
    /^(.*?\.|)outlook\.com/,
    /^(.*?\.|)nokiamail\.com/,
    /^(.*?\.|)apps\.rackspace\.com/,
    /^(.*?\.|)rediffmail\.com/,
    /^(.*?\.|)runbox\.com/,
    /^(.*?\.|)mail\.sify\.com/,
    /^(.*?\.|)webmail\.thexyz\.com/,
    /^(.*?\.|)mail\.yahoo\.com/,
    /^(.*?\.|)mail\.yandex\.com/
  ],
  // never hover here
  'noHoverPageList': [
    /^https?:\/\/ramandel\.com\//,
    /^https?:\/\/www\.google\.com\/$/,
    /^https?:\/\/www\.google\.com\/_/
  ]
}));

// experiments
var exp = {
  // functions
  x: {
    toast: function () {
      var exp = $.q.segment[$.v.seg];
      var str = exp.str[$.q.meta.lang];
      $.s.toast = $.f.make({'SPAN':{ 'style': $.q.css.toastStyle }});
      var s = ['Head', 'Body', 'Go', 'Dismiss'];
      for (var i = 0; i < s.length; i = i + 1) {
        var id = 'toast' + s[i];
        $.s[id] = $.f.make({'SPAN':{ 'style': $.q.css[id + 'Style'] }});
        if (str[s[i]]) {
          $.s[id].innerHTML = str[s[i]].replace(/%p%/, $.q.meta.pinterestLogo);
        }
        $.s.toast.appendChild($.s[id]);
      }
      $.s.toastGo.onclick = function () {
        $.f.log({'event': 'click', 'exp': $.q.meta.exp});
        $.f.sendMessage({'popGrid': 'from_toast', 'extraParam': 'edu'});
        $.f.setLocal({'lastInteraction': new Date().getTime()});
        $.f.kill($.s.toast);
      };
      $.s.toastDismiss.onclick = function () {
        $.f.log({'event': 'dismiss', 'exp': $.q.meta.exp});
        $.f.setLocal({'lastInteraction': new Date().getTime()});
        $.f.kill($.s.toast);
      }
      $.d.b.appendChild($.s.toast);
    },
    unload: function () {
      // log an ignore only if we've been placed into an active (non-control) experience
      var exp = $.q.segment[$.v.seg];
      if (exp && !exp.control) {
        $.f.log({'event': 'ignore', 'exp': $.q.meta.exp});
      }
    },
    disqualify: function () {
      // check list of known domains where we should never show toast
      var i, n, r;
      r = false;
      for (i = 0, n = $.q.meta.disqualifyDomain.length; i < n; i = i + 1) {
        if ($.d.URL.match($.q.meta.disqualifyDomain[i])) {
          r = true;
          break;
        }
      }
      return r;
    },
    // look at the xuid and choose an experimental segment
    check: function () {
      $.f.debug('Let\'s see if you should see the experience.');
      for (var i = 0; i < $.q.segment.length; i = i + 1) {
        var seg = $.q.segment[i];
        if ($.v.expSegment >= seg.min && $.v.expSegment <= seg.max) {
          $.f.debug('Found an experience for segment ' + $.v.expSegment);
          if ($.x.disqualify()) {
            $.f.debug('Disqualified domain; exiting.');
            break;
          } else {
            // always set lastImpression for all experiments
            $.f.debug('Setting lastImpression');
            $.f.setLocal({'lastImpression': new Date().getTime()});
            if (seg.control) {
              $.f.debug('You\'re in the control group, so you will NOT see the experience.');
              // log all control impressions
              $.f.log({'event': 'impression', 'exp': $.q.meta.exp, 'control': true});
              break;
            } else {
              $.f.debug('You\'re in the treatment group, so you will see the experience.');
              $.f.log({'event': 'impression', 'exp': $.q.meta.exp});
              if (typeof $.x[seg.group] === 'function') {
                $.v.seg = i;
                $.x[seg.group]();
              }
              break;
            }
          }
        }
      }
      if (i === $.q.segment.length) {
        $.f.debug('No experience found for ' + $.v.expSegment + '; you\'ll see defaults.');
      }
    },

    // get hash, determine segment
    getExperimentHash: function () {
      $.f.debug('xuid: ' + $.v.xuid);
      $.f.debug('exp: ' + $.q.meta.exp);
      var hash = $.f.getHash($.q.meta.exp + '_' + $.v.xuid)
      $.f.debug('hash: ' + hash);
      var decimal = parseInt(hash.substr(0, 4), 16);
      $.f.debug('decimal approximation: ' + decimal);
      $.v.expSegment = decimal % 100;
      $.f.debug('segment: ' + $.v.expSegment);
      $.v.expSegment = parseInt(hash.substr(0, 4), 16) % 100;

      // should we show the experience?
      var canHazExperience = false;

      // are we on an English page?
      if ($.v.lang === 'en') {
        // don't show experiment on page with nopin or no hoverbuttons
        if (!$.v.noPin && !$.v.hideHoverButtons) {
          // get images
          var img = $.d.getElementsByTagName('IMG')
          // check one at a time
          for (var i = 0, n = img.length; i < n; i = i + 1) {
            // has valid source
            if (img[i] && img[i].src && img[i].src.match(/^http?s:\/\//)) {
              // does not have a nopin
              if (!img[i].getAttribute('nopin') && !img[i].getAttribute('data-pin-nopin')) {
                // height and width big enough
                if (img[i].height > 299 && img[i].width > 299) {
                  // yes!
                  canHazExperience = true;
                  // quit looking
                  break;
                }
              }
            }
          }
        }
      }
      // cooldowns won't be set if we can't show the experience
      if (canHazExperience) {
        $.f.debug('found a page in English with at least one pinnable image');
        $.x.check();
      } else {
        $.f.debug('page does not qualify for experiment');
      }
    },

    // run experiments
    init: function () {
      $ = window['EXT'];
      var now = new Date().getTime();
      var quit = '';
      var k;
      for (var t in $.v) {
        if ($.q.meta.cooldown[t]) {
          k = parseInt($.v[t]);
          if (now - k < $.q.meta.cooldown[t]) {
            $.f.debug('In cooldown period for ' + t);
            quit = t;
            break;
          }
        }
      }
      if (quit) {
        $.f.debug('Quitting out of experiment framework because ' + t + ' is too recent.');
      } else {
        // wait one second for things to settle down, then attempt to run experiment
        $.w.setTimeout(function() {
          $.x.getExperimentHash();
        }, 1000);
        $.f.listen($.d.b, 'click', $.x.click);
        $.f.listen($.w, 'beforeunload', $.x.unload);
      }
    }
  },
  // experiment controls
  q: {
    'meta': {
      // experiment name
      'exp': 'browserEduToast',
      // domain patterns from which we want to hide toast
      // ends in $ means match only the home page
      // otherwise, match any page on that domain
      'disqualifyDomain': [
        /^https?:\/\/about\.pinterest\.com\//,
        /^https?:\/\/(.*?\.|)twitter\.com\//,
        /^https?:\/\/(.*?\.|)linkedin\.com\//,
        /^https?:\/\/(.*?\.|)netflix\.com\//,
        /^https?:\/\/(.*?\.|)paypal\.com\//,
        /^https?:\/\/(.*?\.|)southwest\.com\//,
        /^https?:\/\/(.*?\.|)youtube\.com\/$/,
        /^https?:\/\/(.*?\.|)yahoo\.com\/$/,
        /^https?:\/\/(.*?\.|)tumblr\.com\/$/,
        /^https?:\/\/(.*?\.|)instagram\.com\/$/,
        /^https?:\/\/(.*?\.|)quizlet\.com\/$/,
        /^https?:\/\/plus\.google\.com\/$/,
        /^https?:\/\/play\.google\.com\/$/
      ],
      // language is always english for now
      'lang': 'en',
      // 86400000 = microseconds in one day
      'cooldown': {
        'lastPin': 86400000 * 28,
        'lastImpression': 86400000 * 14
      },
      'pinterestLogo': '<img style="margin-bottom:-3px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAIAAADJt1n/AAADyklEQVR4AV1UA5RjMRT9x8aaYxtr27Zt27Zt27Zqd2zbnvl1+7U3Z7DIuUWSd59fKOGvxQJWK52cUvb5a8Gde7nnLgIF9x5gSyelcHY7J/yzGsi8QJYhNa3o+q3EhUv1A4cqQ7vKA0IBZVg3bHFYfPsuBPj/yNhzDEPLlUlLVmhCu4g7eog7ugOiDoCbGCBbD3VYt+SlKw1qLcfzDWT8AnUSWeyYiWInj3pIXLxkfiGqLj3V3fsogsIlLt5NV/ETp4Nfz6IQhjk1NW78FBgBR+LkoenZP2n1+rzLV0uevih9+Sb/+u3Uzdu1/YfgFoAXCZNnmNPSWYGn7GZz1vbd4nqms2f0xKmlr9+a0tLpmLgarb5WqzOmpFoKCss/fomdORcCEIOZnD0HHDYbRUdFq4M7i5084ZJu8PAalcZaXFJw627cvEVR46ZET5yWuGJNyYuXrMlUFxWtHzFG3MEdkpqwboa4eCrv5BlROxeJqzcCK7r/kLVYMo8cVwSGIcnKzj1hBKKqLr1KX71FhoqfPpe6+UAYlLyzF6i4abPF7V0lHd3VPfraKyrqIqNkPkGq7n2KHj0tef4KOUMWRO1cI8dMYgwGe0Wlts9AUoj2rvEz51LavmQDTTHT50B33sUrP5q3zdh/iHcwPMNEjZssak+Mo+DmzCyB52OmzgITOdL1H0Kpu/XGHchxcxeAnHno6M8W7YqfvsB/hqa1A4aSIjt7yv1CTClphDxjNoRxqOnRl9L2GUSuoWnQcMZoRGyiNk655y+BXKuLkHn6I70k7K697JWVSJtu8AjiaUd3WEbMxA1ISD39yz9/sRWXKII655w5R0K4duNXGydSm7YuyavXCxxH1PkGkxMS8zwq79RZMck26aGo8VPKPn5GV1X8+Aly4b2HKAGURowcWxsRiYQlb9oKHyEMSsHZi1RdJKlzffVximSCbC0qZmiDIT4h68TprGMnqyQyR1VVwc078oAwxA+oQ7uSOjvQYTv2oPRggg8/oydN5x2OaoUy+/T5KpG0RqOr/CXKOn5S3bkXvCNmSYftZ9BhjCBYUtPixk1Gteurn773IHxGq8i8AqKnzoxfsEQ/bDRCbWS6x0+abknPYBpGkm+Yqvp+KHr8lLPZEH99ScCprxYgIVM1DVP17zyzLK1QJS1erg4KR86qlWrkqX42wSF/SD93xcAbNDpC+e8lgX08FIVXb9Tp9DmnzqC95f6hgDKsq37A0IQFy4rv3MO0NTGx/nvDeAyGnaarpfLC2/dzzl0Eiu49LP/ytS45GW8YK/yzfgNIwwxSS9uptAAAAABJRU5ErkJggg=="/>'
    },
    // experiment segments
    'segment': [ {
        'group': 'toast',
        'min': 0,
        'max': 29,
        'str': {
          'en': {
            'Head': '<span style="color:rgb(189, 8, 28)">Pin now, read later!</span> Save any',
            'Body': 'article by clicking %p% above.',
            'Go': 'See how',
            'Dismiss': 'Not now'
          }
        }
      }, {
        'group': 'toast',
        'min': 30,
        'max': 99,
        'control': true
      }
    ],
    // presentation for various things we're going to generate
    'css': {
      'toastStyle': {
        'cursor': 'default',
        'width': '480px',
        'height': '95px',
        'position': 'fixed',
        'top': '15px',
        'right': '15px',
        'background': '#fff',
        'borderRadius': '8px',
        'boxShadow': '0px 0px 10px 5px rgba(128,128,128,0.25)',
        'background': '#fff',
        'text-align': 'left',
        'padding': '20px 0 0 0',
        'font-family': 'Helvetica',
        'font-size': '24px',
        'font-weight': 'bold',
        'line-height': '25px',
        'z-index': '2000000000'
      },
      'toastHeadStyle': {
        'display': 'block',
        'margin': '0 15px',
        'color': '#555',
        'padding-top': '10px'
      },
      'toastBodyStyle': {
        'display': 'block',
        'margin': '0 15px',
        'color': '#555'
      },
      'toastGoStyle': {
        'cursor': 'pointer',
        'position': 'absolute',
        'top': '15px',
        'right': '15px',
        'color': '#fff',
        'background': '#bd081c',
        'width': '100px',
        'height': '38px',
        'line-height': '38px',
        'font-size': '16px',
        'border-radius': '5px',
        'font-weight': 'bold',
        'text-align': 'center'
      },
      'toastDismissStyle': {
        'cursor': 'pointer',
        'position': 'absolute',
        'top': '62px',
        'right': '15px',
        'color': '#333',
        'background': '#eee',
        'width': '100px',
        'height': '38px',
        'line-height': '38px',
        'font-size': '16px',
        'border-radius': '5px',
        'font-weight': 'bold',
        'text-align': 'center'
      }
    }
  }
};
}
catch(e)
{
	alert(e);
}
