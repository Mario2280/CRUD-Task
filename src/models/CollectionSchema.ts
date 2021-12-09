//@ts-nocheck
import { Schema, model } from 'mongoose';

interface ICollectionSchema {
    name?: string;
    path?: string;
    isFile?: boolean;
    isEmpty?: boolean;
    extname?: string;
    ctime?:Date;
  }

const CollectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
        index: true,
    },
    ctime: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    isFile: {
        type: Boolean,
        required: true,
    },
    isEmpty: {
        type: Boolean,
        required: function () { return this.isFile ? false : true; }
    },
    extname: {
        type: String,
        required: function () { return this.isFile ? true : false; }
    },
});
export {ICollectionSchema};
export default model<ICollectionSchema>("Collection", CollectionSchema);