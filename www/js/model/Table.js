goog.provide('app.model.Table');

/**
 * @param {!string} tableName
 * @final
 * @constructor
 */
app.model.Table = function (tableName) {
    /**
     * @type {!string}
     * @private
     */
    this._tableName = tableName;
    /**
     * @type {!Array<!app.model.View>}
     * @private
     */
    this._views = [];
    /**
     * @type {!Array<!app.model.Component>}
     * @private
     */
    this._components = [];
    /**
     * @type {!number}
     * @private
     */
    this._highestLightID = 0;
    /**
     * @type {!number}
     * @private
     */
    this._activeViewsCount = 0;
};

/**
 * @returns {!string}
 * @public
 */
app.model.Table.prototype.getName = function () {
    return this._tableName;
};

/**
 * @param {!string} name
 * @public
 */
app.model.Table.prototype.changeName = function (name) {
    this._tableName = name;
};

/**
 * @param {!number} viewID
 * @param {!string} name
 * @public
 */
app.model.Table.prototype.updateViewName = function (viewID, name) {
    this._views[viewID].changeName(name);
};

/**
 * @returns {!number}
 * @public
 */
app.model.Table.prototype.getNextViewID = function () {
    return this._views.length;
};

/**
 * @param {!app.model.View} view
 * @public
 */
app.model.Table.prototype.addView = function (view) {
    this._views.push(view);
};

/**
 * @param {!number} viewID
 * @return {!app.model.View}
 * @public
 */
app.model.Table.prototype.getView = function (viewID) {
    return this._views[viewID];
};

/**
 * @return {!Array<!app.model.View>}
 * @public
 */
app.model.Table.prototype.getViews = function () {
    return this._views;
};

/**
 * @param {!number} viewID
 * @param {!number} width
 * @param {!number} height
 * @public
 */
app.model.Table.prototype.updateViewSize = function (viewID, width, height) {
    this._views[viewID].updateSize(width, height);
};

/**
 * @public
 */
app.model.Table.prototype.increaseActiveViewsCount = function () {
    this._activeViewsCount++;
};

/**
 * @public
 */
app.model.Table.prototype.decreaseActiveViewsCount = function () {
    this._activeViewsCount--;
};

/**
 * @return {!number}
 * @public
 */
app.model.Table.prototype.getActiveViewsCount = function () {
    return this._activeViewsCount;
};

/**
 * @return {!Array<!app.model.Component>}
 * @public
 */
app.model.Table.prototype.getComponents = function () {
    return this._components;
};

/**
 * @param {!app.model.Component} model
 * @return {!number}
 * @public
 */
app.model.Table.prototype.addComponent = function (model) {
    if (model.getType() === 'LIGHT') {
        this._highestLightID++;
        /**@suppress {checkTypes}*/model.setLightID(this._highestLightID);
        this._components.push(model);
    } else {
        this._components.push(model);
    }

    return (this._components.length - 1);
};

/**
 * @param {!number} componentID
 * @public
 */
app.model.Table.prototype.removeComponent = function (componentID) {
    this._components.splice(componentID, 1);
};

/**
 * @param {!number} viewID
 * @public
 */
app.model.Table.prototype.removeView = function (viewID) {
    this._views.splice(viewID, 1);
    this._activeViewsCount--;
};

/**
 * @param {!Object} tableModel
 * @public
 */
app.model.Table.prototype.importTable = function(tableModel) {
    this._highestLightID = tableModel._highestLightID;
};