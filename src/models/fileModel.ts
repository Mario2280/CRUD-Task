import {Schema, model} from 'mongoose';

let fileSchema = new Schema({
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
    }
});

export default model("File", fileSchema);