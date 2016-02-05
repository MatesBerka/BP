goog.provide('app.model.Table');

/**
 * @constructor
 */
app.model.Table = function(tableID, tableName) {

    this.views_ = [];

    this.tableID_ = tableID;

    this.tableName_ = tableName;
};

app.model.Table.prototype.getNextViewID = function() {
    return this.views_.length;
};

app.model.Table.prototype.addView = function(view) {
    this.views_.push(view);
};

app.model.Table.prototype.getViewsCount = function() {
    return this.views_.length;
};