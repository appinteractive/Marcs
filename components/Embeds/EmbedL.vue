<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer nofollow"
    class="embed-card embed-video leading-tight border text-gray-700 rounded flex flex-col my-2 cursor-pointer select-none hover:border-blue-600 bg-white max-w-3xl overflow-hidden"
    :class="{ 'embed-small': small, loading }"
  >
    <div
      class="bg-black flex self-center justify-center overflow-hidden w-full pb-16/9 relative"
    >
      <div v-if="loading" class="absolute w-full h-full">
        <div class="w-full h-full bg-gray-200 placeholder">

        </div>
      </div>
      <div v-else class="absolute w-full h-full">
        <div
          v-if="!embed && video"
          class="absolute block w-full h-full object-cover"
        >
          <video
            class="w-full h-full"
            :class="{
              'object-cover': type !== 'photo',
              'object-contain': type !== 'photo'
            }"
            :controls="type !== 'photo'"
            preload="none"
            :loop="type === 'photo'"
            :src="video"
            :poster="image"
          />
        </div>
        <div
          v-else-if="embed"
          class="w-full h-full"
        >
          <div
            v-if="!doNotTrack || DTNAccepted"
            v-html="embed"
            class="video absolute w-full h-full"
          />
          <div
            v-else
            class="w-full h-full embed-privacy"
            @click.prevent.once="DTNAccepted = true"
          >
            <img :src="image" class="block w-full h-full absolute" />
            <div
              class="w-full h-full absolute flex flex-col items-center justify-center text-white"
              style="background-color: rgba(0,0,0,0.8)"
            >
              <img
                class="embed-privacy-logo h-10 mb-2"
                :src="logo"
              />
              <h3 class="embed-privacy-title text-2xl font-bold">
                Privacy Warning
              </h3>
              <p class="embed-privacy-text pt-2">If you play that video, <b>{{ publisher }}</b> will be able to track you.</p>
              <p class="embed-privacy-text pb-5">Do you want to play it?</p>
              <div>
                <button class="btn btn-primary">Play Video</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-full h-full bg-gray-300">
          <img
            class="object-cover object-scale-down w-full h-full"
            v-show="!imageError && (image || logo)"
            :src="image ? image : logo"
            @load="onImageLoaded"
            @error="onImageError"
          />
        </div>
      </div>
    </div>
    <div class="p-5 flex h-full w-full flex-col content-around">
      <div v-if="loading" class="flex flex-col">
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
      <div v-else>
        <h2
          class="font-bold text-gray-800 truncate"
        >{{ title }}</h2>
        <p class="text-gray-600 leading-none pt-2 truncate">
          <small>{{ description }}</small>
        </p>
        <div class="pt-5 flex items-end">
          <div class="flex items-center w-auto">
            <img
              v-show="logoReady"
              class="h-5 mr-2"
              :src="logo"
              :alt="publisher"
              @load="onLogoLoaded"
              @error="onLogoError"
            />
            <small v-if="hasSmallLogo" class="text-gray-600">{{ publisher }}</small>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>

export default {
  props: {
    url: { type: String },
    title: { type: String },
    type: { type: String },
    description: { type: String },
    image: { type: String },
    video: { type: String },
    audio: { type: String },
    embed: { type: String },
    logo: { type: String },
    publisher: { type: String },
    doNotTrack: { type: Boolean, default: true },
    small: { type: Boolean },
    loading: { type: Boolean, default: true }
  },
  data: () => ({
    DTNAccepted: false,
    hasSmallLogo: true,
    imageReady: false,
    imageError: false,
    logoReady: false,
    logoError: false
  }),
  methods: {
    onImageLoaded() {
      this.imageError = false
      this.imageReady = true
    },
    onImageError() {
      this.imageError = true
    },
    onLogoError() {
      this.logoError = true
    },
    onLogoLoaded(e) {
      this.hasSmallLogo = e.target.width / e.target.height <= 2
      this.logoError = false
      this.logoReady = true
    },
  }
}

</script>

<style lang="css">
.embed-card {
  transition: all 150ms ease-in-out;
}
.embed-video .video iframe {
  position: absolute;
  width: 100%;
  height: 100%;
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
