"use strict";

import * as mongoose from "mongoose";
import {Schema} from "mongoose";

let userSchema = new mongoose.Schema(
    {
        email: {type: Schema.Types.String, required: true},
        password: {type: Schema.Types.String, required: true},
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

