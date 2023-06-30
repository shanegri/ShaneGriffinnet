<template>
  <div class="flex items-center justify-center min-h-screen bg-dark">
    <div class="flex flex-col sm:flex-row w-full max-w-4xl">
      <!-- Left Column -->
      <div
        class="left-column-class bg-white p-8 rounded shadow-lg w-full sm:w-1/4 pr-8 text-center mb-4 sm:mb-0"
      >
        <div class="pr-5 pl-5 mb-2">
          <img class="rounded-full" src="./assets/shane.jpg" alt="shane" />
        </div>
        <h1 class="text-2xl">Shane Griffin</h1>
        <h2 class="text-gray-600 mb-3">Full Stack Developer</h2>

        <ul id="links" class="p-0 m-0 space-y-2 mx-auto text-center" style="width: fit-content">
          <li class="flex items-start">
            <span class="fa fa-github mr-2 mt-1"></span>
            <a class="hover:underline" target="_blank" href="https://github.com/shanegri/"
              >Github</a
            >
          </li>
          <li class="flex items-start">
            <span class="fa fa-linkedin mr-2 mt-1"></span>
            <a class="hover:underline" target="_blank" href="https://www.linkedin.com/in/shanegri/"
              >Linkedin</a
            >
          </li>
          <li class="flex items-start">
            <span class="fa fa-envelope mr-2 mt-1"></span>
            <a class="hover:underline" target="_blank" href="mailto:shanegri@buffalo.edu">Email</a>
          </li>
          <li class="flex items-start">
            <span class="fa fa-youtube mr-2 mt-1"></span>
            <a class="hover:underline" target="_blank" href="https://youtube.com/@shanegriffinnet"
              >YouTube</a
            >
          </li>
        </ul>
      </div>

      <!-- Right Column -->
      <div
        :style="{ 'max-height': leftColHeight + 'px' }"
        class="w-full sm:w-3/4 flex flex-col overflow-y-auto"
      >
        <!-- Navigation -->
        <div class="flex items-center bg-dark text-white px-6 py-4">
          <button
            :class="{ active: activeTab === 'photos' }"
            class="pr-1 pl-1 text-white mr-4 tab"
            @click="activeTab = 'photos'"
          >
            Photography
          </button>
          <button
            :class="{ active: activeTab === 'work' }"
            class="pr-1 pl-1 text-white mr-4 tab"
            @click="activeTab = 'work'"
          >
            Work
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 max-h-screen overflow-auto px-6 py-4 pt-0 flex flex-col">
          <div v-show="activeTab === 'admin'">
            <AdminImageForm />
          </div>

          <div v-show="activeTab === 'photos'">
            <Gallery />
            <div class="flex justify-end">
              <button
                class="text-gray-800 p-5 text-xs hidden sm:block"
                @click="activeTab = 'admin'"
              >
                edit
              </button>
            </div>
          </div>

          <div v-show="activeTab === 'work'" class="overflow-auto">
            <Work />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab {
  position: relative;
  overflow: hidden;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 1px;
  background: white;
  transition: width 0.06s;
}

.tab.active::after {
  width: 100%;
}
</style>

<script>
import Gallery from './components/Gallery.vue'
import Work from './components/Work.vue'
import AdminImageForm from './components/AdminImageForm.vue'

export default {
  data() {
    return {
      activeTab: 'photos',
      leftColHeight: 0,
      images: ['1.jpg', '2.jpg']
    }
  },
  mounted() {
    window.onload = () => {
      // TODO: this is a wack solution to get left col to not overflow but works so is prob fine for now
      this.updateHeight()
      window.addEventListener('resize', this.updateHeight)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateHeight)
  },
  methods: {
    updateHeight() {
      const leftColElem = document.querySelector('.left-column-class')
      if (leftColElem) {
        this.leftColHeight = leftColElem.offsetHeight
      }
    }
  },
  components: { AdminImageForm, Work, Gallery }
}
</script>
