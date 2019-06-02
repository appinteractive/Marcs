exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('embed', (table) => {
      table.increments()
      table.string('targetUrl', 255).notNullable()
      table.string('url', 255).notNullable()
      table.string('title', 255)
      table.string('description', 255)
      table.string('author', 255)
      table.string('publisher', 255)
      table.string('type', 128)
      table.string('date', 64)
      table.string('image', 255)
      table.string('logo', 255)
      table.string('audio', 255)
      table.string('video', 255)
      table.string('lang', 255)
      table.string('embed', 255)
      table.string('sources', 255)
      table.timestamps()

      table.unique('targetUrl')
      table.unique('url')
    })
    .createTable('bookmark', (table) => {
      table.increments()
      table.string('url', 255).notNullable()
      table.timestamps()

      table.unique('url')
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('embed')
    .dropTable('bookmark')
}
