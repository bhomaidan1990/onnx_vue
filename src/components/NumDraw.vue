<template>
  <div class="card elevation">
    <canvas
      class="canvas elevation"
      id="canvas"
      width="280"
      height="280"
    ></canvas>

    <div class="button" id="clear-button">CLEAR</div>

    <div class="predictions">
      <PredCol :col_num="0" />
      <PredCol :col_num="1" />
      <PredCol :col_num="2" />
      <PredCol :col_num="3" />
      <PredCol :col_num="4" />
      <PredCol :col_num="5" />
      <PredCol :col_num="6" />
      <PredCol :col_num="7" />
      <PredCol :col_num="8" />
      <PredCol :col_num="9" />
    </div>
  </div>
</template>

<script>
import * as ort from "onnxruntime-web";
import PredCol from "./PredCol.vue";

export default {
  name: "NumDraw",
  data(){
    return{
      isMouseDown: false,
      hasIntroText: true,
      lastX: 0,
      lastY: 0,
      CANVAS_SIZE: 280,
      CANVAS_SCALE: 0.5,
      ctx: null,
    };
  },
  components: {
    PredCol,
  },

  mounted(){
    this.init();
  },

  methods: {
    init() {
      const canvas = document.getElementById("canvas");
      this.ctx = canvas.getContext("2d");

      const clearButton = document.getElementById("clear-button");

      // Load our model.
      const sess = ort.InferenceSession;
      const sessionOption = {executionProviders: [{name: 'webgl', deviceId: 0}]};
      const loadingModelPromise = sess.create("./models/mnist.onnx", sessionOption);

      // Add 'Draw a number here!' to the canvas.
      this.ctx.lineWidth = 28;
      this.ctx.lineJoin = "round";
      this.ctx.font = "28px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillStyle = "#212121";
      // this.ctx.fillText("Draw a number here!", this.CANVAS_SIZE / 2, this.CANVAS_SIZE / 2);
      this.ctx.fillText("Loading...", this.CANVAS_SIZE / 2, this.CANVAS_SIZE / 2);

      // Set the line color for the canvas.
      this.ctx.strokeStyle = "#212121";

      loadingModelPromise.then(() => {
        canvas.addEventListener("mousedown", this.canvasMouseDown);
        canvas.addEventListener("mousemove", this.canvasMouseMove);
        document.body.addEventListener("mouseup", this.bodyMouseUp);
        document.body.addEventListener("mouseout", this.bodyMouseOut);
        clearButton.addEventListener("mousedown", this.clearCanvas);

        this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
        this.ctx.fillText("Draw a number here!", this.CANVAS_SIZE / 2, this.CANVAS_SIZE / 2);
      });
    },
    
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
      for (let i = 0; i < 10; i++) {
        const element = document.getElementById(`prediction-${i}`);
        element.className = "prediction-col";
        element.children[0].children[0].style.height = "0";
      }
    },

    drawLine(fromX, fromY, toX, toY) {
      // Draws a line from (fromX, fromY) to (toX, toY).
      this.ctx.beginPath();
      this.ctx.moveTo(fromX, fromY);
      this.ctx.lineTo(toX, toY);
      this.ctx.closePath();
      this.ctx.stroke();
      this.updatePredictions();
    },

    async updatePredictions() {
      // Get the predictions for the canvas data.
      const imgData = this.ctx.getImageData(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
      let img_arr= new Float32Array(imgData.data); //560 x 560 = 313600
      const dims = [1, 1, 280, 280];
      console.log("Image", img_arr)
      const input = new ort.Tensor(img_arr, "float32", dims);

      const outputMap = await sess.run([input]);
      const outputTensor = outputMap.values().next().value;
      const predictions = outputTensor.data;
      const maxPrediction = Math.max(...predictions);

      for (let i = 0; i < predictions.length; i++) {
        const element = document.getElementById(`prediction-${i}`);
        element.children[0].children[0].style.height = `${
          predictions[i] * 100
        }%`;
        element.className =
          predictions[i] === maxPrediction
            ? "prediction-col top-prediction"
            : "prediction-col";
      }
    },

    canvasMouseDown(event) {
      this.isMouseDown = true;
      if (this.hasIntroText) {
        this.clearCanvas();
        this.hasIntroText = false;
      }
      const x = event.offsetX / this.CANVAS_SCALE;
      const y = event.offsetY / this.CANVAS_SCALE;

      // To draw a dot on the mouse down event, we set laxtX and lastY to be
      // slightly offset from x and y, and then we call `canvasMouseMove(event)`,
      // which draws a line from (laxtX, lastY) to (x, y) that shows up as a
      // dot because the difference between those points is so small. However,
      // if the points were the same, nothing would be drawn, which is why the
      // 0.001 offset is added.
      this.lastX = x + 0.001;
      this.lastY = y + 0.001;
      this.canvasMouseMove(event);
    },

    canvasMouseMove(event) {
      const x = event.offsetX / this.CANVAS_SCALE;
      const y = event.offsetY / this.CANVAS_SCALE;
      if (this.isMouseDown) {
        this.drawLine(this.lastX, this.lastY, x, y);
      }
      this.lastX = x;
      this.lastY = y;
    },

    bodyMouseUp() {
      this.isMouseDown = false;
    },

    bodyMouseOut(event) {
      // We won't be able to detect a MouseUp event if the mouse has moved
      // ouside the window, so when the mouse leaves the window, we set
      // `isMouseDown` to false automatically. This prevents lines from
      // continuing to be drawn when the mouse returns to the canvas after
      // having been released outside the window.
      if (!event.relatedTarget || event.relatedTarget.nodeName === "HTML") {
        this.isMouseDown = false;
      }
    },
  },
};
</script>

<style>
@import "../style/css/NumDraw.css";
</style>
