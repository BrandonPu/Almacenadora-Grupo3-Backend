import { Schema, model } from "mongoose";

const SupplierSchema = Schema({
    nameSupplier : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    productSupplier : {
        type: String,
        required: [true, 'Product required'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    emailSupplier : {
        type: String,
        required: [true, 'Email required'],
        unique: true
    }
},
{
    timestamps: true,
    versionKey: false,
});

export default model('Supplier', SupplierSchema);