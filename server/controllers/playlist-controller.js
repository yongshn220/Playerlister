const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    
    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));
        
        
        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                console.log(list);
                console.log(list.published);
                if (user._id == req.userId || list.published) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}

getPublishedPlaylistPairs = async (req, res) => {
    console.log("get published plyaer list piars : ");
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    async function findPublishedListPairs(){
        await Playlist.find({published: true}, (err, playlists) => {
            if (err) {
                console.log("ERR: find published list pairs");
                return res.status(400).json({success: false, error: err});
            }
            if (!playlists) {
                console.log("ERR: no player list found")
                return res.status(404).json({success: false, error: "playlists not found"})
            }
            else {
                let pairs = [];
                for (let key in playlists) {
                    let list = playlists[key]
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerFirstName: list.ownerFirstName,
                        ownerLastName: list.ownerLastName,
                        published: list.published,
                        publishedDate: list.publishedDate,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        comments: list.comments
                    };
                    pairs.push(pair);
                }
                console.log(pairs);
                return res.status(200).json({ success: true, idNamePairs: pairs })
            }
        }).catch(err => console.log(err))
    }
    findPublishedListPairs();
}

getPublishedPlaylistPairsByTitle = async (req, res) => {
    console.log("get published plyaer list piars : ");
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    async function findPublishedListPairsByTitle(title){
        await Playlist.find({published: true, }, (err, playlists) => {
            if (err) {
                console.log("ERR: find published list pairs");
                return res.status(400).json({success: false, error: err});
            }
            if (!playlists) {
                console.log("ERR: no player list found")
                return res.status(404).json({success: false, error: "playlists not found"})
            }
            else {
                let pairs = [];
                let lists = playlists.filter((l) => (l.name.includes(title)))
                for (let key in lists) {
                    let list = lists[key]
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerFirstName: list.ownerFirstName,
                        ownerLastName: list.ownerLastName,
                        published: list.published,
                        publishedDate: list.publishedDate,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        comments: list.comments
                    };
                    pairs.push(pair);
                }
                console.log(pairs);
                return res.status(200).json({ success: true, idNamePairs: pairs })
            }
        }).catch(err => console.log(err))
    }
    findPublishedListPairsByTitle(req.params.title);
}

getPublishedPairsByOwnerName = async (req, res) => {
    console.log("getgetPublishedPairsByOwnerName");
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    async function findPublishedPairsByOwnerName(name){
        console.log("server (1)");
        await Playlist.find({published: true}, (err, playlists) => {
            if (err) {
                console.log("ERR: find published list pairs");
                return res.status(400).json({success: false, error: err});
            }
            if (!playlists) {
                console.log("ERR: no player list found")
                return res.status(404).json({success: false, error: "playlists not found"})
            }
            if (!name) {
                console.log("ERR: Name not provied")
                return res.status(404).json({success: false, error: "Name not provided"})
            }
            else {
                const splitName = name.split(" ");
                let pairs = [];
                let lists = playlists.filter((l) => (l.ownerFirstName == splitName[0]))
                if (splitName[1]){
                    lists = lists.filter((l) => (l.ownerLastName == splitName[1]))
                }
                for (let key in lists) {
                    let list = lists[key]
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        ownerFirstName: list.ownerFirstName,
                        ownerLastName: list.ownerLastName,
                        published: list.published,
                        publishedDate: list.publishedDate,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        comments: list.comments
                    };
                    pairs.push(pair);
                }
                console.log(pairs);
                return res.status(200).json({ success: true, idNamePairs: pairs })
            }
        }).catch(err => console.log(err))
    }
    findPublishedPairsByOwnerName(req.params.name);
}

getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            ownerFirstName: list.ownerFirstName,
                            ownerLastName: list.ownerLastName,
                            published: list.published,
                            publishedDate: list.publishedDate,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            comments: list.comments
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.published = body.playlist.published;
                    list.publishedDate = body.playlist.publishedDate;
                
                    list.comments = body.playlist.comments;

                    list.save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
addCommentOnList = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        console.log(req.body.comment);
        playlist.comments.push(req.body.comment);

        playlist.save()
        .then(() => {
            console.log("SUCCESS??!!!");
            return res.status(200).json({
                success: true,
                id: playlist._id,
                message: 'Playlist updated!',
            })
        })
        .catch(error => {
            console.log("FAILURE>>: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Playlist not updated!',
            })
        })      
    })
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPublishedPlaylistPairs,
    getPublishedPlaylistPairsByTitle,
    getPublishedPairsByOwnerName,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    addCommentOnList
}