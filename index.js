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
  return class TimestampModel extends Model {
    $beforeInsert (ctx) {
      const promise = super.$beforeInsert(ctx)

      return Promise.resolve(promise)
                .then(() => {
                  this[opts.createdAt] = opts.genDate()
                  this[opts.updatedAt] = opts.genDate()
                })
    }

    $beforeUpdate (opt, ctx) {
      const promise = super.$beforeUpdate(opt, ctx)

      return Promise.resolve(promise)
                .then(() => {
                  this[opts.updatedAt] = opts.genDate()
                })
    }
  }
}
