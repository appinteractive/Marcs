<template>
  <component v-if="!error" :is="tag">
    <component
      class="w-full flex items-center"
      :is="embedComponent"
      :url="embed.url"
      :title="embed.title"
      :description="embed.description"
      :image="embed.image ? embed.image.url : null"
      :video="embed.video"
      :audio="embed.audio"
      :logo="embed.logo ? embed.logo.url : null"
      :type="embed.type"
      :publisher="embed.publisher"
      :embed="embed.embed"
      :loading="!embed || !embed.title"
    />
  </component>
</template>

<script>
import EmbedM from '~/components/Embeds/EmbedM'
import EmbedL from '~/components/Embeds/EmbedL'
import axios from 'axios'

export default {
  components: {
    EmbedM,
    EmbedL
  },
  props: {
    url: { type: String },
    tag: { type: String, default: 'div' },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data: () => ({
    embed: {},
    error: false
  }),
  watch: {
    url: {
      immediate: true,
      handler() {
        this.getMeta(this.url)
      }
    }
  },
  computed: {
    embedComponent() {
      return this.size === 'M' ? 'EmbedM' : 'EmbedL'
    }
  },
  methods: {
    async getMeta(url) {
      const { data } = await axios.post('http://localhost:3050/', {
        query: `{
          embed(url: "${url}") {
            video
            audio
            title
            description
            image {
              url
            }
            author
            type
            date
            url
            logo {
              url
            }
            publisher
            embed
            lang
          }
        }`
      })
      if (data && data.data && data.data.embed && data.data.embed.url) {
        this.embed = data.data.embed
      } else {
        this.error = true
      }
    }
  }
}

</script>

<style lang="css">
.embed-card {
  transition: all 150ms ease-in-out;
}
/* .embed-card:hover {
  transform: scale(1.005);
} */
</style>
