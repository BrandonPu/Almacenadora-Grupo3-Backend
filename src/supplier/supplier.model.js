import { Schema, model } from "mongoose";

const SupplierSchema = Schema({
    nameSupplier : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    emailSupplier : {
        type: String,
        required: [true, 'Email required'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number required'],
        unique: true
    },
    keeperProduct: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    }],
    state: {
        type: Boolean,
        default: true
    } 
},
{
    timestamps: true,
    versionKey: false,
});

export default model('Supplier', SupplierSchema);