/*
 * Kumquat Kernel
 * 
 * Copyright, 2012, Chernikov Alexey - http://github.com/chernikovalexey
 * 
 * Provides routing and managing of all in-extension processes, a few useful
 * APIs, such as User-storage, Web SQL DB API Wrap, Cache.
 * 
 * For its proper work requires Prevel
 * (http://github.com/chernikovalexey/Prevel).
 */

(function (win, doc, undefined) {

    // PRIVATE

    // Common variables
    // Template for extending storages
    var ext_o_storage = {
        current: '',
        cl: [],
        list: {}
    };

    // Empty function
    var ef = function () {
    };

    // Do not create separate data storage for them
    var excludes = 'data,ext,ui'.split(',');

    // Common functions
    // Length of the given object
    // Examples: getObjectLength({a: 2, b: 3}) => 2
    var getObjectLength = function (o) {
        if (pl.type(o, 'obj')) {
            var l = 0;
            for (var key in o) {
                ++l;
            }
            return l;
        } else {
            return o.length;
        }
    };

    // ======
    // PUBLIC

    // Extend window with `ke`
    // General structure of `ke`;
    // perhaps, some properties will be reassigned
    win.ke = {
        data: {},     // Data container

        app: {},      // Object with mvc of the current hub
        ui: {},       // User-Interface

        import: {},   // Import given script/style

        ext: {},      // Object with user-created extensions
        utils: {},
        db: {},       // Wrapper for Web SQL DB API
        idb: {},
        us: {},       // User-storage with objects
        nav: {}       // Navigation on ordinary pages
    };

    for (var key in win.ke) {
        if (!~pl.inArray(key, excludes)) {
            ke.data[key] = {};
        }
    }

    win.indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;

    var IS_EDGE = false;

    if (typeof win.msBrowser !== 'undefined') {
        win.chrome = msBrowser;
        IS_EDGE = true;
    } else if (typeof browser !== 'undefined') {
        win.chrome = browser;
        IS_EDGE = true;
    }

    var IDB_RW = "readwrite";
    var IDB_RO = "readonly";

    /*
     * Module: import (inherently, it's an analogue of `import` in Java)
     *
     * Provides: - Organizing queues of files to be loaded; - Loading queue after
     * Dom ready; - Supports .js and .css; - Storing history of loaded files; -
     * Reacting with firing callback when queue is loaded.
     */

    ke.import = (function () {
        return function (src, callback) {
            return new ke.import.add(src, callback || ef);
        };
    })();

    pl.extend(ke.import, {
        ready: [],

        // Prefix before the path to file (e.g. root:kernel.kernel)
        // Now root is the only supported prefix
        get prefix() {
            return ~pl.inArray(ke.section, ke.data.kernel.save.internal_pages) ? ke.getConst('ROOT_PREFIX') : '';
        },

        // JS or CSS
        parseType: function (src) {
            src = src.replace(/\./g, '/');

            var response;

            if (src.substr(0, 2) === ke.getConst('STYLE_PREFIX')) {
                response = src.substr(2) + '.css';
            } else if (src.substr(5, 2) === ke.getConst('STYLE_PREFIX')) {
                response = 'root:' + src.substr(7) + '.css';
            } else {
                response = src + '.js';
            }

            return response;
        },

        addRes: function (src) {
            var prefix = '';
            var slash = '/';

            if (src.substring(0, 5) === ke.getConst('ROOT_PREFIX')) {
                prefix = ke.pathToExt;
                slash = '';
                src = src.substring(5);
            }

            return prefix + (src.substr(src.length - 4) === '.css' ? slash + 'resources/styles/' : slash + 'src/') + src;
        },

        add: function (src, callback) {
            src = ke.import.prefix + src;

            var root = src.substring(0, 5) === ke.getConst('ROOT_PREFIX');

            src = ke.import.addRes(ke.import.parseType(src));

            var file_name = src.split('/').pop().split('.')[0];
            var parent = src.split('/')[root ? 4 : 2];

            if (~pl.inArray(src, ke.data.import.loaded)) {
                return;
            }

            if (ke.deploy[parent] && ke.deploy[parent].before) {
                ke.deploy[parent].before(file_name, src.split('/').splice(-2, 1)[0]);
            } else {
                ke.deploy[parent] = {after: ef};
            }

            ke.import.ready.push(0);

            if (root) {
                pl.ajax({
                    url: src,
                    type: 'GET',
                    success: function (data) {
                        if (src.substr(src.length - 4) === '.css') {
                            pl('<style>', {
                                type: 'text/css'
                            }).html(data).appendTo('head');
                        } else {
                            win.eval(data);
                        }

                        ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                        callback();
                        ke.import.ready.pop();
                    },
                    error: function (err_code, err_text) {
                        if (IS_EDGE && err_text.indexOf('function') > -1) {
                            if (src.substr(src.length - 4) === '.css') {
                                pl('<style>', {
                                    type: 'text/css'
                                }).html(err_text).appendTo('head');
                            } else {
                                win.eval(err_text);
                            }

                            ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                            callback();
                            ke.import.ready.pop();
                        }
                    }
                });
            } else {
                pl.attach({
                    url: src,
                    load: function (u, t) {
                        if (!pl.type(u, 'str')) {
                            callback();
                            ke.import.ready.pop();
                            return;
                        }

                        ke.data.import.loaded.push(
                            !pl.empty(ke.data.import.queue_name) ?
                                [ke.data.import.queue_name, u] :
                                u
                        );

                        ke.import.ready.pop();
                        ke.deploy[parent].after(file_name, src.split('/').splice(-2, 1)[0]);
                        callback();
                    }
                });
            }

            return ke.import;
        },

        // Optional for import: fire callback when everything is loaded
        onDone: function (callback) {
            var int = setInterval(function () {
                if (pl.empty(ke.import.ready)) {
                    clearInterval(int);
                    callback && callback();
                }
            }, 1);
        },

        // Loaded files as an array
        getLoaded: function () {
            return ke.data.import.loaded;
        }
    });

    /*
     * Module: data (based on basic objects)
     *
     * Provides storing: - kernel settings; - current flags (dom loaded, ...); -
     * user containers (`ke.storage`).
     */

    pl.extend(ke.data.import, {
        loaded: []
    });

    pl.extend(ke.data.db, ext_o_storage);
    pl.extend(ke.data.idb, ext_o_storage);
    pl.extend(ke.data.us, ext_o_storage);

    pl.extend(ke.data, {

        // Kernel storage
        kernel: {
            'const': {
                STYLE_PREFIX: 's:',
                ROOT_PREFIX: 'root:',
                KERNEL_DB: 'KE_Kernel',

                VERBOSE: true
            },

            flags: {
                dom_loaded: false,
                kumquat_ready: false
            },

            info: {
                url: doc.location.href,
                ver: (navigator.appVersion.match('Chrome/([0-9\.]+)') || navigator.appVersion.match('([0-9\.]+)'))[1],
                lang: navigator.language,
                id: chrome.runtime.id
            },

            // Public kernel data
            save: {
                internal_pages: ['content']
            }
        }
    });

    pl.extend(ke.data.kernel.info, {
        section: ke.data.kernel.info.url.match(IS_EDGE ? 'ms-browser-extension://' : 'chrome-extension://') ?
            ke.data.kernel.info.url.match(/([A-z0-9]+)\.html/)[1] :
        window.KumquatSection || 'content'
    });

    /*
     * Public kernel functions and getters
     *
     */

    pl.extend(ke, {
        // A logger, which can be easily turned off
        log: function () {
            if (ke.getConst('VERBOSE')) {
                console.log.apply(console, arguments);
            }
        },

        // Main init
        init: function () {
            if (ke.getFlag('kumquat_ready')) {
                return;
            }

            // Get and execute additional init
            ke.import('kernel.init').onDone(function () {
                ke.loadCurrentHub();
                ke.data.kernel.save.user_init();
            });

            // Flags
            ke.setFlagTrue('kumquat_ready');
        },

        get isEdge() {
            return IS_EDGE;
        },

        get section() {
            return ke.data.kernel.info.section;
        },

        get extId() {
            return ke.data.kernel.info.id;
        },

        isMac: window.navigator.platform.indexOf('Mac') > -1,
        isWindows: window.navigator.platform.indexOf('Win') > -1,

        IS_CHROME: false,      // Is Chrome
        IS_CHROME_PRO: false,  // Is Chrome Premium Version
        IS_OPERA: false,       // Is Opera
        IS_SAFARI: false,      // Is Safari
        IS_EDGE: true,        // Is Edge
        IS_FIREFOX: false,     // Is Firefox

        PLATFORM_CODE: 'edge',

        get browserName() {
            if (ke.IS_CHROME) {
                return "Chrome";
            } else if (ke.IS_CHROME_PRO) {
                return "Chrome Pro";
            } else if (ke.IS_OPERA) {
                return "Opera";
            } else if (ke.IS_FIREFOX) {
                return "Firefox";
            } else if (ke.IS_EDGE) {
                return "Edge";
            } else if (ke.IS_SAFARI) {
                return "Safari";
            }

            return "Unknown";
        },

        get currentBrowser() {
            return ke.browserName + ' ' + ke.data.kernel.info.ver;
        },

        // Where `chrome.extension.getURL` does not fit
        get pathToExt() {
            return (IS_EDGE
                    ? 'ms-browser-extension://'
                    : 'chrome-extension://') + ke.extId + '/';
        },

        getFlag: function (n) {
            return ke.data.kernel.flags[n];
        },

        // Create a new flag, if it does not exist
        createFlag: function (n, def_val) {
            if (pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = !pl.type(def_val, 'undef') ? def_val : false;
            }
        },

        setFlagTrue: function (n) {
            if (!pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = true;
            }
        },

        setFlagFalse: function (n) {
            if (!pl.type(ke.data.kernel.flags[n], 'undef')) {
                ke.data.kernel.flags[n] = false;
            }
        },

        getConst: function (where, n) {
            if (!n) {
                n = where;
                where = 'data.kernel';
            }

            var tmp = window.ke;
            var p = where.split('.');
            pl.each(p, function (k, v) {
                tmp = tmp[v];
            });

            return tmp['const'][n.toUpperCase()];
        },

        loadCurrentHub: function () {
            // Scripts
            ke.import('hub.' + ke.section + '.router');
            ke.import('hub.' + ke.section + '.render');
            ke.import('hub.' + ke.section + '.handlers').onDone(function () {
                var ready = [];

                (ke.app.asyncInit || ke.EF)();

                pl.each(ke.app.import || [], function (k, v) {
                    ready.push(0);
                    ke.import(v).onDone(function () {
                        ready.pop();
                    });
                });

                var int = setInterval(function () {
                    if (pl.empty(ready)) {
                        clearInterval(int);
                        ke.app.init();

                        // Styles
                        if (ke.section !== 'background') {
                            var path = (ke.section === 'content' || ke.section === window.KumquatSection ? 'internal' : 'public') + '.' + ke.section;
                            ke.import('s:pages.common.main');
                            ke.import('s:pages.' + path);
                        }
                    }
                }, 1);
            });
        },

        getResource: function (p) {
            return '/resources/' + p;
        },

        getImage: function (n) {
            return this.getResource('images/' + n + '.png');
        },

        getInternalPage: function (n) {
            return '/pages/internal/' + n + '.html';
        },

        isProcessCall: function () {
            // Converting arguments from object to an array
            var args = Array.prototype.slice.call(arguments, 0);
            var action = args[0];
            args.splice(0, 1);
            return action === ke.processCall.call(ke, args);
        },

        processCall: function () {
            var p = [];
            pl.each(arguments, function (k, v) {
                p.push(v);
            });
            return p.join(',');
        },

        parseProcessCall: function (command) {
            var tmp = command.split(',');
            var f = {
                lib: tmp[0],
                cmd: tmp[1],
                exact: tmp[2]
            };
            return f;
        },

        // It's a bit shorter
        getLocale: function () {
            return chrome.i18n.getMessage.apply(chrome, arguments);
        },

        // Two variants which fires..:
        // - before loading the script/style
        // - after its loading
        deploy: {
            hub: {
                before: function (n) {
                    if (n === 'router') {
                        pl.extend(ke.app, {
                            render: {},    // Attach events, organize ui
                            handlers: {}  // Function called by events, render
                        });
                    }
                },

                after: ef
            },

            ext: {
                before: function (n, prev) {
                    if (prev !== 'ext') {
                        ke.ext[prev] = ke.ext[prev] || {};
                        ke.ext[prev][n] = {};
                    } else {
                        ke.ext[n] = {};
                    }
                },

                after: function (n, prev) {
                    pl.each((ke.ext[prev] ? ke.ext[prev][n].import : ke.ext[n].import) || [], function (k, v) {
                        ke.import(v);
                    });
                }
            },

            // UI is not ready yet, but let it be here...
            ui: {
                before: ef,
                after: ef
            }
        }
    });

    /*
     * Module: utils
     *
     * Provides: utils
     */

    pl.extend(ke.utils, {
        getObjectSize: function (obj) {
            var c = 0;
            for (var i in obj) ++c;
            return c;
        }
    });

    /*
     * Module: db (useful api for web sql database)
     *
     * Provides: - Adding new databases - Executing requests to the selected db -
     * Deleting db
     */

    // Simple size parsing from a string (5 mb => 5242880)
    var parseSize = function (s) {
        if (pl.type(s, 'int') || pl.type(s, 'undef')) {
            return s;
        }

        var t = s.split(' ');
        var to = t.pop().toLowerCase();

        return t[0] * Math.pow(1024, to === 'mb' ? 2 : 1);
    };

    pl.extend(ke.db, {
        choose: function (name, size) {
            ke.data.db.current = name;
            size = parseSize(size) || 5 * Math.pow(1024, 2);

            if (!ke.data.db.list[name]) {
                ke.data.db.list[name] = openDatabase(name, '1.0.0', name + ' database', size);

                if (!ke.data.db.list[name]) {
                    pl.error('Could not connect to the database.');
                }
            }

            return ke.data.db.list[name];
        },

        get selected() {
            return ke.data.db.current;
        },

        get currentDb() {
            return !pl.empty(ke.data.db.list) ?
                ke.data.db.list[ke.data.db.current] :
                null;
        },

        execSql: function (req, s, o, f) {
            ke.db.currentDb.transaction(function (tx) {
                tx.executeSql(req, s, function (tx, res) {
                    (o || ef)(res);
                }, function (tx, err) {
                    (f || ef)(err);
                });
            });
        }
    });

    pl.extend(ke.idb, {
        structs: {},

        def_obj_struct: function (name, struct) {
            this.structs[name] = struct;
        },

        open: function (db_name, table, indexes, callback) {
            var request = win.indexedDB.open(db_name, 14);

            request.onupgradeneeded = function (e) {
                var this_db = e.target.result;

                if (!this_db.objectStoreNames.contains(table)) {
                    var store = this_db.createObjectStore(table, {autoIncrement: true});

                    for (var index in indexes) {
                        store.createIndex(index, index, {unique: indexes[index]});
                    }
                }
            };

            request.onsuccess = function (e) {
                ke.data.idb.list[db_name] = e.target.result;
                callback();
            };

            request.onerror = function (e) {
                console.log("IDB::Error");
                console.dir(e);
            };
        },

        check_struct: function (obj, struct_name) {
            for (var key in this.structs[struct_name]) {
                if (!(key in obj)) return false;
            }

            for (var key in obj) {
                if (!(key in this.structs[struct_name])) return false;
            }

            return true;
        },

        add: function (db_name, table, obj, obj_struct_name, callback) {
            var db = ke.data.idb.list[db_name];

            if (db && this.structs[obj_struct_name] && this.check_struct(obj, obj_struct_name)) {
                var request = db.transaction([table], IDB_RW)
                    .objectStore(table)
                    .add(obj);

                request.onsuccess = function (e) {
                    callback();
                };

                request.onerror = function (e) {
                    console.log('error add:', obj, e);
                };
            } else {
                console.error("Db not found or obj_struct_name not defined");
            }
        },

        "get": function (name, table, id, callback) {
            var db = ke.data.idb.list[name];

            if (db) {
                var request = db.transaction([table], IDB_RO)
                    .objectStore(table)
                    .get(id);

                request.onsuccess = function (e) {
                    console.log("IDB::get succeeded", e.target.result);
                    callback();
                };
            }
        },

        update: function (db_name, table, primaryKey, values, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var store = db.transaction([table], IDB_RW)
                    .objectStore(table);

                store.get(primaryKey).onsuccess = function (e) {
                    var v = e.target.result;
                    pl.extend(v, values, true);

                    var put_request = store.put(v, primaryKey);

                    put_request.onsuccess = function () {
                        callback();
                    };
                };
            }
        },

        del: function (db_name, table, keys, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RW);
                var store = transaction.objectStore(table);

                keys.forEach(function (key) {
                    store.delete(key);
                });

                transaction.oncomplete = function (e) {
                    console.log('deleted data from the idb ok for the following ids:', keys);
                    callback();
                };
            }
        },

        clear: function (db_name, table, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var request = db.transaction([table], IDB_RW)
                    .objectStore(table)
                    .clear();

                request.onsuccess = function (e) {
                    callback();
                };
            }
        },

        "enum": function (db_name, table, max_len, bounds, descending_order, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RO);
                var object_store = transaction.objectStore(table);
                var cursor_request = object_store.openCursor(bounds, 'prev');

                var items = [];

                cursor_request.onerror = function (e) {
                    console.log('cursor error', e);
                };

                cursor_request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor && items.length <= max_len) {
                        var v = cursor.value;
                        v.id = cursor.primaryKey;

                        items.push(v);
                        cursor.continue();
                    }
                };

                transaction.oncomplete = function () {
                    if (descending_order) {
                        items.reverse();
                    }

                    callback(items);
                };
            }
        },

        search: function (db_name, table, search_values, callback) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RO);
                var store = transaction.objectStore(table);
                var cursor_request = store.openCursor(undefined, 'prev');

                var items = [];

                cursor_request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        for (var key in search_values) {
                            if ((pl.type(search_values[key], 'str') && cursor.value[key].indexOf(search_values[key]) > -1)
                                || (pl.type(search_values[key], 'fn') && search_values[key](cursor.value[key]))) {

                                var v = cursor.value;
                                v.id = cursor.primaryKey;
                                items.push(v);
                                break;
                            }
                        }

                        cursor.continue();
                    }
                };

                transaction.oncomplete = function () {
                    callback(items);
                };
            }
        },

        exists: function (db_name, table, key_val, values, callback, pass_obj) {
            var db = ke.data.idb.list[db_name];

            if (db) {
                var transaction = db.transaction([table], IDB_RO);
                var store = transaction.objectStore(table);

                var index = store.index(key_val[0]);
                var request = index.openCursor(IDBKeyRange.only(key_val[1]));
                var has = false;
                var primaryKey, value;

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        var loc_has = true;
                        for (var key in values) {
                            if (values[key] !== cursor.value[key]) {
                                loc_has = false;
                                break;
                            }
                        }

                        has = has || loc_has;

                        if (has) {
                            primaryKey = cursor.primaryKey;
                            value = cursor.value;
                        }

                        cursor.continue();
                    }
                };

                transaction.oncomplete = function () {
                    if (primaryKey) {
                        callback(has, primaryKey, value, pass_obj);
                    } else {
                        callback(false, null, null, pass_obj);
                    }
                };

                request.onerror = function (e) {
                    console.log('exists check error:', e);
                };
            }
        }
    });

    /*
     * Module: nav (navigation between ordinary pages)
     *
     * Provides: - Redirecting to the given page.
     */

    pl.extend(ke.nav, {
        go: function (pagename, delay) {
            setTimeout(function () {
                doc.location = '/pages/public/' + pagename + '.html';
            }, delay || 0);
        }
    });

// Initialize Kumquat (immediately, on dom is ready, on window is loaded)
    if (!ke.getFlag('kumquat_ready')) {
        ke.init();
    }

    pl(function () {
        ke.setFlagTrue('dom_loaded');
        ke.init();
    });

    pl(window).bind('load', function () {
        if (!ke.getFlag('kumquat_ready')) {
            ke.init();
        }
    });

})
(this, document);