"use strict";

import * as express from "express";
import User from "../models/User";
import Place from "../models/Place";
import {PriceCategories} from "../models/PriceCategories";
import {EnumExtenstion} from "../EnumExtension";


function index(req:express.Request, res:express.Response) {
    let userId = req.session["userId"];
    User.findById(userId, (error, user) => {
        if (error) {
            res.sendStatus(400);
        }
        Place.find({_id: {$in: user.places}}, (error, places)=> {
            if (error) {
                res.sendStatus(400);
            }

            res.render('index', {places: places});
        });
    });
}


function addGet(req:express.Request, res:express.Response) {
    let priceCategories = EnumExtenstion.getNamesAndValues(PriceCategories);
    res.render('add', {priceCategories: priceCategories});
}

function addPost(req:express.Request, res:express.Response) {
    let place = new Place(req.body);
    place.location = req.body["location[]"];

    place.save((err)=> {
        if (err) {
            res.sendStatus(400);
        }
        else {
            res.json({success: true});
        }
    });
}

function likePlace(req:express.Request, res:express.Response) {
    let placeId = req.body["placeId"] || req.query.placeId;
    let userId = req.session["userId"];

    //use because findAndModify we cannot deduce that a place has been added to the array
    User.findOne({_id: userId, "places": {$ne: placeId}}, (err, user)=> {
        if (err) {
            res.sendStatus(400);
            return;
        }

        if (user != null) {
            user.places.push(placeId);
            user.save((err)=> {
                if (err) {
                    res.sendStatus(400);
                    return;
                }

                //update Places.userLikedCount
                Place.findByIdAndUpdate(placeId, {$inc: {userLikedCount: +1}}, (err)=> {
                });
            });
        }

        res.sendStatus(200);
    });
}

function unlikePlace(req:express.Request, res:express.Response) {
    let placeId = req.body["placeId"] || req.query.placeId;
    let userId = req.session["userId"];

    //use because findAndModify we cannot deduce that a place has been removed from the array
    User.findOne({_id: userId, "places": {$eq: placeId}}, (err, user)=> {
        if (err) {
            res.sendStatus(400);
            return;
        }

        if (user != null) {
            var index = user.places.indexOf(placeId);
            if (index > -1) {
                user.places.splice(index, 1);
                user.save((err)=> {
                    if (err) {
                        res.sendStatus(400);
                        return;
                    }

                    Place.findByIdAndUpdate(placeId, {$inc: {userLikedCount: -1}}, (err)=> {
                    });
                });
            }

        }

        res.sendStatus(200);
    });
}


function showAllPlaces(req:express.Request, res:express.Response) {
    Place.find({}, {location: true}, (error, places)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            res.render("showAllPlaces", {places: places, heading: "All places"});
        }
    );
}

function showByType(req:express.Request, res:express.Response) {
    let type = req.query.type;
    Place.find({type: type}, {location: true}, (error, places)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            res.render("showAllPlaces", {places: places, heading: "All places of type " + type});
        }
    );
}

function showNearestNeighbours(req:express.Request, res:express.Response) {
    let placeId = req.query.placeId;

    Place.findById(placeId, (error, place)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            if (place != null) {
                var query = Place.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: place.location
                            }
                        }
                    }
                }, {location: true});

                query.limit(6);
                query.exec((error, places)=> {
                    if (error) {
                        res.sendStatus(400);
                        return;
                    }
                    res.render("showAllPlaces", {places: places, heading: "5 places near to " + place.name});
                });
            }
            else {
                res.sendStatus(404);
            }
        }
    );
}

function showSimilar(req:express.Request, res:express.Response) {
    let placeId = req.query.placeId;
    Place.findById(placeId, (error, place)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            if (place != null) {
                var similarQuery = Place.find({type: place.type, priceCategory: place.priceCategory}, {location: true});

                similarQuery.sort({userLikedCount: -1}).limit(10);
                similarQuery.exec((error, places)=> {
                    if (error) {
                        res.sendStatus(400);
                        return;
                    }

                    res.render("showAllPlaces", {places: places, heading: "Places similar to " + place.name});
                });
            } else {
                res.sendStatus(404);
            }
        }
    );
}

function getInformationalWindow(req:express.Request, res:express.Response) {
    let placeId = req.query.placeId;
    let userId = req.session["userId"];

    Place.findById(placeId, (error, place)=> {
        if (error) {
            res.sendStatus(400);
            return;
        }

        User.find({
            _id: userId,
            places: {$eq: placeId}
        }, (error, user)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            if (user.length != 0) {
                place.isLikedByUser = true;
            }
            else {
                place.isLikedByUser = false;
            }

            res.render("informationWindow", {layout: null, place: place});
        });
    });
}

function showMostLikedPlacesByType(req:express.Request, res:express.Response) {
    Place.aggregate([
        {
            $sort: {userLikedCount: -1}
        },
        {
            $group: {
                _id: "$type",
                places: {
                    $push: {_id: "$_id", name: "$name", userLikedCount: "$userLikedCount"}
                }
            }
        },
        {
            $sort: {
                "places.userLikedCount": -1
            }
        }
    ]).exec(
        (error, groups)=> {
            if (error) {
                res.sendStatus(400);
                return;
            }

            res.render("showMostLikedPlacesByType", {groups: groups});
        }
    );
}

export {
    index,
    addGet,
    addPost,
    likePlace,
    unlikePlace,
    showAllPlaces,
    showByType,
    showNearestNeighbours,
    showSimilar,
    getInformationalWindow,
    showMostLikedPlacesByType
}

