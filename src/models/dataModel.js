module.exports = class DataModel
{
    constructor(id) {
        this.id = parseInt(id);
    }

    get Id() {
        return this.id;
    }

    set Id(value) {
        return this.id = parseInt(value);
    }
}