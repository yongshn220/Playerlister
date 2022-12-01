import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import YouTube from 'react-youtube';
import Button from '@mui/material/Button';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    function handleHomeClick()
    {
        console.log("Home")
    }
    function handleAllClick()
    {
        console.log("All")
    }
    function handleUserClick()
    {
        console.log("user")
    }
    function handleOnSearch()
    {
        console.log("Search");
    }
    let listCard = "";
    if (store) {
        if (store.currentList != null)
        {
            store.idNamePairs.forEach((pair) => {
                if (pair._id == store.currentList._id)
                {
                    pair.selected = true;
                }
                else 
                {
                    pair.selected = false;
                }
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
                    />
                ))
                
            }
            </List>;
    }

    let playlist = [
        "mqmxkGjow1A",
        "8RbXIMZmVv8",
        "8UbNbor3OqQ"
    ];

    let currentSong = 0;

    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

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

    }

    function onCommentsClick() {

    }

    let youtubeElement = 
        <YouTube
            id = "youtube-player"
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange} />;

    let commentsElement = 
        <div id="list-comments">
        </div>
    let contentElement = youtubeElement;


    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <div id="list-selector-heading-left">
                    
                    <div id="lshl-home" onClick={handleHomeClick}>
                    </div>
                    <div id="lshl-all" onClick={handleAllClick}>
                    </div>
                    <div id="lshl-user" onClick={handleUserClick}>
                    </div>
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
                    <Button disabled={false} id='Player' onClick={onPlayerClick} variant="contained">
                        Player
                    </Button>
                    <Button disabled={false} id='Comments' onClick={onCommentsClick} variant="contained">
                        Comments
                    </Button>
                    
                    {contentElement}
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

        </div>)
}

export default HomeScreen;

