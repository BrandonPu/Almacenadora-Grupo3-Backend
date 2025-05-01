import {Schema, model} from "mongoose";

const entryHistorySchema = new Schema({
    keeperUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    modify: [
        {
            type: Object,
            required: false
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

export default model('entryHistory', entryHistorySchema)