goog.provide('app.model.Table');

/**
 * @description Diffractive optics simulator
 * @author Matěj Berka
 * @param {!string} tableName
 * @final
 * @constructor
 * This model represents a single table. Contains added components and used views.
 */
app.model.Table = function (tableName) {
    /**
     * Table name displayed in menu.
     * @type {!string}
     * @private
     */
    this._tableName = tableName;
    /**
     * Views used to display this table.
     * @type {!Array<!app.model.View>}
     * @private
     */
    this._views = [];
    /**
     * Components added to this table.
     * @type {!Array<!app.model.Component>}
     * @private
     */
    this._components = [];
    /**
     * Used highest light ID.
     * @type {!number}
     * @private
     */
    this._highestLightID = 0;
    /**
     * Number of active views.
     * @type {!number}
     * @private
     */
    this._activeViewsCount = 0;
};

/**
 * Returns table name.
 * @returns {!string}
 * @public
 */
app.model.Table.prototype.getName = function () {
    return this._tableName;
};

/**
 * Updates table name.
 * @param {!string} name
 * @public
 */
app.model.Table.prototype.changeName = function (name) {
    this._tableName = name;
};

/**
 * Updates view name.
 * @param {!number} viewID
 * @param {!string} name
 * @public
 */
app.model.Table.prototype.updateViewName = function (viewID, name) {
    this._views[viewID].changeName(name);
};

/**
 * Returns next ID for new view.
 * @returns {!number}
 * @public
 */
app.model.Table.prototype.getNextViewID = function () {
    return this._views.length;
};

/**
 * Adds new view.
 * @param {!app.model.View} view
 * @public
 */
app.model.Table.prototype.addView = function (view) {
    this._views.push(view);
};

/**
 * returns view specified by ID.
 * @param {!number} viewID
 * @return {!app.model.View}
 * @public
 */
app.model.Table.prototype.getView = function (viewID) {
    return this._views[viewID];
};

/**
 * Returns views used to display this table.
 * @return {!Array<!app.model.View>}
 * @public
 */
app.model.Table.prototype.getViews = function () {
    return this._views;
};

/**
 * Updates size of view specified by ID.
 * @param {!number} viewID
 * @param {!number} width
 * @param {!number} height
 * @public
 */
app.model.Table.prototype.updateViewSize = function (viewID, width, height) {
    this._views[viewID].updateSize(width, height);
};

/**
 * Increases views counter.
 * @public
 */
app.model.Table.prototype.increaseActiveViewsCount = function () {
    this._activeViewsCount++;
};

/**
 * Decreases views counter.
 * @public
 */
app.model.Table.prototype.decreaseActiveViewsCount = function () {
    this._activeViewsCount--;
};

/**
 * Returns count of active views.
 * @return {!number}
 * @public
 */
app.model.Table.prototype.getActiveViewsCount = function () {
    return this._activeViewsCount;
};

/**
 * Returns table components.
 * @return {!Array<!app.model.Component>}
 * @public
 */
app.model.Table.prototype.getComponents = function () {
    return this._components;
};

/**
 * Adds new component to the table.
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
 * Adds/imports new component to the table.
 * @param {!app.model.Component} model
 * @public
 */
app.model.Table.prototype.importComponent = function (model) {
    this._components.push(model);
};

/**
 * @param {!number} componentID
 * @public
 */
app.model.Table.prototype.removeComponent = function (componentID) {
    this._components.splice(componentID, 1);
};

/**
 * Removes view specified by ID from table.
 * @param {!number} viewID
 * @public
 */
app.model.Table.prototype.removeView = function (viewID) {
    this._views.splice(viewID, 1);
    this._activeViewsCount--;
};

/**
 * Imports table data.
 * @param {!Object} tableModel
 * @public
 */
app.model.Table.prototype.importTable = function(tableModel) {
    this._highestLightID = tableModel._highestLightID;
};