<template>
  <div>
    <DiceGame />
  </div>
</template>

<script>
import DiceGame from "@/components/game/DiceGame.vue";

export default {
  auth: false,
  components: {
    DiceGame,
  },
};
</script>
