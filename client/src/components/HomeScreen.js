import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUIPublishListModal from './MUIPublishListModal'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import YouTube from 'react-youtube';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SwitchAccountRoundedIcon from '@mui/icons-material/SwitchAccountRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

// EVENT HANDLER ---------------------------------------------------------
    function handleCreateNewList() {
        store.createNewList();
    }
    function handleHomeClick()
    {
        store.showHomeView();
    }
    function handleAllClick()
    {
        store.showAllUserView();
    }
    function handleUserClick()
    {
        store.showUserView();
    }
    function handleOnSearch()
    {
        console.log("Search");
    }
    
// LISTCARD SETTING-------------------------------------------------------

    let listCard = "";
    if (store) {
        if (store.currentList != null)
        {
            store.idNamePairs.forEach((pair) => {
                if (pair._id == store.currentList._id) pair.selected = true;
                else pair.selected = false;
            })
        }

        listCard = 
            <List sx={{width: '100%', mb:"20px" }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={pair.selected}
                        published={pair.published}
                    />
                ))
            }
            </List>;
    }

// YOUTUBE PLAYER AND COMMENT --------------------------------------------
    let playlist = [];

    let currentSong = 0;

    let youtubeElement = <div></div>
    let commentsElement = <div></div>
    
    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    if (store.hasSongsInCurrentList())
    {
        let songs = store.getCurrentListSongs();

        console.log(songs);
        playlist = songs.map((song) => (song.youTubeId))

        console.log(playlist);
        youtubeElement = 
            <YouTube
                id = "youtube-player"
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange} />;

        commentsElement = 
            <div id="list-comments" className="disabled">
            </div>
    }

    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    function onPlayerClick() {
        document.getElementById("youtube-player").classList.remove("disabled");
        document.getElementById("list-comments").classList.add("disabled");
    }
    function onCommentsClick() {
        document.getElementById("youtube-player").classList.add("disabled");
        document.getElementById("list-comments").classList.remove("disabled");
    }

// MODAL --------------------------------------------------------
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isPublishListModalOpen()) {
        modalJSX = <MUIPublishListModal />;
    }

// RETURN --------------------------------------------------------
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <div id="list-selector-heading-left">
                    <Box sx={{ p: 1}}>
                        <IconButton  onClick={handleHomeClick} aria-label='edit'>
                            <HomeRoundedIcon style={{fontSize:'25pt'}} />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 1}}>
                        <IconButton  onClick={handleAllClick} aria-label='edit'>
                            <SwitchAccountRoundedIcon style={{fontSize:'25pt'}} />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 1}}>
                        <IconButton  onClick={handleUserClick} aria-label='edit'>
                            <PersonRoundedIcon style={{fontSize:'25pt'}} />
                        </IconButton>
                    </Box>
                </div>
                <div id="list-selector-heading-center">  
                    <input placeholder="Search..."></input>
                    <button onClick={handleOnSearch}>Search</button>
                </div>
                <div id="list-selector-heading-right">
                    test2
                </div>
            </div>
            
            <Box id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>

            <div id="list-content-box">
                <div>
                    <Button disabled={store.isCurrentListNull()} id='list-player-button' onClick={onPlayerClick} variant="contained">
                        Player
                    </Button>
                    <Button disabled={store.isCurrentListNull()} id='list-comments-button' onClick={onCommentsClick} variant="contained">
                        Comments
                    </Button>
                    
                    {youtubeElement}
                    {commentsElement}
                </div>
            </div>

            <Fab sx={{transform:"translate(-20%, 0%)"}}
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <AddIcon />
            </Fab>
            { modalJSX }
        </div>)
}

export default HomeScreen;

