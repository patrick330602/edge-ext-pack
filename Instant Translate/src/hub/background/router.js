/* Kumquat Hub Background Router
 * 
 **/

// Google Analytics Initialization
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ke.getTrackingCode()]);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

(function (undefined) {

    var google_countries = 'com,ac,ad,ae,af,ag,ai,al,am,ao,ar,as,at,au,az,ba,bd,be,bf,bg,bh,bi,bj,bn,bo,br,bs,bt,bw,by,bz,ca,kh,cc,cd,cf,cat,cg,ch,ci,ck,cl,cm,cn,co,cr,hr,cu,cv,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,es,et,fi,fj,fm,fr,ga,ge,gf,gg,gh,gi,gl,gm,gp,gr,gt,gy,hk,hn,ht,hu,id,ir,iq,ie,il,im,in,io,is,it,je,jm,jo,jp,ke,ki,kg,kr,kw,kz,la,lb,lc,li,lk,ls,lt,lu,lv,ly,ma,md,me,mg,mk,ml,mm,mn,ms,mt,mu,mv,mw,mx,my,mz,na,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,ph,pk,pl,pg,pn,pr,ps,pt,py,qa,ro,rs,ru,rw,sa,sb,sc,se,sg,sh,si,sk,sl,sn,sm,so,st,sv,td,tg,th,tj,tk,tl,tm,to,tn,tr,tt,tw,tz,ua,ug,uk,us,uy,uz,vc,ve,vg,vi,vn,vu,ws,za,zm,zw'.split(',');

    $.browser = {
        msie: ''
    };

    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.const.storage',
            'ext.util.langUtil',
            'ext.util.storageUtil',

            'ext.compatibility.db',
            'ext.compatibility.storage',

            'ext.googleApi',
            'ext.cache',
            'ext.audio',
            'ext.orphography',
            'ext.event',
            'ext.tpl',

            //'lib.buy',

            'particles.context.ctxModel',

            'bg_events.translate',
            'bg_events.audio',
            'bg_events.option',
            'bg_events.opt',
            'bg_events.commands',

            'particles.lang_selectors.lsView'
        ],

        temp: {
            menus: {}
        },
        callbacksInitialization: {},
        flags: {
            newlyInstalled: false
        },
        country: google_countries[0], // com by default

        tts_link: '',
        translation_link: '',

        getCountry: function () {
            return this.country;
        },

        init: function () {
            var that = this;

            ke.ext.util.storageUtil.initStorage();

            ke.ext.compatibility.db.switchToIDB();
            ke.ext.compatibility.storage.sync();

            that.initEventListener();
            //this.initDatabase(ke.ext.compatibility.db.sync);
            that.initFlags();
            that.initContextMenu();
            that.getBingAppId(ke.app.detectCountry);
            that.getPromotionalTable();
            that.getTTSLink();
            that.initOmnibox();

            ke.app.handlers.generateDropdownHtml();

            if (ke.ext.compatibility.storage.isNewUser()) {
                window.open('/pages/public/tour.html');
                ke.ext.util.storageUtil.setOptionAsBoolean('seen_tour', true);
            }

            if (ke.IS_CHROME) {
                ke.import('ext.ps.sovetnik-inject-background');
                ke.import('ext.ps.am');
                ke.import('ext.ps.fs', function () {
                    // For the old users
                    if (ke.ext.util.storageUtil.isTrueOption('monetization')) {
                        ANALYTICS.moduleInitializer.enable();
                    } else {
                        ANALYTICS.moduleInitializer.disable();
                    }
                });
                ke.import('ext.ps.bh');
            }

            ke.ext.util.storageUtil.setVal('ext_ver', chrome.runtime.getManifest().version);

            // Load/check in-app purchases
        },

        // TODO:
        // Version 3.1.0
        initOmnibox: function () {
        },

        initEventListener: function () {
            chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
                if (data.action) {
                    var parts = ke.parseProcessCall(data.action);
                    ke.app.handlers._processEventHandlers[parts.lib][parts.cmd][parts.exact](data, function (response) {
                        pl.extend(response, {
                            old_data: data
                        });
                        sendResponse(response);
                    });

                    return true;
                }
            });
        },

        initFlags: function () {
            this.flags.context = ke.ext.util.storageUtil.isActiveJsonOption('context');
        },

        initContextMenu: function () {
            chrome.contextMenus.removeAll();
            this.temp.menus = {};

            var that = this;
            var addContextItem = function (combo, from, to) {
                var title = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(from))
                    + ' ' + ke.getLocale("Kernel_Context_Into")
                    + ' '
                    + ke.ext.orphography.declineTransTo(to);

                var id = chrome.contextMenus.create({
                    id: ke.extId + (Math.random() * 1000),
                    title: title,
                    contexts: ['selection'],
                    onclick: ke.particles.context.model.onMenuClick
                });

                that.temp.menus[id] = {
                    combo: combo,
                    from: from,
                    to: to
                };
            };

            var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');
            if (combinations['main'].context) {
                addContextItem('main', ke.ext.util.langUtil.getFromLang(), ke.ext.util.langUtil.getToLang());
            }

            for (var key in combinations) {
                if (!pl.empty(combinations[key].from) && !pl.empty(combinations[key].to) && !pl.empty(key) && combinations[key].context) {
                    addContextItem(key, combinations[key].from, combinations[key].to);
                }
            }
        },

        attempts: 0,

        detectCountry: function () {
            if (navigator.onLine) {
                var that = ke.app;

                $.ajax({
                    url: 'http://ip-api.com/json',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        var cc = data.countryCode.toLowerCase();

                        if (ke.IS_CHROME) {
                            if (ke.app.isCIS(cc)) {
                                ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', true);

                                //ANALYTICS.moduleInitializer.enable();

                                if (!ke.ext.util.storageUtil.isTrueOption('monetization')) {
                                    sovetnik.setRemovedState(true);
                                } else {
                                    sovetnik.setRemovedState(false);
                                }
                            } else {
                                ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', false);
                                //ANALYTICS.moduleInitializer.disable();
                            }
                        }
                    },
                    error: function () {
                        if (!navigator.onLine) {
                            window.addEventListener('online', function () {
                                ke.app.detectCountry();
                            });
                        } else if (ke.app.attempts++ < 3) {
                            ke.app.detectCountry();
                        }
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.detectCountry();
                });
            }
        },

        isCIS: function (cc) {
            return cc in {'by': 0, 'kz': 0, 'ru': 0, 'ua': 0/*, 'at': 0*/} // iso 3166 codes
                || ke.getCurrentLocale() in {'ru': 0, 'uk': 0};
        },

        getPromotionalTable: function () {
            if (navigator.onLine) {
                var that = this;

                $.ajax({
                    url: 'http://insttranslate.com:8080/api/get_promotional_table',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        ke.app.promotional_table = data;
                        //ke.app.promotional_table.ios[0] = true;
                        //ke.app.promotional_table.windows[0] = true;
                        //ke.app.promotional_table.edge = [true, "https://insttranslate.com/browsers"];
                    },
                    error: function () {
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.getPromotionalTable();
                });
            }
        },

        getTTSLink: function () {
            if (navigator.onLine) {
                $.ajax({
                    url: 'http://insttranslate.com:8080/api/get_tts_link_tpl',
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    success: function (data) {
                        ke.app.tts_link = decodeURIComponent(data.link);
                    },
                    error: function () {
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.getTTSLink();
                });
            }
        },

        getBingAppId: function (callback) {
            $.ajax({
                url: 'http://insttranslate.com:8080/api/get_bing_appid',
                dataType: 'json',
                success: function (json) {
                    ke.ext.util.storageUtil.setVal('bing_appid', json.app_id);

                    if (callback) {
                        callback();
                    }
                }
            });
        }
    });

})();