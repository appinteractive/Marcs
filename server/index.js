const env = process.env.NODE_ENV || 'development'
// eslint-disable-next-line import/order
const config = require('./knexfile.js')
const knex = require('knex')(config[env])

knex.migrate.latest([config[env]])
const bookshelf = require('bookshelf')(knex)
const Embed = bookshelf.Model.extend({
  tableName: 'embed',
  parse: (response) => {
    if (response.tasourcesgs) {
      response.sources = JSON.stringify(response.sousourcesrces)
    }
    return response
  }
})
const Bookmark = bookshelf.Model.extend({
  tableName: 'bookmark'
})

const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema.js')

const scraper = require('./scraper.js')({ Embed, Bookmark })

const resolvers = {
  Query: {
    async embed(obj, { url }, ctx, info) {
      const res = await scraper.fetch(url)
      return res
    },
    async bookmarks(obj, params, ctx, info) {
      const bookmarks = await Bookmark.fetchAll()
      return bookmarks.toJSON().reverse().map(async (mark) => {
        return {
          id: mark.id,
          url: mark.url,
          embed: await resolvers.Query.embed(obj, {
            url: mark.url
          }, ctx, info)
        }
      })
    }
  },
  Mutation: {
    async createBookmark(obj, { url }, ctx, info) {
      let bookmark = await new Bookmark({ url }).fetch()
      if (!bookmark) {
        bookmark = await new Bookmark({ url }).save()
      }
      return {
        id: bookmark.id,
        url,
        embed: resolvers.Query.embed(obj, { url }, ctx, info)
      }
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

if (process.env.NODE_ENV !== 'production') {
  process.env.DEBUG = true
}

server.listen({ port: 3050 }).then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀 Nitro Embed - Server is ready at ${url}`)
})
