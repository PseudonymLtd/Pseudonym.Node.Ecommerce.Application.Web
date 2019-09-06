const FormObject = require('./formObject');

module.exports = class TextField extends FormObject
{
    constructor(name, placeholder, required, initalValue) {
        super(name, placeholder, 'text', required, initalValue);
    }
}