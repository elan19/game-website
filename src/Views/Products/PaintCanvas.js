import React, { useRef, useState, useEffect } from 'react';
import styles from './PaintCanvas.module.css';

const PaintCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#15152F"; // Set the default color
        setContext(ctx);
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e); // Start drawing immediately when clicking
    };

    const endDrawing = () => {
        setIsDrawing(false);
        context.beginPath(); // Reset the path to stop connecting lines
    };

    const draw = (e) => {
        if (!isDrawing) return;

        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    return (
        <canvas
            ref={canvasRef}
            className={styles.paintCanvas}
            width={400}
            height={150}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            onMouseLeave={endDrawing} // Stop drawing if cursor leaves the canvas
        />
    );
};

export default PaintCanvas;
