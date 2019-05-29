<template>
  <section class="container">
    <div class="wrapper">
      <div class="control">
        <a
          class="ml-auto"
          :class="{ active: mode === 'list' }"
          @click.stop="changeMode('list')"
        >
          <img src="/svg/list.svg">
        </a>
        <a
          class="mr-auto"
          :class="{ active: mode === 'grid' }"
          @click.stop="changeMode('grid')"
        >
          <img src="/svg/grid.svg">
        </a>
      </div>
      <ul class="items" :class="mode">
        <UrlPreview
          v-for="url in urls"
          :key="url"
          :url="url"
          class="item"
        />
        <li v-if="urls.length < 1" class="item empty">
          <div class="empty-list">
            <strong class="flex w-full">Empty</strong>
            <small class="flex w-full">Paste a list of urls here</small>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import UrlPreview from '~/components/UrlPreview'
export default {
  components: {
    UrlPreview
  },
  data() {
    return {
      urls: [],
      mode: 'list'
    }
  },
  created() {
    // eslint-disable-next-line
    window.addEventListener('paste', this.onPaste)
  },
  beforeDestroy() {
    window.removeEventListener('paste', this.onPaste)
  },
  methods: {
    changeMode(mode) {
      this.mode = mode
    },
    onPaste(e) {
      const paste = (e.clipboardData || window.clipboardData).getData('text')
      try {
        const urls = paste.split(/\n/g).filter(n => n.length > 0)
        urls.forEach((url) => {
          url = url.trim()
          // eslint-disable-next-line
          console.log(url, url.indexOf('http'))
          if (url.indexOf(' ') >= 0 || url.indexOf('http') !== 0) {
            return
          }
          if (this.urls.indexOf(url) < 0) {
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

<style>
.container {
  @apply min-h-screen font-sans text-sm bg-gray-900 flex justify-center items-center text-center mx-auto;
}
.wrapper {
  @apply shadow-xl bg-white rounded m-4;
  max-width: 1200px;
}
.control {
  display: flex;
  @apply p-4 pr-0;

  a {
    @apply mr-4 w-full;
    transition: all 150ms ease-in-out;
    cursor: pointer;
    opacity: 0.5;
    justify-self: flex-end;
    justify-content: center;

    &:hover,
    &.active {
      opacity: 1;
    }

    &.active {
      @apply bg-blue-200;
    }
  }
}
.items {
  display: flex;
  @apply list-none p-0 pr-4;

  .item {
    @apply flex pl-4 pb-4 rounded w-full overflow-hidden;

    .img {
      @apply p-0 m-0 h-full bg-gray-900;
      object-fit: cover;
      max-height: 100px;
    }
  }

  &.list {
    flex-direction: column;
  }
  &.grid {
    flex-direction: row;
    @apply flex flex-wrap;

    .item {
      @apply flex;

      a {
        @apply flex h-full w-full;
        flex-direction: column;

        .img {
          flex: 3;
          @apply p-0 m-0 h-full w-full bg-gray-900;
          object-fit: cover;
          max-height: 250px;
        }
        .title {
          flex: 1;
          align-self: flex-start;
        }
      }
    }
  }
}
.item.empty {
  @apply flex p-5 pt-0;
  padding-right: 0;
  min-width: 300px;
  width: 100% !important;
  text-align: center;
}
.empty-list {
  @apply flex flex-col m-4 p-0;
}
@screen sm {
  .items.grid .item {
    @apply w-1/2;
  }
}
@screen md {
  .control {
    justify-content: flex-end;
    a {
      max-width: 80px;
    }
  }
}
@screen lg {
  .items.grid .item {
    @apply w-1/3;
  }
}
</style>
