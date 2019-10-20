<template>
  <li class="item md:w-full">
    <a :href="url" target="_blank" :class="{ loading: loading }">
      <template v-if="loading">
        <!--<div class="empty" style="min-height: 100px; min-width: 400px;">
          <strong style="width: 100%; text-align: center; padding: 5px;">loading...</strong>
        </div>--->
        <div class="img" />
        <div class="title">
          <div
            class="header"
            :style="{ 'max-width': `${(Math.random() + 0.5) * 300}px` }"
          />
          <div
            class="description"
            :style="{ 'max-width': `${(Math.random() + 0.5) * 300}px` }"
          />
          <div
            class="description"
            :style="{ 'max-width': `${(Math.random() + 0.5) * 300}px` }"
          />
          <div
            class="publisher"
            :style="{ 'max-width': `${(Math.random() + 0.5) * 100}px` }"
          />
        </div>
      </template>
      <template v-else>
        <template v-if="!imgError && embed && embed.image">
          <div v-show="!imgLoaded || embed.video" class="relative w-full border px-5">
            <div class="media-container">
              <img class="img" :src="embed.image.url" @load="onImageLoad" @error="onImgError">
              <video
                v-if="embed.video"
                :src="embed.video"
                :poster="embed.image.url"
                controls
              />
            </div>
          </div>
          <div v-if="imgLoaded && !embed.video" class="img loading" />
        </template>
        <div v-else class="img empty">
          <span>no image</span   >
        </div>
        <div class="title">
          <strong>{{ embed.title || url | truncate(128) }}</strong>
          <small style="padding-top: 3px; padding-bottom: 8px;">
            {{ embed.description | truncate(140) }}
          </small>
          <small style="display: flex; align-items: center; margin-top: 5px;">
            <!--{{ url | truncate(80) }}-->
            <img :src="embed.logo.url" height="16" style="margin-right: 4px;">
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
            image(width: 400) {
              url
            }
            video
            date
            publisher
            logo {
              url
            }
          }
        }`
      })
      if (res && res.data && res.data.data && res.data.data.embed) {
        this.embed = res.data.data.embed
      }

      this.loading = false
    }
  }
}
</script>

<style lang="postcss">
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
  object-fit: contain;
  object-position: center;
  overflow: hidden;
  @apply p-4;
}
.media-container {
  width: 100%;
  height: 100%;
  padding-bottom: 56.25%;
  position: relative;
  display: flex;
}
video {
  display: flex;
  width: 100%;
  position: absolute;
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
.item a.loading {
  min-height: 100px;
  min-width: 400px;
  overflow: hidden;
  position: relative;

  .img {
    @apply bg-gray-300 !important;
  }
  .title {
    @apply w-full pr-4;

    div {
      @apply bg-gray-300 mb-2 mr-4;
      &:last-child {
        margin-bottom: 0;
      }
      height: 1em;
      width: 100%;

      &.header {
        @apply bg-gray-400;
      }
    }
  }
}
.item a {
  &.loading,
  .img.loading {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100vw;
      background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.5) 15%, transparent 30%);
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: vueContentPlaceholdersAnimation;
      animation-timing-function: linear;
    }
  }
  .img.loading {
    position: relative;
  }
}

@keyframes vueContentPlaceholdersAnimation {
  0% {
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
