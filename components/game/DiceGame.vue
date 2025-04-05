<template>
  <div>
    <div ref="diceContainer" class="canvas-wrapper" @click="rollDice"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cube: null,
      scene: null,
      camera: null,
      renderer: null,
      THREE: null,
    };
  },
  mounted() {
    this.initGame();
  },
  methods: {
    async initGame() {
      // Dynamically import three.js and cache in session
      if (!window.THREE) {
        const module = await import("three");
        this.THREE = module;
        window.THREE = module;
        sessionStorage.setItem("threeLoaded", "true");
      } else {
        this.THREE = window.THREE;
      }

      const {
        Scene,
        PerspectiveCamera,
        WebGLRenderer,
        BoxGeometry,
        Mesh,
        CanvasTexture,
        MeshBasicMaterial,
      } = this.THREE;

      this.scene = new Scene();
      this.scene.background = new this.THREE.Color(0xffffff); // 👈 white background

      this.camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.diceContainer.appendChild(this.renderer.domElement);

      // Create numbered materials
      const createTextMaterial = (text) => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#1C1C1C";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 200px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new CanvasTexture(canvas);
        return new MeshBasicMaterial({ map: texture });
      };

      const materials = [
        createTextMaterial("1"),
        createTextMaterial("2"),
        createTextMaterial("3"),
        createTextMaterial("4"),
        createTextMaterial("5"),
        createTextMaterial("6"),
      ];

      const geometry = new BoxGeometry();
      this.cube = new Mesh(geometry, materials);
      this.scene.add(this.cube);

      this.camera.position.z = 3;
      this.renderer.render(this.scene, this.camera);
    },

    rollDice() {
      const target = {
        x: Math.PI * 2 * Math.random(),
        y: Math.PI * 2 * Math.random(),
      };

      const start = {
        x: this.cube.rotation.x,
        y: this.cube.rotation.y,
      };

      const duration = 500;
      const startTime = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);

        this.cube.rotation.x = start.x + (target.x - start.x) * progress;
        this.cube.rotation.y = start.y + (target.y - start.y) * progress;

        this.renderer.render(this.scene, this.camera);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // After animation is complete, check the rolled number
          this.checkRollResult();
        }
      };

      requestAnimationFrame(animate);
    },

    checkRollResult() {
      // Get the rolled number (this is just a rough example)
      // In reality, you would use your 3D object's final state
      const rolledNumber = Math.floor(Math.random() * 6) + 1; // This is for testing; replace with actual dice result

      console.log("Rolled number:", rolledNumber);

      // Check if the rolled number is 6
      if (rolledNumber === 6) {
        // Call your API when the result is a six
        // this.$axios
        //   .post("/api/log-six", { userId: this.userId })
        //   .then(() => console.log("Six rolled! API called."))
        //   .catch((err) => console.error("API call failed:", err));
      }
    },
  },
};
</script>
