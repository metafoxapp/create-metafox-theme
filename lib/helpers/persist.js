"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Persist {
    constructor(filename) {
        this.data = {};
        this.filename = filename;
        if ((0, fs_1.existsSync)(filename)) {
            this.data = JSON.parse((0, fs_1.readFileSync)(this.filename, { encoding: 'utf-8' }));
        }
        if (!this.data) {
            this.data = {};
        }
    }
    get(name, value) {
        return (this.data[name] ?? value);
    }
    save(data) {
        this.data = { ...this.data, ...data };
        (0, fs_1.writeFileSync)(this.filename, JSON.stringify(this.data, null, "  "), { encoding: "utf-8" });
    }
}
exports.default = Persist;
