const FormObject = require('./formObject');

module.exports = class NumberField extends FormObject
{
    constructor(name, placeholder, required, initalValue, stepValue) {
        super(name, placeholder, 'number', required, initalValue);
        this._stepValue = parseFloat(stepValue);
        
        this.AdditionalAttributes.push(`step="${stepValue}"`);
    }

    get StepValue() {
        return this._stepValue;
    }
}