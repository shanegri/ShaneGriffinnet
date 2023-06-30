<template>
  <div class="bg-white p-4 max-w-xl mx-auto rounded-lg shadow-md">
    <form @submit.prevent="uploadImage" class="space-y-2">
      <label class="block text-gray-700 text-sm" for="upload">Upload New Image</label>
      <div class="flex items-center space-x-4">
        <input
          id="upload"
          type="file"
          v-on:change="handleFileUpload"
          class="py-1 px-2 rounded border-gray-300"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
        >
          Upload
        </button>
      </div>
    </form>

    <form @submit.prevent="submitForm" class="space-y-4 mt-2">
      <div v-for="(image, index) in sortedImages" :key="image.id">
        <div class="flex space-x-4">
          <img
            :src="'image/' + image.id"
            alt=""
            class="mt-16 mb-2 h-24 object-cover rounded shadow-md"
          />

          <div class="space-y-4">
            <label class="block text-gray-700 text-xs" for="subject">Subject</label>
            <input
              id="subject"
              type="text"
              v-model="image.subject"
              placeholder="Subject"
              class="py-1 px-2 rounded border-gray-300 w-full text-sm"
            />

            <label class="block text-gray-700 text-xs" for="location">Location</label>
            <input
              id="location"
              type="text"
              v-model="image.location"
              placeholder="Location"
              class="py-1 px-2 rounded border-gray-300 w-full text-sm"
            />

            <label class="block text-gray-700 text-xs" for="time_frame">Time Frame</label>
            <input
              id="time_frame"
              type="text"
              v-model="image.time_frame"
              placeholder="Time Frame"
              class="py-1 px-2 rounded border-gray-300 w-full text-sm"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2 mt-2">
          <button
            type="button"
            @click="moveUp(index)"
            class="bg-blue-300 hover:bg-blue-800 text-white text-sm py-1 px-2 rounded"
          >
            Move Up
          </button>
          <button
            type="button"
            @click="moveDown(index)"
            class="bg-blue-600 hover:bg-blue-800 text-white text-sm py-1 px-2 rounded"
          >
            Move Down
          </button>
          <button
            type="button"
            @click="deleteImage(image.id)"
            class="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
          >
            Delete
          </button>
          <button
            type="submit"
            class="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
          >
            Update
          </button>
        </div>

        <hr class="mt-3" />
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    sortedImages() {
      return [...this.images].sort((a, b) => a.display_order - b.display_order)
    }
  },

  data() {
    return {
      images: [],
      imagePath: null
    }
  },

  async mounted() {
    this.fetchImages()
  },

  methods: {
    async uploadImage() {
      let formData = new FormData()
      formData.append('image', this.imagePath)
      await axios.post('/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.fetchImages()
      this.selectedFile = null
      this.imagePath = null
    },

    async deleteImage(id) {
      await axios.delete(`/image/${id}`)
      this.images = this.images.filter((image) => image.id !== id)
    },

    async fetchImages() {
      let response = await axios.get('/images')
      this.images = response.data
    },

    handleFileUpload(event) {
      this.imagePath = event.target.files[0]
    },

    async submitForm() {
      for (let image of this.images) {
        await axios.patch(`/image/${image.id}`, image)
      }
    },

    moveUp(index) {
      if (index > 0) {
        this.swapDisplayOrder(index - 1, index)
        this.saveImageOrder(index - 1, index)
      }
    },

    moveDown(index) {
      if (index < this.images.length - 1) {
        this.swapDisplayOrder(index, index + 1)
        this.saveImageOrder(index, index + 1)
      }
    },

    swapDisplayOrder(index1, index2) {
      let temp = this.images[index1].display_order
      this.images[index1].display_order = this.images[index2].display_order
      this.images[index2].display_order = temp
    },

    async saveImageOrder(index1, index2) {
      const image1 = { ...this.images[index1] }
      const image2 = { ...this.images[index2] }

      await Promise.all([
        axios.patch(`/image/${image1.id}`, image1),
        axios.patch(`/image/${image2.id}`, image2)
      ])
    }
  }
}
</script>
