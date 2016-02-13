"use strict";

import * as mongoose from 'mongoose';
import {PriceCategories} from "./PriceCategories";

var placeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        location: {type: [Number], index: '2dsphere', required: true},
        type: {type: Number, required: true},
        description: {type: String},
        workTimeInterval: {
            start: Number,
            end: Number
        },
        rating: {type: Number},
        priceCategory: {type: Number},
        userLikedCount: {type: Number, default: 0},
        seatsCapacity: Number
    });
placeSchema.index({type: 1, rating: 1, userLikedCount: 1});

export interface IPlace extends mongoose.Document {
    name: string;
    location: number[];
    type: string;
    description: String;
    workTimeInterval:{start: number, end: number},
    rating: number,
    priceCategory: PriceCategories,
    userLikedCount: number,
    seatsCapacity: number;
}

let Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;

