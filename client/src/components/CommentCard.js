import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { writer, content } = props;

    let comment = `[${writer}] : ${content}`
    return (
        <div className="comment-card">
            {comment}
        </div>
    );
}

export default CommentCard;