goog.provide('app.MenuController');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Popup');
goog.require('goog.labs.userAgent.device');
goog.require('app.SceneController');

/**
 * @param {!app.SceneController} sceneController
 * @final
 * @constructor
 */
app.MenuController = function (sceneController) {
    /**
     * @type {!app.SceneController}
     * @private
     */
    this._sceneController = sceneController;
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

    this._addListeners();
};

/**
 * @param {!goog.events.BrowserEvent} e
 * @param {Element} child
 * @private
 */
app.MenuController.prototype._toggleSubMenu = function (e, child) {
    if(child.className.indexOf('nested-items') !== -1) {
        var display = 'block';
        if(child.style.display === 'block') { display = 'none'; }

        if(child.parentNode.className.indexOf('top-item') !== -1) {
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
app.MenuController.prototype._hideSubMenus = function(element) {
    var subMenus = goog.dom.getElementsByClass('nested-items', element);
    for(var i = 0; i < subMenus.length; i++) {
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
    this._toggleSubMenu(e, /**@type{Element}*/(e.currentTarget.parentNode));
    this._sceneController.showCross(type);
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

        if(goog.labs.userAgent.device.isDesktop()) {
            goog.events.listen(li[i], goog.events.EventType.MOUSEENTER,
                /**
                 * @this {!app.MenuController}
                 * @param {!goog.events.BrowserEvent} e
                 */
                function (e) {
                    var child = goog.dom.getLastElementChild(/**@type{Node}*/(e.currentTarget));
                    if(child.className.indexOf('nested-items') !== -1) {
                        if(child.parentNode.className.indexOf('top-item') !== -1) {
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
                    console.log('leave');
                    if(child.className.indexOf('nested-items') !== -1) {
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
                    this._sceneController.setReflectionsCount(input.value);
                }
            }
        },
        false, this);

    goog.events.listen(goog.dom.getElement('reflections-count'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._hideSubMenus(goog.dom.getElement('top-items'));
            e.stopPropagation();

            this._refDialog.setTitle(app.translation['reflections-count']);
            var buttonsSet = new goog.ui.Dialog.ButtonSet();
            buttonsSet.addButton({key: 'ok', caption: 'Ok'}, true);
            buttonsSet.addButton({key: 'cancel', caption: app.translation['cancel-btn']}, false, true);
            this._refDialog.setButtonSet(buttonsSet);
            var count = this._sceneController.getReflectionsCount();
            this._refDialog.setSafeHtmlContent(goog.html.SafeHtml.create('span', {}, [app.translation['ref-count'],
                goog.html.SafeHtml.create('input', {
                    'type': 'text', 'id': 'reflection-count-input',
                    'name': 'reflection-count-input', 'value': count
                })]
            ));
            this._refDialog.setVisible(true);
        },
        true, this);

    // simulation/settings/language
    goog.events.listen(goog.dom.getElementByClass('language-switch'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._hideSubMenus(goog.dom.getElement('top-items'));
            e.stopPropagation();

            // TODO save into cookies?
            if (e.target.id == "lang-en-us") {
                app.LOCALE = 'en_US';
            } else if (e.target.id == "lang-cs-cz") {
                app.LOCALE = 'cs_CZ';
            }
            app.utils.translate();
        },
        true, this);

    // simulation/save simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._hideSubMenus(goog.dom.getElement('top-items'));
            e.stopPropagation();
            // todo
        },
        false, this);

    // simulation/export simulation
    goog.events.listen(goog.dom.getElement('logo'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._hideSubMenus(goog.dom.getElement('top-items'));
            e.stopPropagation();
            // todo
            // into svg
        },
        false, this);

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
        }, false, this);

    // components/add holographic plate
    goog.events.listen(goog.dom.getElement('add-holo-plate'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'HOLO-PLATE');
        }, false, this);

    // components/add wall
    goog.events.listen(goog.dom.getElement('add-wall'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'WALL');
        }, false, this);

    // components/add light
    goog.events.listen(goog.dom.getElement('add-light'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'LIGHT');
        }, false, this);
    // components/add splitter
    goog.events.listen(goog.dom.getElement('add-splitter'), goog.events.EventType.CLICK,
        /**
         * @this {!app.MenuController}
         * @param {!goog.events.BrowserEvent} e
         */
        function (e) {
            this._addComponent(e, 'SPLITTER');
        }, false, this);

    // help
    goog.events.listen(goog.dom.getElement('help'), goog.events.EventType.CLICK,
        /** @this {!app.MenuController} */
        function () {
            this._helpDialog.setTitle(app.translation['help-title']);
            var helpButton = new goog.ui.Dialog.ButtonSet();
            helpButton.addButton({key: 'ok', caption: 'Ok'}, true);
            this._helpDialog.setButtonSet(helpButton);
            // TODO ADD TEXT
            this._helpDialog.setTextContent("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc volutpat tincidunt lectus, ut sagittis enim egestas ut. Donec sed luctus odio. Mauris finibus laoreet magna, vitae rhoncus tortor eleifend aliquet. Curabitur mattis pretium mauris. Etiam finibus nunc laoreet magna scelerisque dictum. Integer id viverra lacus. Sed posuere odio tortor, eget scelerisque quam viverra in. Morbi et turpis laoreet, pharetra libero porttitor, convallis nunc. " +
                "Aliquam erat volutpat. Nam quis varius lectus, vitae tincidunt nisi. Vivamus consectetur consectetur nunc in consectetur. Suspendisse vehicula malesuada volutpat. Donec imperdiet sodales sagittis. Aliquam congue risus sed consequat tincidunt. Quisque ullamcorper ut libero sed rutrum. Sed eu malesuada risus. Nunc eget enim congue, vulputate arcu non, luctus tortor. Morbi porttitor turpis elit, elementum fermentum arcu ullamcorper nec. Nam luctus tincidunt quam ac iaculis. Nulla facilisi. Ut in elit tellus. " +
                "Morbi at maximus nisl, sit amet laoreet turpis. Proin egestas ullamcorper arcu ac suscipit. Morbi sapien felis, vehicula ut metus a, vehicula luctus dolor. Nullam mollis egestas justo et suscipit. Aliquam erat volutpat. Maecenas vel ex nulla. Vestibulum imperdiet hendrerit ipsum sit amet vulputate. Cras eu turpis vel nisi sodales tempor. Morbi eu neque congue, gravida diam in, auctor lorem. Vivamus ornare, felis ac porta dapibus, lacus enim blandit ex, posuere tempus libero nisl at nisl. Suspendisse potenti. Mauris ornare consectetur ullamcorper. Nam vulputate nunc sed elit luctus, eu accumsan nibh lacinia. " +
                "Nunc id neque non turpis hendrerit dictum id eu nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut congue mattis leo, quis laoreet dolor. Mauris justo felis, maximus et neque ut, elementum malesuada metus. Nunc dapibus efficitur dolor et aliquet. Sed lacus purus, semper quis libero ac, porta lacinia tellus. Aenean enim enim, lacinia id dapibus in, condimentum vel metus. " +
                "Nunc at auctor justo, quis lobortis massa. Sed a urna id sapien ornare consectetur. Integer porta nisl nulla, vel vestibulum lectus ornare vel. Pellentesque malesuada aliquam porttitor. In fermentum mi sit amet velit facilisis, at fringilla lectus ultricies. Donec porttitor, nunc et bibendum cursus, mi tortor cursus magna, efficitur varius dui tellus non nibh. Suspendisse risus justo, eleifend at fringilla in, volutpat at sem. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque vehicula id orci vitae congue. Cras fermentum ullamcorper dolor a bibendum. Praesent at sem pretium, mollis tellus ut, venenatis quam. Ut a facilisis orci, non volutpat est. Praesent metus arcu, iaculis non pellentesque vitae,");
            this._helpDialog.setVisible(true);
        }, true, this);
};