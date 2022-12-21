//@ts-nocheck

import React, { useRef }  from 'react';

import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

import { Inter } from '@next/font/google'

import * as IMG from './scratch.png';

import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { collection, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEqmhpSBE2wYNa3AdUuNMPmT7pXi1Bg9g",
  authDomain: "slikker-scratch-card.firebaseapp.com",
  projectId: "slikker-scratch-card",
  storageBucket: "slikker-scratch-card.appspot.com",
  messagingSenderId: "463987856477",
  appId: "1:463987856477:web:106b4ef14b4abf678a69b4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const inter = Inter({ subsets: ['latin'] })

/*const Post = () => {
  const router = useRouter()
  const { id } = router.query;
  console.log(id)

  this.state = {
    isDrawing: false,
    startX: 0,
    startY: 0
  };
  this.canvasRef = React.createRef();


  const [data, setData] = useState<null | string>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    const docRef = doc(db, "cards", id as string ?? 'ff');
    getDoc(docRef).then(snap => {
      let data = snap.data();
      console.log(data)
      if (data) setData(data.left);
      setTimeout(() => setLoading(false));
    });
  }, [id])

  if (isLoading) return <p className={styles.status}>Loading...</p>
  if (!data) return <p className={styles.status}>No profile data</p>

  return <main className={styles.main}>
    <canvas
      ref={this.canvasRef}
      id="canvas"
      width={`100%`}
      height={`100%`}
    />
  </main>;
}*/


const HEIGHT = 480;
const WIDTH = 640;

class Post extends React.Component {
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      isDrawing: false,
      startX: 0,
      startY: 0
    };
    
    this.canvasRef = React.createRef();
  }

  componentDidMount = () => {
    const canvas = this.canvasRef.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener("mousedown", this.scratchStart);
    canvas.addEventListener("mousemove", this.scratch);
    canvas.addEventListener("mouseup", this.scratchEnd);

    canvas.addEventListener("touchstart", this.scratchStart);
    canvas.addEventListener("touchmove", this.scratch);
    canvas.addEventListener("touchend", this.scratchEnd);

    context.fillStyle = "#0B0B0D";
    context.fillRect(0, 0, this.canvasRef.current!.offsetWidth, this.canvasRef.current!.offsetHeight);
    context.lineWidth = 60;
    context.lineJoin = "round";

    const docRef = doc(db, "cards", '3cb5543f33dc5da33a5c778a');
    getDoc(docRef).then(snap => {
      let data = snap.data();
      console.log(data)
      if (data) this.setState({ data: data.left });
      setTimeout(() => this.setState({ loading: false }));
    });

  };

  scratchStart = (e: any) => {
    const { layerX, layerY } = e;

    this.setState({
      isDrawing: true,
      startX: layerX,
      startY: layerY
    });
  };

  scratch = (e: any) => {
    const { layerX, layerY } = e;
    const context = this.canvasRef.current!.getContext("2d");
  
    if (!this.state.isDrawing) {
      return;
    }

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.moveTo(this.state.startX, this.state.startY);
    context.lineTo(layerX, layerY);
    context.closePath();
    context.stroke();

    this.setState({
      startX: layerX,
      startY: layerY
    });
  };

  scratchEnd = e => {
    this.setState({
      isDrawing: false
    });
  };

  render() {  
    console.log(this.state)
    return (
      <div>
        <img className={styles.img} src={'./3cb5543f33dc5da33a5c778a.webp'}></img>
        <canvas
        className={styles.canvas}
          ref={this.canvasRef}
          id="canvas"
          width={`${WIDTH}px`}
          height={`${HEIGHT}px`}
        />
      </div>
    );
  }
}


export default Post
