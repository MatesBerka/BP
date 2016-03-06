goog.provide('app.MenuController');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Popup');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.labs.userAgent.device');
goog.require('app.SceneController');

/**
 * @param {!app.SceneController} sceneController
 * @final
 * @constructor
 */
app.MenuController = function (sceneController) {
    /**
     * @const
     * @type {!app.SceneController}
     * @private
     */
    this._SCENECONTROLLER = sceneController;
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._refDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._helpDialog = new goog.ui.Dialog('wide-dialog');
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._dataOutputDialog = new goog.ui.Dialog();
    /**
     * @type {goog.ui.Dialog}
     * @private
     */
    this._dataInputDialog = new goog.ui.Dialog();

    this._addListeners();
};

/**
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
 * @param {!goog.events.BrowserEvent} e
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
                if (isNaN(input.value) || input.value < 1) {
                    input.style.backgroundColor = "red";
                    e.preventDefault();
                } else {
                    this._SCENECONTROLLER.setReflectionsCount(input.value);
                }
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('reflections-count'), goog.events.EventType.CLICK, this._reflectionCount, true, this);

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
                app.LOCALE = 'en_US';
            } else if (e.target.id == "lang-cs-cz") {
                app.LOCALE = 'cs_CZ';
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
                    this._SCENECONTROLLER.importData(JSON.parse(textArea.value));
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

    shortcutHandler.registerShortcut('CTRL_A M',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.M); // add mirror

    shortcutHandler.registerShortcut('CTRL_A S',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.S); // add splitter

    shortcutHandler.registerShortcut('CTRL_A E',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.E); // add lens

    shortcutHandler.registerShortcut('CTRL_A H',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.H); // add holographic plate

    shortcutHandler.registerShortcut('CTRL_A W',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.W); // add wall

    shortcutHandler.registerShortcut('CTRL_A L',
        goog.events.KeyCodes.A, CTRL,
        goog.events.KeyCodes.L); // add light

    shortcutHandler.registerShortcut('CTRL_I', goog.events.KeyCodes.I, CTRL); // simulation import
    shortcutHandler.registerShortcut('CTRL_X', goog.events.KeyCodes.X, CTRL); // simulation export
    shortcutHandler.registerShortcut('CTRL_R', goog.events.KeyCodes.R, CTRL); // simulation reset
    shortcutHandler.registerShortcut('CTRL_C', goog.events.KeyCodes.C, CTRL); // settings/count of reflection

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
            console.log(e.identifier);
            switch(e.identifier) {
                case 'CTRL_H':
                    this._showHelp();
                    break;
                case 'CTRL_A M':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'MIRROR');
                    break;
                case 'CTRL_A S':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'SPLITTER');
                    break;
                case 'CTRL_A E':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'LENS');
                    break;
                case 'CTRL_A H':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'HOLO-PLATE');
                    break;
                case 'CTRL_A W':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'WALL');
                    break;
                case 'CTRL_A L':
                    this._addComponent(/**@type{!goog.events.BrowserEvent}*/(e), 'LIGHT');
                    break;
                case 'CTRL_I':
                    this._import(/**@type{!goog.events.BrowserEvent}*/(e));
                    break;
                case 'CTRL_X':
                    this._export(/**@type{!goog.events.BrowserEvent}*/(e));
                    break;
                case 'CTRL_R':
                    location.reload();
                    break;
                case 'CTRL_C':
                    this._reflectionCount(/**@type{!goog.events.BrowserEvent}*/(e));
                    break;
                case 'CTRL_Q E':
                    app.LOCALE = 'en_US';
                    app.utils.translate();
                    break;
                case 'CTRL_Q C':
                    app.LOCALE = 'cs_CZ';
                    app.utils.translate();
                    break;
            }
        }, false, this);
};

/**
 * @private
 */
app.MenuController.prototype._showHelp = function () {
    this._helpDialog.setTitle(app.translation['help-title']);
    var helpButton = new goog.ui.Dialog.ButtonSet();
    helpButton.addButton({key: 'ok', caption: 'Ok'}, true);
    this._helpDialog.setButtonSet(helpButton);
    // TODO ADD TEXT
    this._helpDialog.setSafeHtmlContent(goog.html.SafeHtml.create('div', {'id': 'help-popup-wrapper'},
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc volutpat tincidunt lectus, ut sagittis enim" +
        " egestas ut. Donec sed luctus odio. Mauris finibus laoreet magna, vitae rhoncus tortor eleifend aliquet." +
        " Curabitur mattis pretium mauris. Etiam finibus nunc laoreet magna scelerisque dictum. Integer id viverra" +
        " lacus. Sed posuere odio tortor, eget scelerisque quam viverra in. Morbi et turpis laoreet, pharetra libero" +
        " porttitor, convallis nunc. Aliquam erat volutpat. Nam quis varius lectus, vitae tincidunt nisi. Vivamus" +
        " consectetur consectetur nunc in consectetur. Suspendisse vehicula malesuada volutpat. Donec imperdiet" +
        " sodales sagittis. Aliquam congue risus sed consequat tincidunt. Quisque ullamcorper ut libero sed rutrum." +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis" +
        " elit, elementum fermentum arcu ullamcorper nec. Nam luctus tincidunt quam ac iaculis. Nulla facilisi. Ut" +
        " in elit tellus. Morbi at maximus nisl, sit amet laoreet turpis. Proin egestas ullamcorper arcu ac suscipit." +
        " Morbi sapien felis, vehicula ut metus a, vehicula luctus dolor. Nullam mollis egestas justo et suscipit." +
        " Aliquam erat volutpat. Maecenas vel ex nulla. Vestibulum imperdiet hendrerit ipsum sit amet vulputate." +
        " Cras eu turpis vel nisi sodales tempor. Morbi eu neque congue, gravida diam in, auctor lorem. Vivamus" +
        " ornare, felis ac porta dapibus, lacus enim blandit ex, posuere tempus libero nisl at nisl. Suspendisse" +
        " potenti. Mauris ornare consectetur ullamcorper. Nam vulputate nunc sed elit luctus, eu accumsan lacinia."
    ));
    this._helpDialog.setVisible(true);
};

/**
 * @param {!goog.events.BrowserEvent} e
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
 * @param {!goog.events.BrowserEvent} e
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
 * @param {!goog.events.BrowserEvent} e
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
    var count = this._SCENECONTROLLER.getReflectionsCount();
    this._refDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['ref-count'],
        goog.html.SafeHtml.create('input', {
            'tabindex': 1,
            'type': 'text', 'id': 'reflection-count-input',
            'name': 'reflection-count-input', 'value': count
        })]
    ));
    this._refDialog.setVisible(true);
};
