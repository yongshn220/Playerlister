/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/publishedpairs', PlaylistController.getPublishedPlaylistPairs)
router.get('/publishedpairs/:title', PlaylistController.getPublishedPlaylistPairsByTitle)
router.get('/publishedpairs/name/:name',  PlaylistController.getPublishedPairsByOwnerName)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlist/comment/:id', auth.verify, PlaylistController.addCommentOnList)
module.exports = router