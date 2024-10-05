import React from 'react';

import styles from './Profile.module.css';

import EditProfile from '../../Components/Profile/edit-profile';

class EditProfileView extends React.Component {
    render() {
        return (
            <div>
                <main className={styles.main}>
                    <EditProfile/>
                </main>
            </div>
        );
    }
}

export default EditProfileView;