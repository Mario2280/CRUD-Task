import {Schema, model} from 'mongoose';

let folderSchema = new Schema({
    name: {
        type:String,
        required: true,
    },
    path: {
        type:String,
        required: true,
    },
    ctime: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    isEmpty: {
        type: Boolean,
        default: false,
        required: true,
    }
});

export default model("Folder", folderSchema);