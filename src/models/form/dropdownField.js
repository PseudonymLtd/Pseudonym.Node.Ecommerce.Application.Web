const FormObject = require('./formObject');
const DropDownFieldValue = require('./dropdownFieldValue');

module.exports = class DropDownField extends FormObject
{
    constructor(name, availableOptions) {
        const defaultValue = new DropDownFieldValue('DEFAULT', 'Please Select');
        super(name, null, 'dropdown', false, defaultValue);
        this._availableOptions = availableOptions;
        this._availableOptions.unshift(defaultValue);
    }

    get AvailableOptions() {
        return this._availableOptions;
    }

    //Direct Override
    Render(instance) {
        let selectedOption = this.InitalValue

        if (instance && instance[this.Name]) {
            selectedOption = this.AvailableOptions.find(ddfv => ddfv.Value == instance[this.Name]);
        }

        const options = [];

        for (let option of this.AvailableOptions) {
            options.push(`<option id="${this.Id}Item-${option.Value}" value="${option.Value}" class="dropdown-item ${selectedOption.Value == option.Value ? 'active' : ''}">${option.DisplayName}</option>`)
        }

        return '<div class="form-group">' +
                    `<label id="${this.Id}Label" for="${this.Id}">${this.Name}</label>` +
                    `<div id="${this.Id}Selector" class="dropdown">` +
                        `<a id="${this.Id}Display" class="btn btn-warning dropdown-toggle" style="max-width: 360px; width: 100%;" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${selectedOption.DisplayName}</a>` +
                        `<div id="${this.Id}Items" class="dropdown-menu" aria-labelledby="${this.Id}Display">${options.join('')}</div>` +
                    '</div>' +
                    `<input scope="boundDropdown" type="hidden" id="${this.Id}" name="${this.Name}" value="${selectedOption.Value}">` +
                '</div>';
    }
}