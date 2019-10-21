<template>
  <section
    class="container mx-auto pb-24 relative"
    :class="[
      `${mode}-${size}`
    ]"
  >
    <div class="flex justify-end self-end items-end flex-col fixed px-3">
      <a
        class="cursor-pointer flex p-1"
        :class="[ mode === 'list' ? 'text-gray-800' : 'text-gray-500' ]"
        @click.stop="changeMode('list')"
      >
        <IcoListM class="h-6 w-6 fill-current" />
      </a>
      <a
        class="cursor-pointer flex p-1"
        :class="[ mode === 'grid' && size === 1 ? 'text-gray-800' : 'text-gray-500' ]"
        @click.stop="changeMode('grid', 1)"
      >

        <IcoListL class="h-6 w-6 fill-current" />
      </a>
      <a
        class="cursor-pointer flex p-1"
        :class="[ mode === 'grid' && size === 2 ? 'text-gray-800' : 'text-gray-500' ]"
        @click.stop="changeMode('grid', 2)"
      >
        <IcoGrid2 class="h-6 w-6 fill-current" />
      </a>
      <a
        class="cursor-pointer flex p-1"
        :class="[ mode === 'grid' && size === 3 ? 'text-gray-800' : 'text-gray-500' ]"
        @click.stop="changeMode('grid', 3)"
      >
        <IcoGrid3 class="h-6 w-6 fill-current" />
      </a>
    </div>
    <ul
      class="flex px-12"
      :class="[
        size === 1 ? 'flex-col' : 'flex-wrap'
      ]"
    >
      <Embed
        v-for="url in urls"
        :key="url"
        tag="li"
        class="flex px-2"
        :class="[
          size === 1 && 'w-full justify-center',
          size === 2 && 'w-1/2 justify-start',
          size === 3 && 'w-1/3 justify-start',
        ]"
        :url="url"
        :size="mode === 'list' ? 'M' : 'L'"
      />
      <li v-if="urls.length < 1" class="flex w-full justify-center items-center">
        <IcoBox class="h-10 w-10 mr-5 fill-current text-gray-500" />
        <div class="empty-list py-32">
          <strong class="flex w-full text-gray-700">Empty</strong>
          <small class="flex w-full text-gray-600">Paste a list of urls here</small>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import IcoListM from '~/static/svg/list-m.svg'
import IcoListL from '~/static/svg/list-l.svg'
import IcoGrid2 from '~/static/svg/grid-x2.svg'
import IcoGrid3 from '~/static/svg/grid-x3.svg'
import IcoBox from '~/static/svg/box.svg'
import Embed from '~/components/Embeds/Embed'

export default {
  components: {
    IcoListM,
    IcoListL,
    IcoGrid2,
    IcoGrid3,
    IcoBox,
    Embed
  },
  data () {
    return {
      urls: [
        // 'https://www.youtube.com/watch?v=RoGHVI-w9bE&feature=share',
      ],
      mode: 'grid',
      size: 3
    }
  },
  created () {
    // eslint-disable-next-line
    window.addEventListener('paste', this.onPaste)
  },
  beforeDestroy () {
    window.removeEventListener('paste', this.onPaste)
  },
  methods: {
    changeMode (mode, size = 1) {
      this.mode = mode
      this.size = size
    },
    onPaste (e) {
      const paste = (e.clipboardData || window.clipboardData).getData('text')
      try {
        const urls = paste.split(/\n/g).filter(n => n.length > 0)
        urls.forEach((url) => {
          url = url.trim()
          // eslint-disable-next-line
          console.log(url, url.includes('http'))
          if (url.includes(' ') || url.indexOf('http') !== 0) {
            return
          }
          if (!this.urls.includes(url)) {
            this.urls.push(url)
          }
        })
      } catch (err) {
        // eslint-disable-next-line
        console.log('ERROR', err)
      }
    }
  }
}
</script>

<style lang="postcss">
.grid-3 {
  .embed-privacy {
    .embed-privacy-logo,
    .embed-privacy-title,
    .embed-privacy-text {
      display: none;
    }
    .btn {
      @apply text-xs font-bold;
    }
  }
}
.grid-2 {
  .embed-privacy {
    .embed-privacy-logo,
    .embed-privacy-title {
      display: none;
    }
    .embed-privacy-logo,
    .embed-privacy-title,
    .embed-privacy-text {
      @apply text-xs text-center px-10;
    }
    .btn {
      @apply text-xs font-bold;
    }
  }
}
</style>
