goog.provide('app.MenuController');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Popup');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.labs.userAgent.device');
goog.require('goog.json');
goog.require('app.SceneController');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!app.SceneController} sceneController
 * @final
 * @constructor
 * This controller controls site top menu actions.
 */
app.MenuController = function (sceneController) {
    /**
     * Pointer to scene controller used in menu actions
     * @const
     * @type {!app.SceneController}
     * @private
     */
    this._SCENECONTROLLER = sceneController;
    /**
     * Dialog used to set count of reflections
     * @type {goog.ui.Dialog}
     * @private
     */
    this._refDialog = new goog.ui.Dialog();
    /**
     * Dialog used to set screen size
     * @type {goog.ui.Dialog}
     * @private
     */
    this._sizeDialog = new goog.ui.Dialog();
    /**
     * Dialog used to set lights length difference tolerance
     * @type {goog.ui.Dialog}
     * @private
     */
    this._toleranceDialog = new goog.ui.Dialog();
    /**
     * Dialog used to display help
     * @type {goog.ui.Dialog}
     * @private
     */
    this._helpDialog = new goog.ui.Dialog('wide-dialog');
    /**
     * Dialog used for simulation export
     * @type {goog.ui.Dialog}
     * @private
     */
    this._dataOutputDialog = new goog.ui.Dialog();
    /**
     * Dialog used for simulation import
     * @type {goog.ui.Dialog}
     * @private
     */
    this._dataInputDialog = new goog.ui.Dialog();

    this._addListeners();
};

/**
 * Hides or show submenu
 * @param {!goog.events.BrowserEvent} e
 * @param {Element} child
 * @private
 */
app.MenuController.prototype._toggleSubMenu = function (e, child) {
    if (child.className.indexOf('nested-items') !== -1) {
        var display = 'block';
        if (child.style.display === 'block') {
            display = 'none';
        }

        if (child.parentNode.className.indexOf('top-item') !== -1) {
            var li = goog.dom.getElementsByTagNameAndClass('li', 'top-item'), i;
            for (i = 0; i < li.length; i++) {
                this._hideSubMenus(li[i]);
            }
        }
        child.style.display = display;
    }
    e.stopPropagation();
};

/**
 * Hides submenu
 * @param {Element} element
 * @private
 */
app.MenuController.prototype._hideSubMenus = function (element) {
    var subMenus = goog.dom.getElementsByClass('nested-items', element);
    for (var i = 0; i < subMenus.length; i++) {
        subMenus[i].style.display = 'none';
    }
};

/**
 * Display notification that new component should be added
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @param {!string} type
 * @private
 */
app.MenuController.prototype._addComponent = function (e, type) {
    var popup = new goog.ui.Popup(goog.dom.getElement('add-com-popup'));
    popup.setHideOnEscape(true);
    popup.setAutoHide(true);
    popup.setPinnedCorner(goog.positioning.Corner.TOP_RIGHT);
    popup.setMargin(new goog.math.Box(20, 30, 20, 20));
    popup.setPosition(new goog.positioning.AnchoredViewportPosition(document.body,
        goog.positioning.Corner.TOP_RIGHT));
    popup.setVisible(true);
    this._SCENECONTROLLER.showCross(type);
};

/**
 * Adds menu listeners
 * @private
 */
app.MenuController.prototype._addListeners = function () {
    // HOVER EFFECT
    var li = goog.dom.getElementsByTagNameAndClass('li', 'menu-item'), i;
    for (i = 0; i < li.length; i++) {
        goog.events.listen(li[i], goog.events.EventType.CLICK,
            /**
             * @this {!app.MenuController}
             * @param {!goog.events.BrowserEvent} e
             */
            function (e) {
                this._toggleSubMenu(e, goog.dom.getLastElementChild(/**@type{Node}*/(e.currentTarget)));
            },
            false, this);

        if (goog.labs.userAgent.device.isDesktop()) {
            goog.events.listen(li[i], goog.events.EventType.MOUSEENTER,
                /**
                 * @this {!app.MenuController}
                 * @param {!goog.events.BrowserEvent} e
                 */
                function (e) {
                    var child = goog.dom.getLastElementChild(/**@type{Node}*/(e.currentTarget));
                    if (child.className.indexOf('nested-items') !== -1) {
                        if (child.parentNode.className.indexOf('top-item') !== -1) {
                            var li = goog.dom.getElementsByTagNameAndClass('li', 'top-item'), i;
                            for (i = 0; i < li.length; i++) {
                                this._hideSubMenus(li[i]);
                            }
                        }
                        child.style.display = 'block';
                    }
                    e.stopPropagation();

                },
                false, this);

            goog.events.listen(li[i], goog.events.EventType.MOUSELEAVE,
                /**
                 * @this {!app.MenuController}
                 * @param {!goog.events.BrowserEvent} e
                 */
                function (e) {
                    var child = goog.dom.getLastElementChild(/**@type{Node}*/(e.currentTarget));
                    if (child.className.indexOf('nested-items') !== -1) {
                        child.style.display = 'none';
                    }
                    e.stopPropagation();
                },
                false, this);
        }
    }

    goog.events.listen(document.body, goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         */
        function () {
            this._hideSubMenus(goog.dom.getElement('top-items'));
        },
        false, this);

    // simulation/settings/count of reflection
    goog.events.listen(this._refDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.MenuController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
                var input = goog.dom.getElement('reflection-count-input');
                var val = parseFloat(input.value.replace(/\,/g, '.'));
                if (isNaN(val) || val < 1) {
                    input.style.backgroundColor = "red";
                    e.preventDefault();
                } else {
                    app.reflections_count = val;
                    this._SCENECONTROLLER.redrawAll();
                }
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('reflections-count'), goog.events.EventType.CLICK, this._reflectionCount, true, this);

    // simulation/settings/screen size
    goog.events.listen(this._sizeDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.MenuController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
                var input = goog.dom.getElement('screen-size-input');
                var val = parseFloat(input.value.replace(/\,/g, '.'));
                if (isNaN(val) || val < 1) {
                    input.style.backgroundColor = "red";
                    e.preventDefault();
                } else {
                    app.utils.updatePixelsPerCM(val);
                }
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('screen-size'), goog.events.EventType.CLICK, this._screenSize, true, this);

    // simulation/settings/tolerance
    goog.events.listen(this._toleranceDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.MenuController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
                var input = goog.dom.getElement('tolerance-input');
                var val = parseFloat(input.value.replace(/\,/g, '.'));
                if (isNaN(val) || val < 1) {
                    input.style.backgroundColor = "red";
                    e.preventDefault();
                } else {
                    app.utils.setTolerance(val);
                }
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('tolerance'), goog.events.EventType.CLICK, this._tolerance, true, this);

    // simulation/settings/language
    goog.events.listen(goog.dom.getElementByClass('language-switch'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._hideSubMenus(goog.dom.getElement('top-items'));
            e.stopPropagation();
            if (e.target.id == "lang-en-us") {
                app.locale = 'en_US';
            } else if (e.target.id == "lang-cs-cz") {
                app.locale = 'cs_CZ';
            }
            app.utils.translate();
        },
        true, this);

    // import simulation dialog
    goog.events.listen(this._dataInputDialog, goog.ui.Dialog.EventType.SELECT,
        /**
         * @this {!app.MenuController}
         * @param {!goog.ui.Dialog.Event} e
         */
        function (e) {
            if (e.key == 'ok') {
                var textArea = goog.dom.getElement('import-simulation-data');
                try {
                    var objectData = goog.json.parse(textArea.value);
                } catch (err) {
                    e.preventDefault();
                    textArea.style.background = '#FF0000';
                    goog.dom.removeNode(goog.dom.getElement('import-popup-error'));
                    goog.dom.appendChild(goog.dom.getElement('import-popup'),
                        goog.dom.createDom('div', {'id': 'import-popup-error'}, ('[' + err.name + '] ' + err.message))
                    );
                    setTimeout(function (textArea) {
                        textArea.style.background = '#FFFFFF';
                    }, 500, textArea);
                }
                this._SCENECONTROLLER.importData(objectData);
            }
        },
        false, this);

    // simulation/import simulation
    goog.events.listen(goog.dom.getElement('import-menu-msg'), goog.events.EventType.CLICK, this._import, false, this);

    // simulation/export simulation
    goog.events.listen(goog.dom.getElement('export-menu-msg'), goog.events.EventType.CLICK, this._export, false, this);

    // simulation/reset simulation
    goog.events.listen(goog.dom.getElement('reset-menu-msg'), goog.events.EventType.CLICK,
        /** @this {!app.MenuController} */
        function () {
            location.reload();
        });

    // components/add mirror
    goog.events.listen(goog.dom.getElement('add-mirror'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'MIRROR');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        },
        false, this);

    // components/add lens
    goog.events.listen(goog.dom.getElement('add-lens'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'LENS');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        }, false, this);

    // components/add holographic plate
    goog.events.listen(goog.dom.getElement('add-holo-plate'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'HOLO-PLATE');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        }, false, this);

    // components/add wall
    goog.events.listen(goog.dom.getElement('add-wall'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'WALL');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        }, false, this);

    // components/add light
    goog.events.listen(goog.dom.getElement('add-light'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'LIGHT');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        }, false, this);

    // components/add splitter
    goog.events.listen(goog.dom.getElement('add-splitter'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'SPLITTER');
            this._toggleSubMenu(e,/**@type{Element}*/(e.currentTarget.parentNode));
        }, false, this);

    // help
    goog.events.listen(goog.dom.getElement('help'), goog.events.EventType.CLICK, this._showHelp, true, this);

    var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
    var CTRL = goog.ui.KeyboardShortcutHandler.Modifiers.CTRL;

    shortcutHandler.registerShortcut('CTRL_H', goog.events.KeyCodes.H, CTRL); // help popup
    shortcutHandler.registerShortcut('CTRL_L', goog.events.KeyCodes.L, CTRL); // screen size popup
    shortcutHandler.registerShortcut('CTRL_T', goog.events.KeyCodes.T, CTRL); // coherence tolerance

    shortcutHandler.registerShortcut('CTRL_G M',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.M); // add mirror

    shortcutHandler.registerShortcut('CTRL_G S',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.S); // add splitter

    shortcutHandler.registerShortcut('CTRL_G E',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.E); // add lens

    shortcutHandler.registerShortcut('CTRL_G H',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.H); // add holographic plate

    shortcutHandler.registerShortcut('CTRL_G W',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.W); // add wall

    shortcutHandler.registerShortcut('CTRL_G L',
        goog.events.KeyCodes.G, CTRL,
        goog.events.KeyCodes.L); // add light

    shortcutHandler.registerShortcut('CTRL_I', goog.events.KeyCodes.I, CTRL); // simulation import
    shortcutHandler.registerShortcut('CTRL_X', goog.events.KeyCodes.X, CTRL); // simulation export
    shortcutHandler.registerShortcut('CTRL_R', goog.events.KeyCodes.R, CTRL); // simulation reset
    shortcutHandler.registerShortcut('CTRL_B', goog.events.KeyCodes.B, CTRL); // settings/count of reflection

    shortcutHandler.registerShortcut('CTRL_Q E',
        goog.events.KeyCodes.Q, CTRL,
        goog.events.KeyCodes.E); // settings/language/english

    shortcutHandler.registerShortcut('CTRL_Q C',
        goog.events.KeyCodes.Q, CTRL,
        goog.events.KeyCodes.C); // settings/language/czech

    goog.events.listen(shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
        /**
         * @this {!app.MenuController}
         * @param {!goog.ui.KeyboardShortcutEvent} e
         */
        function (e) {
            switch(e.identifier) {
                case 'CTRL_H':
                    this._showHelp();
                    break;
                case 'CTRL_G M':
                    this._addComponent(e, 'MIRROR');
                    break;
                case 'CTRL_G S':
                    this._addComponent(e, 'SPLITTER');
                    break;
                case 'CTRL_G E':
                    this._addComponent(e, 'LENS');
                    break;
                case 'CTRL_G H':
                    this._addComponent(e, 'HOLO-PLATE');
                    break;
                case 'CTRL_G W':
                    this._addComponent(e, 'WALL');
                    break;
                case 'CTRL_G L':
                    this._addComponent(e, 'LIGHT');
                    break;
                case 'CTRL_I':
                    this._import(e);
                    break;
                case 'CTRL_X':
                    this._export(e);
                    break;
                case 'CTRL_R':
                    location.reload();
                    break;
                case 'CTRL_B':
                    this._reflectionCount(e);
                    break;
                case 'CTRL_L':
                    this._screenSize(e);
                    break;
                case 'CTRL_T':
                    this._tolerance(e);
                    break;
                case 'CTRL_Q E':
                    app.locale = 'en_US';
                    app.utils.translate();
                    break;
                case 'CTRL_Q C':
                    app.locale = 'cs_CZ';
                    app.utils.translate();
                    break;
            }
        }, false, this);
};

/**
 * Displays help dialog
 * @private
 */
app.MenuController.prototype._showHelp = function () {
    this._helpDialog.setTitle(app.translation['help-title']);
    var helpButton = new goog.ui.Dialog.ButtonSet();
    helpButton.addButton({key: 'ok', caption: 'Ok'}, true);
    this._helpDialog.setButtonSet(helpButton);
    this._helpDialog.setSafeHtmlContent(goog.html.SafeHtml.create('div', {'id': 'help-popup-wrapper'},
        [goog.html.SafeHtml.create('span', {'id': 'program-version'}, [app.translation['version'], app.VERSION]),
        goog.html.SafeHtml.create('h1', {}, app.translation['how-to-title']),
        // language
        goog.html.SafeHtml.create('h2', {}, app.translation['ht-change-lg-title']),
        goog.html.SafeHtml.create('span', {}, app.translation['ht-change-lg-text']),
        // count of reflections
        goog.html.SafeHtml.create('h2', {}, app.translation['ht-change-cr-title']),
        goog.html.SafeHtml.create('span', {}, app.translation['ht-change-cr-text']),
        // screen size
        goog.html.SafeHtml.create('h2', {}, app.translation['ht-change-sz-title']),
        goog.html.SafeHtml.create('span', {}, app.translation['ht-change-sz-text']),
        // export/import
        goog.html.SafeHtml.create('h2', {}, app.translation['ht-change-xi-title']),
        goog.html.SafeHtml.create('span', {}, app.translation['ht-change-xi-text']),
        // components
        goog.html.SafeHtml.create('h2', {}, app.translation['ht-change-cm-title']),
        goog.html.SafeHtml.create('span', {}, app.translation['ht-change-cm-text'])]
    ));

    this._helpDialog.setVisible(true);
};

/**
 * Displays export simulation dialog
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @private
 */
app.MenuController.prototype._export = function (e) {
    this._hideSubMenus(goog.dom.getElement('top-items'));
    this._dataOutputDialog.setTitle(app.translation['export-menu-msg']);
    var buttonSet = new goog.ui.Dialog.ButtonSet();
    buttonSet.addButton({key: 'ok', caption: 'Ok'}, true, true);
    this._dataOutputDialog.setButtonSet(buttonSet);
    this._dataOutputDialog.setSafeHtmlContent(goog.html.SafeHtml.create('textarea', {
        'tabindex': 1,
        'id': 'export-simulation-data',
        'name': 'export-simulation-data'
    }, this._SCENECONTROLLER.exportData()));
    this._dataOutputDialog.setVisible(true);
    e.stopPropagation();
};

/**
 * Displays import simulation dialog
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @private
*/
app.MenuController.prototype._import = function (e) {
    this._hideSubMenus(goog.dom.getElement('top-items'));
    var data = this._SCENECONTROLLER.exportData();
    this._dataInputDialog.setTitle(app.translation['import-menu-msg']);
    var buttonSet = new goog.ui.Dialog.ButtonSet();
    buttonSet.addButton({key: 'ok', caption: 'Ok'}, true);
    buttonSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
    this._dataInputDialog.setButtonSet(buttonSet);
    this._dataInputDialog.setSafeHtmlContent(goog.html.SafeHtml.create('div', {'id': 'import-popup'},
        goog.html.SafeHtml.create('textarea', {
            'tabindex': 1,
            'id': 'import-simulation-data',
            'name': 'import-simulation-data'
        })
    ));
    goog.dom.removeNode(goog.dom.getElement('import-popup-error'));
    this._dataInputDialog.setVisible(true);
    e.stopPropagation();
};

/**
 * Displays reflections count dialog
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @private
 */
app.MenuController.prototype._reflectionCount = function (e) {
    this._hideSubMenus(goog.dom.getElement('top-items'));
    e.stopPropagation();

    this._refDialog.setTitle(app.translation['reflections-count']);
    var buttonsSet = new goog.ui.Dialog.ButtonSet();
    buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
    buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
    this._refDialog.setButtonSet(buttonsSet);
    this._refDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['ref-count'],
        goog.html.SafeHtml.create('input', {
            'tabindex': 1,
            'type': 'text', 'id': 'reflection-count-input',
            'name': 'reflection-count-input', 'value': app.reflections_count
        })]
    ));
    this._refDialog.setVisible(true);
};

/**
 * Displays screen size dialog
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @private
 */
app.MenuController.prototype._screenSize = function (e) {
    this._hideSubMenus(goog.dom.getElement('top-items'));
    e.stopPropagation();

    this._sizeDialog.setTitle(app.translation['screen-size']);
    var buttonsSet = new goog.ui.Dialog.ButtonSet();
    buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
    buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
    this._sizeDialog.setButtonSet(buttonsSet);
    var count = app.utils.getScreenSize();
    this._sizeDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['set-screen-size'],
        goog.html.SafeHtml.create('input', {
            'tabindex': 1,
            'type': 'text', 'id': 'screen-size-input',
            'name': 'screen-size-input', 'value': count
        })]
    ));
    this._sizeDialog.setVisible(true);
};

/**
 * Displays tolerance dialog
 * @param {!(goog.events.BrowserEvent|goog.ui.KeyboardShortcutEvent)} e
 * @private
 */
app.MenuController.prototype._tolerance = function(e) {
    this._hideSubMenus(goog.dom.getElement('top-items'));
    e.stopPropagation();

    this._toleranceDialog.setTitle(app.translation['tolerance-title']);
    var buttonsSet = new goog.ui.Dialog.ButtonSet();
    buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
    buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
    this._toleranceDialog.setButtonSet(buttonsSet);
    this._toleranceDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['set-tolerance'],
        goog.html.SafeHtml.create('input', {
            'tabindex': 1,
            'type': 'text', 'id': 'tolerance-input',
            'name': 'tolerance-input', 'value': app.utils.getTolerance()
        })]
    ));
    this._toleranceDialog.setVisible(true);
};
