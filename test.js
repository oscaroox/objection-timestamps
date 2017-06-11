'use strict'

const timestampPlugin = require('./')
const expect = require('chai').expect
const Model = require('objection').Model
const Knex = require('knex')

describe('objection-timestamp test', () => {
  let knex

  before(() => {
    knex = Knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test.db'
      }
    })
  })

  before(() => {
    return knex.schema.createTable('user', table => {
      table.increments('id').primary()
      table.string('firstName')
      table.string('created_when')
      table.string('updated_when')
      table.timestamps()
    })
  })

  after(() => {
    return knex.schema.dropTable('user')
  })

  after(() => {
    return knex.destroy()
  })

  beforeEach(() => {
    return knex('user').delete()
  })

  it('should modify the `created_at` and `updated_at` columns automatically on insert', () => {
    class User extends timestampPlugin(Model) {
      static get tableName () {
        return 'user'
      }
    }

    return User
      .query(knex)
      .insert({firstName: 'John'})
      .then(john => {
        expect(Date.parse(john.created_at)).to.not.be.NaN
        expect(Date.parse(john.updated_at)).to.not.be.NaN
      })
  })

  it('should modify the `updated_at` column automatically on update', () => {
    class User extends timestampPlugin(Model) {
      static get tableName () {
        return 'user'
      }
      }

    return User
        .query(knex)
        .insert({firstName: 'Jane'})
        .then(jane => {
          let createdAt = Date.parse(jane.created_at)
          let updatedAt = Date.parse(jane.updated_at)
          expect(createdAt).to.not.be.NaN
          expect(updatedAt).to.not.be.NaN
          return jane
                .$query(knex)
                .updateAndFetch({firstName: 'Jan'})
                .then(jan => {
                  expect(Date.parse(jane.updated_at)).to.not.equal(updatedAt)
                  expect(Date.parse(jane.created_at)).to.equal(createdAt)
                })
        })
  })

  it('should modify the `created_when` and `updated_when` columns on insert/update with utc date string', () => {
    let timeStamp = timestampPlugin({
      createdAt: 'created_when',
      updatedAt: 'updated_when',
      genDate () {
        return new Date().toUTCString()
      }
    })

    class User extends timeStamp(Model) {
      static get tableName () {
        return 'user'
      }
    }

    return User
        .query(knex)
        .insert({firstName: 'joey'})
        .then(joey => {
          expect(Date.parse(joey.created_when)).to.not.be.NaN
          expect(Date.parse(joey.updated_when)).to.not.be.NaN
        })
  })
})
