const Framework = require('pseudonym.node.ecommerce.library.framework');
const TextField = require('./form/textField');

module.exports = class RenderableEntity extends Framework.Models.DataModel
{
    constructor(id, entityName, entityName_Plural) {
        super(id);
        this.entityName = entityName;
        this.entityName_Plural = entityName_Plural;
    }
    
    get EntityName() {
        return this.entityName;
    }

    get EntityName_Plural() {
        return this.entityName_Plural;
    }

    Render() {
        return { 
            id: this.id,
            html: `<span>Entity [${this.EntityName}] Id: ${this.Id}</span>`
        }
    }

    static FormMetaData() {
        return [
            new TextField('Id', '', true, '')
        ];
    }
}