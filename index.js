'use strict'

module.exports = (Model) => {
  let options = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    genDate () {
      return new Date().toISOString()
    }
  }
  // override settings and return bound function
  if (typeof Model === 'object') {
    options = Object.assign({}, options, Model)
    return timeStampModel.bind(timeStampModel, options)
  }

  return timeStampModel(options, Model)
}

function timeStampModel (opts, Model) {
  return class extends Model {
    $beforeInsert (ctx) {
      const promise = super.$beforeInsert(ctx)

      if (this.constructor.timestamp) {
        return Promise.resolve(promise)
          .then(() => {
            this[opts.createdAt] = this[opts.createdAt] || opts.genDate()
            this[opts.updatedAt] = this[opts.updatedAt] || opts.genDate()
          })
      }
      return Promise.resolve(promise)
    }

    $beforeUpdate (opt, ctx) {
      const promise = super.$beforeUpdate(opt, ctx)

      if (this.constructor.timestamp) {
        return Promise.resolve(promise)
          .then(() => {
            this[opts.updatedAt] = this[opts.updatedAt] || opts.genDate()
          })
      }
      return Promise.resolve(promise)
    }
  }
}
