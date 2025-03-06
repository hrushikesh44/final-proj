import mongoose, { Schema, model } from "mongoose";

const url= process.env.MONGODB_URI ;

mongoose.connect(url)

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    type: { type: Boolean , required: false }
});

export const UserModel = model("User", UserSchema);

const AdminSchema = new Schema({
    username: {type: String, unique: true},
    password: String
});

const IdSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true}
});

export const AdminModel = model("Admin", AdminSchema);
export const IdModel = model("Id" , IdSchema);