/* Cordra type lifecycle hook, install on TaxonomicExpert and TaxonomicService.
 * Built-in Cordra admin remains the manual reviewer. Do not add unverified
 * role/group IDs. Existing deployed hooks must be reconciled, not overwritten.
 */
exports.beforeSchemaValidation = function (object, context) {
    var key = object.type === "TaxonomicExpert" ? "taxonomicExpert" :
        object.type === "TaxonomicService" ? "taxonomicService" : null;
    if (!key || !object.content || !object.content[key]) {
        throw "Invalid Marketplace record";
    }
    var record = object.content[key];
    record["@type"] = object.type;
    if (context.isNew) {
        // Even an admin create starts pending. Approve via a separate edit.
        record["schema:status"] = "proposed";
        record["schema:ratingValue"] = 0;
        delete record["schema:ratingExplanation"];
        delete record["schema:comments"];
    } else if (context.userId !== "admin") {
        var original = context.originalObject && context.originalObject.content &&
            context.originalObject.content[key];
        if (!original) throw "Cannot verify previous Marketplace record";
        record["schema:status"] = "proposed";
        record["schema:ratingValue"] = 0;
        delete record["schema:ratingExplanation"];
        if (Object.prototype.hasOwnProperty.call(original, "schema:comments")) {
            record["schema:comments"] = original["schema:comments"];
        } else {
            delete record["schema:comments"];
        }
        if (original["@id"]) record["@id"] = original["@id"];
    }
    // Admin approvals are still subject to rating bounds in the schema.
    return object;
};
