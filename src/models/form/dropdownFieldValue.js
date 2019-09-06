module.exports = class DropDownFieldValue
{
    constructor(value, displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    get Value() {
        return this.value;
    }

    get DisplayName() {
        return this.displayName;
    }
}