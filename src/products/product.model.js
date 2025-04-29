import { Schema, model } from "mongoose"; 

const ProductSchema = Schema({
    nameProduct : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [50, 'Cant be overcome 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Description required'],
        maxLength: [255, 'Cant be overcome 255 characters']
    },
    stock : {
        type: Number,
        required: [true, 'Stock required'],
        min: 1
    },
    keeperCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        //required: [true, 'Category required']
    },
    keeperSupplier : {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        //required: [true, 'Supplier required']
    },
    price : {
        type: Number,
        required: [true, 'Price required'],
        min: 0
    },
    entryDate : {
        type: Date,
        required: [true, 'Date required']
    },
    purchaseRecord: {
        type: Number,
        required: false
    },
    state: {
        type: Boolean,
        default: true
    } 

}, 
{
    timestamps: true,
    versionKey: false,
});

export default model('Product', ProductSchema);