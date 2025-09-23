import mongoose from 'mongoose';

const accountSchema = mongoose.Schema(
    {
        username : {type : String, required : true, unique : true},
        email : {type : String, required : true, unique : true},
        firstName : {type : String, required : true},
        lastName : {type : String, required : true},
        uuid : {type : String, required : true, unique : true, default: () => crypto.randomUUID()},
        passwordHash : {type : String, required : true}

    },
    {
        collection: 'accounts',
        strict: 'throw',
        timestamps: true
    }
);

const Account = mongoose.model('Account', accountSchema);

export { Account };
