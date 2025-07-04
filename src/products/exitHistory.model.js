import {Schema, model} from "mongoose";

const exitHistorySchema = new Schema({
    keeperUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    quantity: { 
        type: Number, 
        required: false 
    },
    reason: { 
        type: String, 
        required: false 
    },
    destination: { 
        type: String, 
        required: false 
    },
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: false 
    },
    keeperClient: {
        type: Schema.Types.ObjectId, 
        ref: 'Client', 
        required: false 
    },
    keeperFrecuentClient: {
        type: Schema.Types.ObjectId, 
        ref: 'FrecuentClient', 
        required: false 
    },
    state: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionkey: false
});

export default model('ExitHistory', exitHistorySchema)