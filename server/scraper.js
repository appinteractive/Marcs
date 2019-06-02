/* eslint-disable node/no-deprecated-api */
const urlParser = require('url')
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-lang')(),
  require('metascraper-lang-detector')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  // require('metascraper-clearbit-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-audio')(),
  require('metascraper-soundcloud')(),
  require('metascraper-video')(),
  require('metascraper-youtube')()

  // require('./rules/metascraper-embed')()
])
const { ApolloError } = require('apollo-server')

const got = require('got')
const request = require('request-promise-native')
const find = require('lodash/find')
const isEmpty = require('lodash/isEmpty')
const isArray = require('lodash/isArray')
const mergeWith = require('lodash/mergeWith')

let oEmbedProviders = []
const getEmbedProviders = async () => {
  let providers = await request('https://oembed.com/providers.json')
  providers = JSON.parse(providers)
  oEmbedProviders = providers
  return providers
}
getEmbedProviders()

module.exports = ({ Embed }) => {
  const scraper = {
    async fetch(targetUrl) {
      if (targetUrl.indexOf('//youtu.be/')) {
        // replace youtu.be to get proper results
        targetUrl = targetUrl.replace('//youtu.be/', '//youtube.com/')
      }
      targetUrl = targetUrl.replace(/(\/$|\/?#.*)/g, '')

      const cached = await Embed
        .query({ where: { targetUrl } })
        .fetch()
      if (cached) return cached.toJSON()

      let meta = {}
      let embed = {}

      const url = urlParser.parse(targetUrl, true)

      // only get data from requested services
      await Promise.all([
        new Promise(async (resolve, reject) => {
          try {
            meta = await scraper.fetchMeta(targetUrl)
            resolve()
          } catch (err) {
            if (process.env.DEBUG) {
              console.error(`ERROR at fetchMeta | ${err.message}`)
            }
            resolve()
          }
        }),
        new Promise(async (resolve, reject) => {
          try {
            embed = await scraper.fetchEmbed(targetUrl)
            resolve()
          } catch (err) {
            if (process.env.DEBUG) {
              console.error(`ERROR at fetchEmbed | ${err.message}`)
            }
            resolve()
          }
        })
      ])

      const output = mergeWith(meta, embed, (objValue, srcValue) => {
        if (isArray(objValue)) {
          return objValue.concat(srcValue)
        }
      })

      if (isEmpty(output)) {
        throw new ApolloError('Not found', 'NOT_FOUND')
      }

      // fix youtube start parameter
      const YouTubeStartParam = url.query.t || url.query.start
      if (output.publisher === 'YouTube' && YouTubeStartParam) {
        output.embed = output.embed.replace(
          '?feature=oembed',
          `?feature=oembed&start=${YouTubeStartParam}`
        )
        output.url += `&start=${YouTubeStartParam}`
      }

      output.targetUrl = targetUrl
      new Embed(output).save(null, { mode: 'insert' })

      return output
    },
    async fetchEmbed(targetUrl) {
      const url = urlParser.parse(targetUrl)
      const embedMeta = find(oEmbedProviders, (provider) => {
        return provider.provider_url.indexOf(url.hostname) >= 0
      })
      if (!embedMeta) {
        return {}
      }
      const embedUrl = embedMeta.endpoints[0].url.replace('{format}', 'json')

      let data
      try {
        data = await request(`${embedUrl}?url=${targetUrl}`)
        data = JSON.parse(data)
      } catch (err) {
        data = await request(`${embedUrl}?url=${targetUrl}&format=json`)
        data = JSON.parse(data)
      }
      if (data) {
        const output = {
          type: data.type || 'link',
          embed: data.html,
          author: data.author_name,
          date: data.upload_date
            ? new Date(data.upload_date).toISOString()
            : null
        }

        output.sources = ['oembed']

        return output
      }
      return {}
    },
    async fetchMeta(targetUrl) {
      // const parsedURL = urlParser.parse(targetUrl)
      // console.log(parsedURL)

      // get from cach

      const { body: html, url } = await got(targetUrl)
      const metadata = await metascraper({ html, url })

      metadata.sources = ['resource']
      metadata.type = 'link'

      return metadata
    }
  }

  return scraper
}
