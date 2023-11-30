<template>
  <input id="fileUplodBox" type="file" @change="changeFile"/>
  <img :src="file" alt="" style="width: 400px;height: 225px;">
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      file: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    changeFile(e) {
      const file = e.target.files[0];
      this.fileToBase64Async(file).then(res => {
        this.fillTextToImg(res).then(res1 => {
          this.file = res1
        })
      })
    },
    fileToBase64Async(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          resolve(e.target.result);
        };
      });
    },
    fillTextToImg(base64) {
      const img = new Image();
      img.src = base64;
      img.setAttribute("crossOrigin", "Anonymous");
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // const remFontSize = canvas.width / 35;
          const remFontSize = 50;
          console.log(remFontSize)
          ctx.font = "48px Microsoft YaHei";
          ctx.textAlign = "center";
          ctx.strokeStyle = "#fff";
          const uploadTime = new Date();
          const name = "浙江省环境科技";
          const spaceH = remFontSize * 0.3;
          ctx.fillText(
              name,
              canvas.width / 2,
              canvas.height - remFontSize - spaceH,
              canvas.width
          );
          resolve(canvas.toDataURL("image/jpeg"));
        };
      });
    }


  }
}
</script>

<style scoped>

</style>
