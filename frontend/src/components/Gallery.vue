<template>
  <div class="m-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
    <div
      v-for="image in sortedImages"
      :key="image.id"
      class="flex cursor-pointer"
      @click="openImage(image)"
    >
      <img
        loading="lazy"
        :src="'image/' + image.id"
        :alt="image.time_frame + ' ' + image.subject + ' ' + image.location"
        class="w-full h-auto object-scale-down bg-dark"
      />
    </div>

    <div
      v-if="showModal"
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 flex items-center justify-center p-10 overflow-hidden"
    >
      <div class="relative">
        <button
          class="text-gray-600 absolute left-0 ml-[-100px] top-1/2 transform -translate-y-1/2 bg-transparent text-4xl p-14"
          @click.prevent="previousImage"
        >
          <i class="fa fa-arrow-left"></i>
        </button>

        <button class="text-gray-600 text-3xl" @click.prevent="closeImage">
          <i class="fa fa-times"></i>
        </button>

        <img
          :src="'image/' + selectedImage.id"
          alt="test"
          class="object-cover max-h-[80vh] max-w-[73vw] mx-auto"
        />
        <button
          class="text-gray-600 absolute right-0 mr-[-100px] top-1/2 transform -translate-y-1/2 bg-transparent text-4xl p-14"
          @click.prevent="nextImage"
        >
          <i class="fa fa-arrow-right"></i>
        </button>

        <!-- mobile image text -->
        <div class="block sm:hidden text-left text-white">
          <h4 class="text-sm">{{ selectedImage.time_frame }}</h4>
          <h4 class="text-sm">{{ selectedImage.subject }}</h4>
          <h4 class="text-sm">{{ selectedImage.location }}</h4>
        </div>

        <!-- desktop image text -->
        <div class="hidden sm:block">
          <h4 class="text-sm absolute w-full text-left text-white">
            {{ selectedImage.time_frame }}
          </h4>
          <h4 class="text-sm absolute w-full text-center text-white">
            {{ selectedImage.subject }}
          </h4>
          <h4 class="text-sm absolute w-full text-right text-white">
            {{ selectedImage.location }}
          </h4>
        </div>

        <!-- tooltip, hidden on mobile -->
        <div class="pt-6 text-center hidden sm:block" :class="{ 'fade-out': !showTooltip }">
          <i class="text-xs text-gray-600">left/right arrow keys, escape to close</i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-out {
  opacity: 0;
  transition: opacity 2s linear;
}

.fixed {
  z-index: 1000;
}
.w-auto {
  max-width: 90%;
  max-height: 90%;
}

button {
  transform: translateY(-50%);
}
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      images: [],
      showModal: false,
      showTooltip: false,
      selectedImage: null
    }
  },
  created() {
    window.addEventListener('keyup', this.handleKeyup)
    axios
      .get('/images')
      .then((response) => (this.images = response.data))
      .catch((error) => console.log(error))
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyup)
  },
  computed: {
    sortedImages() {
      return this.images.sort((a, b) => a.display_order - b.display_order)
    }
  },
  methods: {
    handleKeyup(e) {
      if (this.showModal) {
        if (e.key === 'ArrowRight') {
          this.nextImage()
        } else if (e.key === 'ArrowLeft') {
          this.previousImage()
        } else if (e.key === 'Escape') {
          this.closeImage()
        }
      }
    },
    openImage(image) {
      this.showModal = true
      this.showTooltip = true
      this.selectedImage = image

      setTimeout(() => {
        this.showTooltip = false
      }, 2500)
    },
    closeImage() {
      this.showModal = false
    },
    previousImage() {
      const currentImageIndex = this.sortedImages.indexOf(this.selectedImage)
      if (currentImageIndex > 0) {
        this.selectedImage = this.sortedImages[currentImageIndex - 1]
      }
    },
    nextImage() {
      const currentImageIndex = this.sortedImages.indexOf(this.selectedImage)
      if (currentImageIndex < this.sortedImages.length - 1) {
        this.selectedImage = this.sortedImages[currentImageIndex + 1]
      }
    }
  }
}
</script>
