"use strict";

import * as mongoose from 'mongoose';
import {Schema} from "mongoose";


var userSchema = new mongoose.Schema(
    {
        email: Schema.Types.String,
        password: Schema.Types.String,
        places: {
            type: [Schema.Types.ObjectId],
            ref: 'Place'
        }
    });
userSchema.index({email: 1, password: 1});

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    places: string[];
}

let User = mongoose.model<IUser>("User", userSchema);

export default User;

