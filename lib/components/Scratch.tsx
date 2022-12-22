//@ts-nocheck
import React, { useRef }  from 'react';

import styles from '/styles/Home.module.css'

export default class extends React.Component {
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
    return (
      <div>
        <img className={styles.img} src={'./3cb5543f33dc5da33a5c778a.webp'}></img>
        <canvas
        className={styles.canvas}
          ref={this.canvasRef}
          id="canvas"
        />
      </div>
    );
  }
}