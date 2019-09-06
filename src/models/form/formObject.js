module.exports = class FormObject
{
    constructor(name, placeholder, type, required, initalValue) {
        this._name = name
        this._type = type;
        this._required = required;
        this._initalValue = initalValue ? initalValue.toString() : undefined;
        this._placeholder = placeholder;
        this._additionalAttributes = [];
    }

    get Id() {
        return `${this._name.toLowerCase()}Input`;
    }

    get Name() {
        return this._name;
    }

    get Type() {
        return this._type;
    }

    get Required() {
        return this._required;
    }

    get InitalValue() {
        return this._initalValue;
    }

    get Placeholder() {
        return this._placeholder;
    }

    get AdditionalAttributes() {
        return this._additionalAttributes;
    }

    Render(instance) {
        let value = this.InitalValue ? this.InitalValue : undefined;

        if (instance && instance[this.Name]) {
            value = instance[this.Name];
        }

        return '<div class="form-group">' +
                    `<label id="${this.Id}Label" for="${this.Id}">${this.Name}</label>` +
                    `<input class="form-control" type="${this.Type}" id="${this.Id}" name="${this.Name}"  ${value ? `value="${value}"` : ''} placeholder="${this.Placeholder}" ${this.AdditionalAttributes.join(' ')} aria-describedby="${this.Id}Label" ${this.Required ? 'required' : ''} />` +
                '</div>';
    }
}