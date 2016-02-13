"use strict";

import * as mongoose from 'mongoose';
import {PriceCategories} from "./PriceCategories";

var placeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        location: {type: [Number], index: '2dsphere', required: true},
        type: {type: String, required: true},
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

//utilized in the similar place search and for retrieving by type
placeSchema.index({type: 1, priceCategory: 1, userLikedCount: -1});

//utilized in the most liked places
placeSchema.index({userLikedCount: -1});


export interface IPlace extends mongoose.Document {
    name: string;
    location: number[];
    type: string;
    description?: string;
    workTimeInterval?:{start: number, end: number},
    rating?: number,
    priceCategory?: PriceCategories,
    userLikedCount: number,
    seatsCapacity?: number;
    isLikedByUser: boolean;
}

let Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;

