"use strict";
import { Model, ModelOptions, QueryContext } from "objection";

export interface ITimestampPluginOption {
  createdAt?: string;
  updatedAt?: string;
  genDate?: () => string | any;
}

interface IConstructor extends Function {
  timestamp: boolean;
}

export function timestampPlugin(options?: ITimestampPluginOption) {
  let opts: ITimestampPluginOption = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    genDate() {
      return new Date().toISOString();
    },
  };

  opts = Object.assign({}, opts, options);

  return <M extends typeof Model>(ClassModel: typeof Model): M => {
    return class extends ClassModel {
      public $beforeInsert(ctx: QueryContext) {
        const promise = super.$beforeInsert(ctx);
        const config = this.constructor as IConstructor;

        if (config.timestamp) {
          return Promise.resolve(promise)
            .then(() => {
              (this as any)[opts.createdAt!] = (this as any)[opts.createdAt!] || opts.genDate!();
              (this as any)[opts.updatedAt!] = (this as any)[opts.updatedAt!] || opts.genDate!();
            });
        }
        return Promise.resolve(promise);
      }

      public $beforeUpdate(opt: ModelOptions, ctx: QueryContext) {
        const promise = super.$beforeUpdate(opt, ctx);
        const config = this.constructor as IConstructor;

        if (config.timestamp) {
          return Promise.resolve(promise)
            .then(() => {
              (this as any)[opts.updatedAt!] = (this as any)[opts.updatedAt!] || opts.genDate!();
            });
        }
        return Promise.resolve(promise);
      }
    } as M;
  };
}
