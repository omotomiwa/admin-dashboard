<template>
  <div class="home">
    <User />
    <Table></Table>
  </div>
</template>

<script>
//import User from "./components/User.vue";
import User from "./User.vue";
import Table from "./Table.vue";
export default {
  name: "Home-page",
  components: {
    User,
    Table,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
