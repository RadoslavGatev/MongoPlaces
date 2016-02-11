import * as mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    name: string;
    password: string;
    places: string[];
}
declare let User: mongoose.Model<IUser>;
export default User;
