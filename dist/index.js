"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function timestampPlugin(options) {
    let opts = {
        createdAt: "created_at",
        updatedAt: "updated_at",
        genDate() {
            return new Date().toISOString();
        },
    };
    opts = Object.assign({}, opts, options);
    return (ClassModel) => {
        return class extends ClassModel {
            $beforeInsert(ctx) {
                const promise = super.$beforeInsert(ctx);
                const config = this.constructor;
                if (config.timestamp) {
                    return Promise.resolve(promise)
                        .then(() => {
                        this[opts.createdAt] = this[opts.createdAt] || opts.genDate();
                        this[opts.updatedAt] = this[opts.updatedAt] || opts.genDate();
                    });
                }
                return Promise.resolve(promise);
            }
            $beforeUpdate(opt, ctx) {
                const promise = super.$beforeUpdate(opt, ctx);
                const config = this.constructor;
                if (config.timestamp) {
                    return Promise.resolve(promise)
                        .then(() => {
                        this[opts.updatedAt] = this[opts.updatedAt] || opts.genDate();
                    });
                }
                return Promise.resolve(promise);
            }
        };
    };
}
exports.timestampPlugin = timestampPlugin;
//# sourceMappingURL=index.js.map