"use strict";

import * as mongoose from 'mongoose';
import {Schema} from "mongoose";


var userSchema = new mongoose.Schema(
    {
        name: Schema.Types.String,
        password: Schema.Types.String,
        places: [Schema.Types.ObjectId]
    });

export interface IUser extends mongoose.Document {
    name: string;
    password: string;
    places: string[];
}

let User = mongoose.model<IUser>("User", userSchema);

export default User;

