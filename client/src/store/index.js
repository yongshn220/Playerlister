import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    RELOAD_STORE: "RELOAD_STORE",
    PUBLISH_LIST: "PUBLISH_LIST",
    SHOW_HOME: "SHOW_HOME",
    SHOW_ALL_USER: "SHOW_ALL_USER",
    SHOW_USER: "SHOW_USER",
    LOAD_PUBLISHED_PAIRS: "LOAD_PUBLISHED_PAIRS",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ERROR : "ERROR",
    PUBLISH_LIST : "PUBLISH_LIST",
}

const CurrentHomeState = {
    HOME : "HOME",
    ALL_USER : "ALL_USER",
    USER : "USER",
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        publishedPairs: [],
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentHomeState: CurrentHomeState.HOME,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type);
        console.log(store.currentHomeState);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                })
            }
            case GlobalStoreActionType.LOAD_PUBLISHED_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: payload,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: payload.pairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: payload.state,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentHomeState: store.currentHomeState,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentHomeState: store.currentHomeState,
                });
            }
            case GlobalStoreActionType.RELOAD_STORE: {
                return setStore({
                    currentModal : store.currentModal,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentHomeState: store.currentHomeState,
                })
            }
            case GlobalStoreActionType.PUBLISH_LIST: {
                return setStore({
                    currentModal : CurrentModal.PUBLISH_LIST,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentHomeState: store.currentHomeState,
                })
            }

            case GlobalStoreActionType.SHOW_HOME: {
                return setStore({
                    currentModal : store.currentModal,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentHomeState: CurrentHomeState.HOME,
                })
            }

            case GlobalStoreActionType.SHOW_ALL_USER: {
                console.log("SHOW ALL USER IN");
                return setStore({
                    currentModal : store.currentModal,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentHomeState: CurrentHomeState.ALL_USER,
                })

            }

            case GlobalStoreActionType.SHOW_USER: {
                return setStore({
                    currentModal : store.currentModal,
                    publishedPairs: store.publishedPairs,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentHomeState: CurrentHomeState.USER,
                })
            }
            default:
                return store;
        }
    }
    //

    store.reloadStore = function() {
        storeReducer({
            type: GlobalStoreActionType.RELOAD_STORE,
            paload: null
        })
    }

    store.isCurrentListNull = function() {
        return (store.currentList == null)
    }

    store.getCurrentListSongs = function() {
        if (store.currentList != null) {
            return store.currentList.songs;
        }
        return [];
    }
    store.hasSongsInCurrentList = function() {
        if (store.currentList != null) {
            return store.currentList.songs.length > 0;
        }
        return false;
    }

    store.showPublishListModal = function() {
        storeReducer({
            type: GlobalStoreActionType.PUBLISH_LIST,
            payload: null
        })
    }

    store.publishList = function() {
        if (store.currentList)
        {
            let list = store.currentList;
            list.published = true;
            let today = new Date();
            list.publishedDate = today.toLocaleDateString("en-US");
        }
        store.updateCurrentList(store.showHomeView);
    }

    store.showHomeView = function() {
        store.loadIdNamePairs();
        storeReducer({
            type: GlobalStoreActionType.SHOW_HOME,
            payload: null
        })
    }

    store.showAllUserView = function() {
        store.loadPublishedPairs(CurrentHomeState.ALL_USER);
        storeReducer({
            type: GlobalStoreActionType.SHOW_ALL_USER,
            payload: null
        })
    }

    store.showUserView = function() {
        storeReducer({
            type: GlobalStoreActionType.SHOW_USER,
            payload: null
        })
    }

    store.searchPublishedPlaylist = function(inputString) {
        console.log("IN0");
        console.log(store.currentHomeState);
        if (store.currentHomeState == CurrentHomeState.ALL_USER) {
            console.log("IN");
            store.loadPublishedPairsByTitle(inputString);
        }
        if (store.currentHomeState == CurrentHomeState.USER) {
            store.loadPublishedPairsByOwnerName(inputString);
        }
    }
    
    store.addCommentOnPlaylist = function(writer, content) {
        async function asyncAddCommentOnPlayer() {
            let comment = {name: writer, content: content}
            store.currentList.comments.push(comment);
            let response = await api.addCommentOnList(store.currentList._id, comment)
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList,
                });
            }
        }
        asyncAddCommentOnPlayer();
    }

    store.sortPlaylists = function(sortType) {
        if (sortType == "alphabetical") {
            store.idNamePairs.sort((a, b) => a.name.localeCompare(b.name))
        }
        else if (sortType == "publishDate") {
            store.idNamePairs.sort((a, b) => {
                if (a.published && b.published) {
                    return Date.parse(b.publishedDate) - Date.parse(a.publishedDate)
                }
                if (a.published) {
                    return -1
                } 
                else return 1
            })
        }
        else if (sortType == "listens") {
            store.idNamePairs.sort((a, b) => b.listens - a.listens)
        }
        else if (sortType == "likes") {
            store.idNamePairs.sort((a, b) => b.likes - a.likes)
        }
        else if (sortType == "dislikes") {
            store.idNamePairs.sort((a,b) => b.dislikes - a.dislikes)
        }
        else {
            console.log("wrong type");
        }
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList,
        });
    }

    store.addLikeToList = function(id) {

        let ind = -1
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (store.idNamePairs[i]._id == id) {
                ind = i;
                store.idNamePairs[i].likes += 1;
                break;
            }
        }
        if (ind != -1) {
            store.updateList(id, store.idNamePairs[ind]);
        }
    }

    store.addDislikeToList = function(id) {
        let ind = -1
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (store.idNamePairs[i]._id == id) {
                ind = i;
                store.idNamePairs[i].dislikes += 1;
                break;
            }
        }
        if (ind != -1) {
            store.updateList(id, store.idNamePairs[ind]);
        }
    }
    store.increaseListenList = function(id) {
        let ind = -1
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (store.idNamePairs[i]._id == id) {
                ind = i;
                store.idNamePairs[i].listens += 1;
                break;
            }
        }
        async function asyncUpdateListNoReload() {
            if (ind != -1) {
                const response = await api.updatePlaylistById(id, store.idNamePairs[ind]);
            }
        }
        asyncUpdateListNoReload();
    }

    store.updateList = function(id, list) {
        async function asyncUpdateList() {
            const response = await api.updatePlaylistById(id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
            else {
                console.log("fail");
            }
        }
        asyncUpdateList();
    }

    store.duplicateList = function(list) {
        async function asyncDuplicateList(){
            const response = await api.createPlaylist(list.name, list.songs, auth.user.firstName, auth.user.lastName, auth.user.email);
            if (response.status === 201) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                store.loadIdNamePairs();
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        }
        asyncDuplicateList();
    } 
    
    //

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.setCurrentList(id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        // history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.firstName, auth.user.lastName, auth.user.email);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            store.loadIdNamePairs();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {pairs: pairsArray, state: CurrentHomeState.HOME}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.loadPublishedPairs = function () {
        async function asyncLoadPublishedPairs() {
            const response = await api.getPublishedPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {pairs: pairsArray, state: CurrentHomeState.ALL_USER}
                });
            }
        }
        asyncLoadPublishedPairs();
    }

    store.loadPublishedPairsByTitle = function (title) {
        async function aysncLoadPublishedPairsByTitle() {
            const response = await api.getPublishedplaylistPairsByTitle(title);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {pairs: pairsArray, state: CurrentHomeState.ALL_USER}
                });
            }
        }
        aysncLoadPublishedPairsByTitle();
    }

    store.loadPublishedPairsByOwnerName = function (name) {
        console.log("(1)");
        console.log(name);
        async function aysncLoadPublishedPairsByOwnerName() {
            const response = await api.getPublishedPairsByOwnerName(name);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {pairs: pairsArray, state: CurrentHomeState.USER}
                });
            }
        } 
        aysncLoadPublishedPairsByOwnerName();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist);
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.loadIdNamePairs();
            console.log(response);
            if (response.data.success) {
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        console.log("showeditsong");
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }
    store.isPublishListModalOpen = () => {
        return store.currentModal === CurrentModal.PUBLISH_LIST;
    }
    store.isScreenHomeView = () => {
        return store.currentHomeState === CurrentHomeState.HOME; 
    }
    store.isScreenAllUserView = () => {
        return store.currentHomeState === CurrentHomeState.ALL_USER;
    }
    store.isScreenUserView = () => {
        return store.currentHomeState === CurrentHomeState.USER;
    }


    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function(callback) {
        async function asyncUpdateCurrentList() {
            console.log(store.currentList);
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                if (callback) {
                    callback();
                }
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };