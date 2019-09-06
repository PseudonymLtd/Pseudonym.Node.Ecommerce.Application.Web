const FormObject = require('./formObject');

module.exports = class EmailField extends FormObject
{
    constructor(name, placeholder, required, initalValue) {
        super(name, placeholder, 'email', required, initalValue);
    }
}