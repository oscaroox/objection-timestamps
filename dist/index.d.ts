import { Model } from "objection";
export interface ITimestampPluginOption {
    createdAt?: string;
    updatedAt?: string;
    genDate(): string | any;
}
export declare function timestampPlugin(options?: ITimestampPluginOption): <M extends typeof Model>(ClassModel: typeof Model) => M;
