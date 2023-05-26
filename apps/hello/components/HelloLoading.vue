<template>
  <div
    v-if="loading"
    id="loading"
  >
    <div class="border">
      <div class="clip-wrap">
        <div class="clip clip-dark" />
      </div>
      <div
        id="year-1"
        class="year"
      >
        1
      </div>
      <div
        id="year-2"
        class="year"
      >
        9
      </div>
      <div
        id="year-3"
        class="year"
      >
        6
      </div>
      <div
        id="year-4"
        class="year"
      >
        8
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $anime } = useNuxtApp();

const loading = ref(true);

function start() {
    loading.value = true;
}

function finish() {
    loading.value = false;
}

onMounted(() => {
    // Start loading
    start();
    nextTick(() => {
        // Set start and end year
        const year = {
            display: 1968,
            end: new Date().getFullYear(),
        };

        // Get html
        const year1 = document.getElementById("year-1");
        const year2 = document.getElementById("year-2");
        const year3 = document.getElementById("year-3");
        const year4 = document.getElementById("year-4");

        if (!year1 || !year2 || !year3 || !year4) {
            return;
        }

        // Update year opacity
        $anime({
            targets: ".year",
            opacity: [0, 1],
            duration: 1000,
            easing: "easeInCubic",
        });

        // Update year count
        $anime({
            targets: year,
            display: [year.display, year.end],
            round: 1,
            duration: 3000,
            easing: "easeInOutCubic",
            change: () => {
                const temp = "" + year.display + "";
                year1.innerHTML = temp[0];
                year2.innerHTML = temp[1];
                year3.innerHTML = temp[2];
                year4.innerHTML = temp[3];
            },
            complete: () => {
                // Circle clip grow
                $anime({
                    targets: ".clip",
                    clipPath: "circle(100% at 50% 50%)",
                    easing: "easeOutCubic",
                    duration: 2000,
                    delay: 200,
                    complete: () => {
                        finish();
                    },
                });

                // Loading opacity
                // $anime({
                //   targets: '#loading',
                //   opacity: 0,
                //   easing: 'easeInQuad',
                //   duration: 1000,
                //   delay: 1000,
                // })
            }
        });
    });
});
</script>

<!-- SCSS -->
<style lang="scss" scoped>
#loading {
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: $color_dark;
  display: flex;

  .clip-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
  }

  .clip {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: circle(0% at 50% 50%);
    background-color: $color_platinum;
  }

  .border{
    flex: 1 1 auto;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .year {
    opacity: 0;
    font-family: $font_family_serif;
    font-weight: 400;
    color: $color_platinum;
    font-size: 1.5rem;
  }

  #year-1 {
    margin-bottom: 16px;
  }

  #year-2 {
    margin-bottom: 16px;
    margin-right: 4px;
  }

  #year-3 {
    margin-top: 16px;
    margin-left: 4px;
  }

  #year-4 {
    margin-top: 16px;
  }

}
</style>
