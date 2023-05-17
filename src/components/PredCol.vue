<template>
  <div class="prediction-col" :id="`prediction-${col_num}`">
    <div class="prediction-bar-container">
      <div class="prediction-bar"></div>
    </div>
    <div class="prediction-number">
      {{ col_num }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PredCol",
  props: {
    col_num: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style>
@import "../style/css/PredCol.css";
</style>
