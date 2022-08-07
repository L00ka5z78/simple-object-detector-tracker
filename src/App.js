// Dependencies

import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";


// Import req

import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";


// Drawing utility


import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function

  const runCoco = async () => {

    //  Loading network 

    const net = await cocossd.load();

    //  Loop and detect hands

    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {

    // Checking if data is available.

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      // Getting Video Properties

      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Setting video width

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Setting canvas height and width

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //  Making Detections and see detections in console if needed

      const obj = await net.detect(video);
      console.log(obj);


      // Drawing mesh

      const ctx = canvasRef.current.getContext("2d");

      //  Drawing utility function

      drawRect(obj, ctx)
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
