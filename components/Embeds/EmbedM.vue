<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer nofollow"
    class="embed-card embed-link leading-tight border text-gray-700 rounded flex flex-row my-2 cursor-pointer select-none hover:border-blue-600 bg-white max-w-3xl overflow-hidden items-center"
    :class="{ 'embed-small': small, loading }"
  >
    <div
      class="embed-card_preview bg-gray-200 flex flex-shrink-0 self-center justify-center relative overflow-hidden h-full placeholder"
    >
      <img
        v-show="imageReady"
        class="object-cover object-scale-down w-full block"
        :src="image"
        @load="onImageLoaded"
        @error="onImageError"
      >
      <h5 v-if="imageError" class="justify-center self-center flex w-full uppercase text-gray-500 text-xs">No Image</h5>
    </div>
    <div v-if="loading" class="p-5 flex h-full flex-col items-start">
      <div
        class="placeholder bg-gray-200 rounded-sm inline-block h-4 w-32"
        :style="{ 'min-width': `${(Math.random() + 0.5) * 300}px` }"
      />
      <div
        class="placeholder bg-gray-200 rounded-sm inline-block h-3 w-32 mt-3"
        :style="{ 'min-width': `${(Math.random() + 0.5) * 300}px` }"
      />
      <div
        class="placeholder bg-gray-200 rounded-sm inline-block h-3 w-32 mt-1"
        :style="{ 'min-width': `${(Math.random() + 0.5) * 300}px` }"
      />
      <div
        class="placeholder bg-gray-200 rounded-sm inline-block h-3 w-32 mt-4"
        :style="{ 'min-width': `${(Math.random() + 0.5) * 100}px` }"
      />
    </div>
    <div v-else class="p-5 flex h-full flex-col items-start justify-center mr-2 overflow-hidden">
      <h2
        class="font-bold text-gray-800 truncate"
      >{{ title }}</h2>
      <p v-if="!small" class="text-gray-600 leading-none pt-2">
        <small>{{ description }}</small>
      </p>
      <div class="pt-4 flex">
        <div class="flex items-center w-auto">
          <img
            v-show="logoReady"
            class="h-5 mr-2"
            :src="logo"
            :alt="publisher"
            @load="onLogoLoaded"
            @error="onLogoError"
          >
          <small v-if="hasSmallLogo" class="text-gray-600">{{ publisher }}</small>
        </div>
      </div>
    </div>
  </a>
</template>

<script>

export default {
  props: {
    url: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    image: { type: String, default: null },
    video: { type: String, default: null },
    audio: { type: String, default: null },
    logo: { type: String, default: null },
    publisher: { type: String, default: null },
    small: { type: Boolean },
    loading: { type: Boolean, default: true }
  },
  data: () => ({
    hasSmallLogo: true,
    imageError: false,
    imageReady: false,
    logoReady: false,
    logoError: false
  }),
  methods: {
    onImageLoaded () {
      this.imageError = false
      this.imageReady = true
    },
    onImageError () {
      this.imageError = true
    },
    onLogoError () {
      this.logoError = true
    },
    onLogoLoaded (e) {
      this.hasSmallLogo = e.target.width / e.target.height <= 2
      this.logoError = false
      this.logoReady = true
    }
  }
}

</script>

<style lang="css">
.embed-card {
  transition: all 150ms ease-in-out;
}

.embed-card,
.embed-card_preview {
  min-height: 120px;
}
.embed-card_preview {
  width: 120px;
}

.embed-card.embed-small,
.embed-card.embed-small .embed-card_preview {
  min-height: 80px;
}
.embed-card.embed-small .embed-card_preview {
  width: 80px;
}
/* .embed-card:hover {
  transform: scale(1.005);
} */

.loading .placeholder {
  position: relative;
  overflow: hidden;
}
.loading .placeholder::before {
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

@keyframes vueContentPlaceholdersAnimation {
  0% {
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
