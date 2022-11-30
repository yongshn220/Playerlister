import { useContext } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/



function Statusbar() {

    function clickHandler() {
        store.tryAcessingOtherAccountPlaylist();
    }

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("logged in: " +  auth.loggedIn);
    let text ="";
    if (auth.loggedIn && store.currentList){
        text = store.currentList.name;
    return (
        <div id="playlister-statusbar">
            {text}
        </div>
    );
    }
    return null;
}
/*<input type="button" 
onClick={clickHandler} 
value='clickyclicky' />*/

export default Statusbar;