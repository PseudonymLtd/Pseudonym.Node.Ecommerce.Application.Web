class Logger
{
    constructor(name) {
        this._loggerName = name != undefined ? name : "General";
    }

    get Name() {
        return this._loggerName;
    }

    debug(message) {
        console.debug(`${Date.now()} [DEBUG] ${this.Name}: ${message}`);
    }

    error(message) {
         console.error(`${Date.now()} [ERROR] ${this.Name}: ${message}`);
    }

    fatal(exception) {
        console.error(`${Date.now()} [FATAL] ${this.Name}:`);
        console.error(exception);
    }

    info(message) {
        console.info(`${Date.now()} [INFO] ${this.Name}: ${message}`);
    }

    trace(message) {
        console.trace(`${Date.now()} [TRACE] ${this.Name}: ${message}`);
    }

    warn(message) {
        console.warn(`${Date.now()} [WARN] ${this.Name}: ${message}`);
    }
}

module.exports.Logger = Logger;