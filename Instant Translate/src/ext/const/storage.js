(function (undefined) {

    pl.extend(ke.ext.const.storage, {
        FROM_LANG: 'It_Lang_From',
        TO_LANG: 'It_Lang_To',
        RECENTLY_USED_LANG: 'It_Lang_RecentlyUsed',

        DROPDOWN_HTML: 'It_Opt_DropdownPregeneratedHtml',

        SETTINGS_TAB: 'It_OptUi_SettingsTab',
        TRANS_COMBINATION: 'It_OptTrans_CombinationToTranslate',
        ADD_TRANS_COMBINATIONS: 'It_OptTrans_AdditionalCombinationsToTranslate',

        WIN_TRANS_TYPE_SHOWN: 'It_Ui_WindowTranslationTypeShown',
        WIN_TRANS_TYPE: 'It_Ui_WindowTranslationType',
        INSTANT: 'It_Ui_InstantTranslation',
        MULTI_VARIANT: 'It_Ui_MultiVariant',
        SAVE: 'It_Ui_Save',
        SAVED_VAL: 'It_Ui_SavedVal',
        SHOW_ORIGINAL: 'It_Ui_ShowOriginal',
        SHOW_TRANSLIT: 'It_Ui_ShowTranslit',
        AUTOCORRECTION: 'It_Ui_Autocorrection',

        DOUBLE_CLICK: 'It_Trans_DoubleClick',
        KEY_COMBO: 'It_Trans_KeyCombinations',
        CONTEXT: 'It_Trans_ContextMenu',
        HISTORY: 'It_Trans_HistoryOfTranslations',

        MONETIZATION: 'It_Monetization',
        MON_IS_CIS: 'It_Mon_IsCIS',

        SEEN_TOUR: 'It_SeenTour',
        EXT_VER: 'It_Version',

        LAST_PROMO_SHOW: 'It_LastPromoShow',
        LAST_BOTTOM_PROMO_SHOW: 'It_LastBottomPromoShow',
        PROMO_CLICKS: 'It_PromoClicks',
        SHOWN_PROMOS: 'It_ShownPromos',
        SHOWN_BOTTOM_PROMOS: 'It_ShownBottomPromos'
    });

    var DEFAULT_VALUES = {
        FROM_LANG: 'auto',
        TO_LANG: ke.getCurrentLocale(true),
        RECENTLY_USED_LANG: [],

        DROPDOWN_HTML: {
            from: {
                code: '',
                select: ''
            },
            to: {
                code: '',
                select: ''
            }
        },

        TRANS_COMBINATION: 'shift+t',
        ADD_TRANS_COMBINATIONS: '{}',
        SETTINGS_TAB: 1,

        WIN_TRANS_TYPE_SHOWN: false,
        WIN_TRANS_TYPE: 1,
        INSTANT: false,
        MULTI_VARIANT: true,
        SAVE: true,
        SAVED_VAL: '',
        SHOW_ORIGINAL: true,
        SHOW_TRANSLIT: true,
        AUTOCORRECTION: true,

        DOUBLE_CLICK: false,
        KEY_COMBO: true,
        CONTEXT: {
            active: true,
            value: 1
        },
        HISTORY: true,

        MONETIZATION: true,
        MON_IS_CIS: false,

        SEEN_TOUR: false,
        EXT_VER: '',

        LAST_PROMO_SHOW: Date.now() - 1209600000 / 2 + 172800000 / 2, // - 1 week + 1 days (= -6 days), so show in a day from now
        LAST_BOTTOM_PROMO_SHOW: Date.now() + 172800000 / 2,
        PROMO_CLICKS: {},
        SHOWN_PROMOS: 0,
        SHOWN_BOTTOM_PROMOS: 0
    };

    // Simple getters
    pl.extend(ke, {
        getStorageConst: function (n) {
            return ke.ext.const.storage[n.toUpperCase()];
        },

        getStorageDefValue: function (n) {
            return DEFAULT_VALUES[n.toUpperCase()];
        }
    });

})();