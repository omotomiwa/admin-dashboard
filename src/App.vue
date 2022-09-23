<template>
  <v-app>
    <Home />
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
import Home from "./components/Home.vue";

export default {
  name: "App",

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;700&display=swap");
* {
  font-family: "Inter", sans-serif;
}
</style>
