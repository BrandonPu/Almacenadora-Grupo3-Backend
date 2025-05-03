import {Schema, model} from "mongoose";

const ClientSchema = Schema({
    name : {
        type: String,
        required: [true, 'Name required'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    surname : {
        type: String,
        required: [true, 'Surname required'],
        maxLength: [25, 'Cant be overcome 25 characters']
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number required'],
        unique: true
    },
    keeperExistProductRecord: [{
        type: Schema.Types.ObjectId,
        ref: 'ExitHistory',
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
    }
);

export default model('Client', ClientSchema);