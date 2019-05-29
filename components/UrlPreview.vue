<template>
  <li class="item md:w-full">
    <a :href="url" target="_blank">
      <template v-if="loading">
        <div class="empty" style="min-height: 100px; min-width: 400px;">
          <strong style="width: 100%; text-align: center; padding: 5px;">loading...</strong>
        </div>
      </template>
      <template v-else>
        <template v-if="!imgError && embed && embed.image">
          <img v-show="!imgLoaded" class="img" :src="embed.image" @load="onImageLoad" @error="onImgError">
          <div v-if="imgLoaded" class="img empty">
            <span>loading...</span>
          </div>
        </template>
        <div v-else class="img empty">
          <span>no image</span>
        </div>
        <div class="title">
          <strong>{{ embed.title || url | truncate(128) }}</strong>
          <small style="padding-top: 3px; padding-bottom: 8px;">
            {{ embed.description | truncate(140) }}
          </small>
          <small style="display: flex; align-items: center; margin-top: 5px;">
            <!--{{ url | truncate(80) }}-->
            <img :src="embed.logo" height="16" style="margin-right: 4px;">
            {{ embed.publisher }}
          </small>
        </div>
      </template>
    </a>
  </li>
</template>

<script>
export default {
  filters: {
    truncate: (value = '', length = -1) => {
      if (!value || typeof value !== 'string' || value.length <= 0) {
        return ''
      }
      if (length <= 0) {
        return value
      }
      let output = value.substring(0, length)
      if (output.length < value.length) {
        output += '…'
      }
      return output
    }
  },
  props: {
    url: { type: String, required: true }
  },
  data() {
    return {
      embed: {},
      loading: true,
      imgError: false,
      imgLoaded: true
    }
  },
  created() {
    this.load()
  },
  methods: {
    onImgError() {
      this.imgError = true
    },
    onImageLoad() {
      this.imgError = false
      this.imgLoaded = false
    },
    async load() {
      let url = this.url
      if (url.indexOf('http') < 0) {
        url = `http://${url}`
      }
      const res = await this.$axios.post('http://localhost:3050', {
        query: `{ 
          embed(url:"${url}") {
            title
            description
            image
            video
            date
            sources
            publisher
            logo
          }
        }`
      })
      // eslint-disable-next-line
      console.log(res)
      if (res && res.data && res.data.data && res.data.data.embed) {
        this.embed = res.data.data.embed
      }

      this.loading = false
    }
  }
}
</script>

<style>
.item, a {
  transition: background-color 150ms ease-in-out;
  @apply text-left flex text-black no-underline rounded;
  align-items: center;
}
.item a {
  width: 100%;
}
a:hover {
  @apply bg-gray-200;
}
.img {
  display: block;
  width: 250px;
  min-height: 160px;
  object-fit: contain;
  object-position: center;
  @apply p-4;
}
.items.list .img {
  width: 150px;
  min-width: 150px;
  min-height: 80px;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  @apply text-gray-500;
}
.title {
  @apply flex-auto flex p-4;
  flex-direction: column;
}
small {
  @apply text-gray-700;
}
</style>
