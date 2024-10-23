import React from 'react';

import styles from './Chat.module.css';

import ChatComp from '../../Components/Chat/chat';

class ChatView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <ChatComp />
                </main>
            </div>
        );
    }
}

export default ChatView;