goog.provide('app.model.Table');

/**
 * @constructor
 */
app.model.Table = function(tableID, tableName) {

    this._views = [];

    this._tableID = tableID;

    this._tableName = tableName;

    this._highestLightID = 0;

    this._components = [];

    this._activeViewsCount = 0;
};

app.model.Table.prototype.getName = function() {
    return this._tableName;
};

app.model.Table.prototype.getNextViewID = function() {
    return this._views.length;
};

app.model.Table.prototype.addView = function(view) {
    this._views.push(view);
};

app.model.Table.prototype.getView = function(viewID) {
    return this._views[viewID];
};

app.model.Table.prototype.getViews = function() {
    return this._views;
};

app.model.Table.prototype.updateViewSize = function(viewID, width, height) {
    this._views[viewID].updateSize(width, height);
};

app.model.Table.prototype.increaseActiveViewsCount = function() {
    this._activeViewsCount++;
};

app.model.Table.prototype.decreaseActiveViewsCount = function() {
    this._activeViewsCount--;
};

app.model.Table.prototype.getActiveViewsCount = function() {
    return this._activeViewsCount;
};

app.model.Table.prototype.getComponents = function() {
    return this._components;
};

app.model.Table.prototype.addComponent = function(model) {
    if(model.getType() === 'LIGHT') {
        this._highestLightID++;
        model.setLightID(this._highestLightID);
        this._components.push(model);
    } else {
        this._components.push(model);
    }

    return (this._components.length - 1);
};

app.model.Table.prototype.removeComponent = function(componentID) {
    this._components.splice(componentID, 1);
};

app.model.Table.prototype.removeView = function(viewID) {
    this._views.splice(viewID, 1);
    this._activeViewsCount--;
};