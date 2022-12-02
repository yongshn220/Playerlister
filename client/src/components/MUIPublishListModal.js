import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 345,
    height: 250,
    backgroundSize: "contain",
    backgroundColor: "white",
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
};

export default function MUIPublishListModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirm () {
        store.publishList();
    }

    function handleCancel () {
        store.hideModals();
    }
    
    let modalClass = "modal";
    if (store.isPublishListModalOpen()) {
        modalClass += " is-visible";
    }
    let listName = "";
    if (store.currentList) {
        listName = store.currentList.name;
    }

    return (
        <Modal
        open={store.currentModal === "PUBLISH_LIST"}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style1}>
            <Typography sx={{fontWeight: 'bold'}} id="modal-modal-title" variant="h4" component="h2">
                Publish Song
            </Typography>
            <Divider sx={{borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width:377}}/>
            <Box sx={{background: "rgb(172,79,198,0.05)"}}>
            <Typography id="modal-modal-description" variant="h6" sx={{color: "#301974" ,fontWeight: 'bold', mt: 1}}>
                Are you sure you want to publish the <Typography display="inline" id="modal-modal-description" variant="h6" sx={{color: "#820747CF" ,fontWeight: 'bold', mt: 2, textDecoration: 'underline'}}>{listName}</Typography> ?
            </Typography>
            </Box>
            <Button sx={{opacity: 0.7, color: "#8932CC", backgroundColor: "#CBC3E3", fontSize: 13, fontWeight: 'bold', border: 2, p:"5px", mt:"60px", mr:"95px"}} variant="outlined" onClick={handleConfirm}> Confirm </Button>
            <Button sx={{opacity: 0.50, color: "#8932CC", backgroundColor: "#CBC3E3", fontSize: 13, fontWeight: 'bold', border: 2, p:"5px", mt:"60px", ml:"102px"}} variant="outlined" onClick={handleCancel}> Cancel </Button>
        </Box>
    </Modal>
    );
}