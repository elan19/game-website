import React, { useState } from 'react';
import { UploadClient } from '@uploadcare/upload-client';
import styles from './Camera.module.css';

const CameraComponent = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // State for file preview

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file)); // Create a preview URL for the selected file
        }
    };

    const sendPicture = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        const client = new UploadClient({ publicKey: process.env.REACT_APP_UPLOADKEY });
        try {
            const fileInfo = await client.uploadFile(selectedFile);
            console.log('Uploaded file URL:', fileInfo.cdnUrl);
            window.location.hash = `gemenskap`; // Navigate back to the community page after uploading
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2Camera}>Upload a Photo</h2>
            <div className={styles.inputDiv}>
                {/* File upload input */}
                <div className={styles.chooseFileDiv}>
                    <input type="file" className={styles.cameraInput} id="fileInput" accept="image/*" onChange={handleFileChange} />
                    {selectedFile && (
                        <div>
                            <img src={filePreview} alt="File preview" className={styles.previewImage} />
                        </div>
                    )}
                    {selectedFile ? (
                        <button className={styles.cameraButton} onClick={sendPicture}>
                            Send photo
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CameraComponent;
