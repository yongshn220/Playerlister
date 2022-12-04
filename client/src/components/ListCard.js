import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import SongCard from './SongCard.js'
import EditToolbar from './EditToolbar'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, published } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            store.increaseListenList(id);
        }
    }
    
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }
    function handlePublish() {
        store.showPublishListModal();
    }
    function handleDuplicate() {
        store.duplicateList(idNamePair)
    }

    function loadSongs() {
        return store.currentList.songs.map((song, index) => (
            <SongCard
                id={'playlist-song-' + (index)}
                key={'playlist-song-' + (index)}
                index={index}
                song={song}
                published={published}
            />
        ))  
    }

    function onLikeClick(event) {
        event.stopPropagation();
        store.addLikeToList(idNamePair._id);
    }

    function onDislikeClick(event) {
        event.stopPropagation();
        store.addDislikeToList(idNamePair._id)
    }

// EDIT TOOLBAR
    let editToolbar = 
        <div id="edit-toolbar">
            <Button disabled={!store.canAddNewSong()} id='add-song-button' onClick={handleAddNewSong} variant="contained">
                <AddIcon />
            </Button>
            <Button disabled={!store.canUndo()} id='undo-button' onClick={handleUndo} variant="contained">
                <UndoIcon />
            </Button>
            <Button disabled={!store.canRedo()} id='redo-button' onClick={handleRedo} variant="contained">
                <RedoIcon />
            </Button>
            <Button disabled={!store.canClose()} id='close-button' onClick={handleClose} variant="contained">
                <ArrowDropUpIcon />
            </Button>
            <Button disabled={auth.guest} id='publish-button' onClick={handlePublish} variant="contained">
                Publish
            </Button>
            <Button disabled={auth.guest} id='duplicate-button' onClick={handleDuplicate} variant="contained">
                Duplicate
            </Button>
        </div>

    if (published) {
        editToolbar =
            <div id="edit-toolbar">
                        <Button disabled={!store.canClose()} id='close-button' onClick={handleClose} variant="contained">
                            <ArrowDropUpIcon />
                        </Button>
                        <Button disabled={auth.guest} id='duplicate-button' onClick={handleDuplicate} variant="contained">
                            Duplicate
                        </Button>
            </div>
    }

// LIST CARD BACKGROUND COLOR
    let listCardBGColor = '#8000F00F';
    if (published) {
        listCardBGColor = 'lightblue';
    }

// SELECT CLASS    
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

// CARD STATUS
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

// INFO BoX ELEMENT
    let infoBoxElement = 
        <Box sx={{p: 1, flexGrow: 1}}>
            <Box sx={{ p: 1, flexGrow: 1 }} >{idNamePair.name}</Box>
            <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize: 15}}>By: {idNamePair.ownerFirstName} {idNamePair.ownerLastName}</Box>
        </Box>

    if (published) {
        infoBoxElement = 
        <Box sx={{p: 1, flexGrow: 1}}>
            <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize: 20, fontWeight: 800}}>{idNamePair.name}</Box>
            <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize: 15}}>By: {idNamePair.ownerFirstName} {idNamePair.ownerLastName}</Box>
            <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize: 15, color: "blue"}}>Published: {idNamePair.publishedDate}</Box>
        </Box>
    }

    let editButtonElement = null
    let deleteButtonElement = null
    if (!published) {
        editButtonElement = 
            <Box sx={{ p: 1 }}>
                <IconButton disabled={auth.guest} onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'20pt'}} />
                </IconButton>
            </Box>
    }
    if (store.isScreenHomeView()) {
        deleteButtonElement = 
            <Box sx={{ p: 1 }}>
                <IconButton disabled={auth.guest} onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'20pt'}} />
                </IconButton>
            </Box>
    }


// LIKES and DISLIKES ELEMENTS
    let likeButtonAndCount = null

    let dislikeButtonAndCount = null

    if (published) {
        likeButtonAndCount = 
            <Box sx={{ p: 1}}>
                <IconButton disabled={auth.guest} onClick={onLikeClick} aria-label='edit'>
                    <ThumbUpAltRoundedIcon style={{fontSize:'20pt'}} />
                </IconButton>
                {idNamePair.likes}
            </Box>

        dislikeButtonAndCount = 
            <Box sx={{ p: 1}}>
                <IconButton disabled={auth.guest} onClick={onDislikeClick} aria-label='edit'>
                    <ThumbDownAltRoundedIcon style={{fontSize:'20pt'}} />
                </IconButton>
                {idNamePair.dislikes}
            </Box>
    }

    let listensElement = 
        <Box sx={{ p: 1}} style={{fontSize: '12pt'}}>
            listens: {idNamePair.listens}
        </Box>

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"10px", p: "10px", bgcolor: listCardBGColor, marginTop: '15px', display: 'flex', p: 1 }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '15pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >   
            {infoBoxElement}
            {listensElement}
            {likeButtonAndCount}
            {dislikeButtonAndCount}
            {editButtonElement}
            {deleteButtonElement}
        </ListItem>

    if (selected && store.currentList != null) {
        cardElement = 
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"10px", p: "10px", bgcolor: listCardBGColor, marginTop: '15px', display: 'flex',  p: 1 }}
            style={{maxHeight: 500, flexDirection: 'column', transform:"translate(1%,0%)", width: '98%', fontSize: '20pt' }}
            button
        >   
            <Box sx={{display: "flex", p: 1}} style={{flexDirection: 'row', width: '98%',}}>
                {infoBoxElement}
                {listensElement}
                {likeButtonAndCount}
                {dislikeButtonAndCount}
                {editButtonElement}
                {deleteButtonElement}
            </Box>

            <List 
                id="playlist-cards" 
                sx={{borderRadius: "10px", overflow: 'scroll', height: '87%', width: '100%'}}
            >
                {loadSongs()}
            </List> 
            {editToolbar}
        </ListItem>
    }
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }

    return (
        cardElement
    );
}

export default ListCard;