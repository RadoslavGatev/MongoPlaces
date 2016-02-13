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
            res.sendStatus(500);
        }
        Place.find({_id: {$in: user.places}}, (error, places)=> {
            if (error) {
                res.send(500);
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
    let place = new Place();
    place.name = req.body["name"];
    place.type = req.body["type"];
    place.description = req.body["description"];
    place.location = req.body["location[]"];
    place.priceCategory = req.body["priceCategory"];
    place.workTimeInterval = {
        start: req.body["workTimeInterval.start"],
        end: req.body["workTimeInterval.end"]
    };
    place.rating = req.body["rating"];
    place.seatsCapacity = req.body["seatsCapacity"];

    place.save((err)=> {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.json({success: true});
        }
    });
}

function likePlace(req:express.Request, res:express.Response) {
    let placeId = req.body["placeId"] || req.query.placeId;
    let userId = req.session["userId"];

    User.findOne({_id: userId, "places": {$ne: placeId}}, (err, user)=> {
        if (err) {
            res.sendStatus(500);
            return;
        }

        if (user != null) {
            user.places.push(placeId);
            user.save((err)=> {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

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


    //use because findAndModify we cannot deduce that a place has been added to the array
    User.findOne({_id: userId, "places": {$eq: placeId}}, (err, user)=> {
        if (err) {
            res.sendStatus(500);
            return;
        }

        if (user != null) {
            var index = user.places.indexOf(placeId);
            if (index > -1) {
                user.places.splice(index, 1);
                user.save((err)=> {
                    if (err) {
                        res.sendStatus(500);
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
                res.sendStatus(500);
                return;
            }

            res.render("showAllPlaces", {places: places});
        }
    );
}

function showByType(req:express.Request, res:express.Response) {
    let type = req.query.type;
    Place.find({type: type}, {location: true}, (error, places)=> {
            if (error) {
                res.sendStatus(500);
                return;
            }

            res.render("showAllPlaces", {places: places});
        }
    );
}

function showNearestNeighbours(req:express.Request, res:express.Response) {
    let placeId = req.query.placeId;

    Place.findById(placeId, (error, place)=> {
            if (error) {
                res.sendStatus(500);
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
                        res.sendStatus(500);
                        return;
                    }
                    res.render("showAllPlaces", {places: places});
                });
            }
            else {
                res.sendStatus(404);
            }
        }
    );
}

function showSimiliar(req:express.Request, res:express.Response) {
    let placeId = req.query.placeId;
    Place.findById(placeId, (error, place)=> {
            if (error) {
                res.sendStatus(500);
                return;
            }

            if (place != null) {
                var similiarQuery = Place.find({type: place.type, priceCategory: place.priceCategory}, {location: true});

                similiarQuery.sort({userLikedCount: -1}).limit(10);
                similiarQuery.exec((error, places)=> {
                    if (error) {
                        res.sendStatus(500);
                        return;
                    }
                    
                    res.render("showAllPlaces", {places: places});
                });
            } else {
                res.sendStatus(404);
            }
        }
    )
    ;
}

function getInformationalWindow(req:express.Request, res:express.Response) {

    let placeId = req.query.placeId;
    let userId = req.session["userId"];

    Place.findById(placeId, (error, place)=> {
        if (error) {
            res.sendStatus(500);
            return;
        }

        User.find({
            _id: userId,
            places: {$eq: placeId}
        }, (error, user)=> {
            if (error) {
                res.sendStatus(500);
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


export {
    index,
    addGet,
    addPost,
    likePlace,
    unlikePlace,
    showAllPlaces,
    showByType,
    showNearestNeighbours,
    showSimiliar,
    getInformationalWindow
}

