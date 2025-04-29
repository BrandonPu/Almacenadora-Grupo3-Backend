import {Schema, model} from "mongoose";

const entryAndExitHistorySchema = new Schema({
    keeperUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    modify: [
        {
            type: Object,
            required: true
        }
    ],
    state: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionkey: false
});

export default model('entryAndExitHistory', entryAndExitHistorySchema)