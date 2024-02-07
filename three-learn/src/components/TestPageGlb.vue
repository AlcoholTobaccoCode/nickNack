<template>
  <div class="scene" id="scene"></div>
</template>

<script setup>
import Base3d from "../utils/Base3d.js";
import { reactive, onMounted } from "vue";
const data = reactive({
  base3d: {},
});
onMounted(() => {
  data.base3d = new Base3d("#scene");
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
