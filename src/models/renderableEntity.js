const TextField = require('./form/textField');

module.exports = class RenderableEntity
{
    constructor(id, entityName, entityName_Plural) {
        this.id = id ? id : null;
        this.entityName = entityName;
        this.entityName_Plural = entityName_Plural;
    }

    get Id() {
        return this.id;
    }

    set Id(value) {
        return this.id = value;
    }

    get EntityName() {
        return this.entityName;
    }

    get EntityName_Plural() {
        return this.entityName_Plural;
    }

    Render() {
        return { 
            id: this.Id,
            html: `<span>Entity [${this.EntityName}] Id: ${this.Id}</span>`
        }
    }

    static FormMetaData() {
        return [
            new TextField('Id', '', true, '')
        ];
    }
}