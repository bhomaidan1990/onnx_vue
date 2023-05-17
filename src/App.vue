<template>
    <div id="main">
      
      <div id="navbar">
        <NavBar/>
      </div>

      <div id="numdraw">
        <NumDraw/>
      </div>
    </div>
</template>
  
  <script>
  import { store } from "./js/store.js";
  import NavBar from "./components/NavigationBar.vue";
  import NumDraw from "./components/NumDraw.vue";

  export default{
    name: "App",
    components: {
      NavBar,
      NumDraw,
    },
  };
  </script>
  
  <style>
  @import "./style/css/App.css";
  </style>
  