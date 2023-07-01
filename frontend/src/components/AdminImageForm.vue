<template>
  <div class="bg-white p-4 max-w-xl mx-auto rounded-lg shadow-md">
    <form @submit.prevent="uploadImage" class="space-y-2">
      <label class="block text-gray-700 text-sm" for="key">Key</label>
      <input
        id="key"
        type="text"
        v-model="authKey"
        placeholder="Enter Key"
        class="rounded border-gray-300 w-full text-xs"
      />

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

          <div class="grid grid-cols-2">
            <label class="block text-gray-700 text-xs" for="time_frame">Time Frame</label>
            <label class="block text-gray-700 text-xs" for="location">Location</label>
            <input
              id="time_frame"
              type="text"
              v-model="image.time_frame"
              placeholder="Time Frame"
              class="rounded border-gray-300 w-full text-xs"
            />
            <input
              id="location"
              type="text"
              v-model="image.location"
              placeholder="Location"
              class="rounded border-gray-300 w-full text-xs"
            />

            <label class="block text-gray-700 text-xs" for="subject">Subject</label>
            <label class="block text-gray-700 text-xs" for="display_order">Display Order</label>
            <input
              id="subject"
              type="text"
              v-model="image.subject"
              placeholder="Subject"
              class="rounded border-gray-300 w-full text-xs"
            />
            <input
              id="display_order"
              type="number"
              v-model="image.display_order"
              @change="submitForm"
              placeholder="Display Order"
              class="rounded border-gray-300 w-full text-xs"
            />
          </div>
        </div>

        <div class="text-center space-x-2 mt-2">
          <button
            type="submit"
            class="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            @click="deleteImage(image.id)"
            class="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
          >
            Delete
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
      imagePath: null,
      authKey: null
    }
  },

  async mounted() {
    this.fetchImages()
  },

  methods: {
    async uploadImage() {
      try {
        let formData = new FormData()
        formData.append('image', this.imagePath)
        formData.append('key', this.authKey)
        await axios.post('/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${this.authKey}`
          }
        })
        this.fetchImages()
      } catch (error) {
        alert('Error uploading image: ' + error.message)
        console.log(error.response)
      }
    },

    async deleteImage(id) {
      try {
        await axios.delete(
          `/image/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${this.authKey}`
            }
          }
        )
        this.images = this.images.filter((image) => image.id !== id)
      } catch (error) {
        alert('Error deleting image: ' + error.message)
        console.log(error.response)
      }
    },

    async fetchImages() {
      try {
        const response = await axios.get(`/images`)
        this.images = response.data
      } catch (error) {
        alert('Error fetching images: ' + error.message)
        console.log(error.response)
      }
    },

    handleFileUpload(event) {
      this.imagePath = event.target.files[0]
    },

    async submitForm() {
      try {
        for (let image of this.images) {
          await axios.patch(`/image/${image.id}`, image, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${this.authKey}`
            }
          })
        }
        this.fetchImages()
      } catch (error) {
        alert('Error updating images: ' + error.message)
        console.log(error.response)
      }
    }
  }
}
</script>
