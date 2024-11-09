import React, { useState, useEffect } from 'react';
import { listOfFiles, UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';
import { useNavigate } from 'react-router-dom';
import SingleGemenskap from './single-gemenskap'; 
import styles from './GemenskapList.module.css';

const GemenskapList = () => {
    const [gemenskaps, setGemenskaps] = useState([]);
    const navigate = useNavigate();
    const uploadKey = process.env.REACT_APP_UPLOADKEY;
    const secretUploadKey = process.env.REACT_APP_SECRETUPLOADKEY;

    useEffect(() => {
        const fetchFiles = async () => {
            const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
                publicKey: uploadKey,
                secretKey: secretUploadKey,
            });

            try {
                const result = await listOfFiles({}, { authSchema: uploadcareSimpleAuthSchema });
                setGemenskaps(result.results);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, [uploadKey, secretUploadKey]);

    const handleButtonClick = () => {
        navigate('/community/camera');
    };

    return (
        <div>
            <h2 className={styles.gemenskapH2}>Community</h2>
            <button className={styles.picBtn} onClick={handleButtonClick}>
                Add picture
            </button>
            <div className={styles.SingleGemenskap}>
                {gemenskaps.map((gemenskap) => (
                    <SingleGemenskap key={gemenskap.uuid} gemenskap={gemenskap} />
                ))}
            </div>
        </div>
    );
};

export default GemenskapList;
