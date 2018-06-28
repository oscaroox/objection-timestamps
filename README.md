# Objection-timestamps

Automatically modify the `created_at` and `updated_at` columns on your models.

[v0.x usage](https://github.com/oscaroox/objection-timestamps/tree/0.2.0)

## Setup

### Basic
The basic setup assumes you have the columns `created_at` and `updated_at` in your table.


```javascript

let Model = require('objection').Model
let timestampPlugin = require('objection-timestamps')

class Post extends timestampPlugin()(Model) {
    static get tableName() {
        return 'user'
    }
    // allow timestamp plugin on this model
    static get timestamp() {
        return true
    }
}

Post
    .query()
    .insertAndFetch({
        firstName: 'John',
        lastName: 'Doe'
    })
    .then(john => {
        console.log(john.created_at) // ISO-8601 Date format:  YYYY-MM-DDTHH:mm:ss.sssZ
        console.log(john.updated_at) // ISO-8601 Date format:  YYYY-MM-DDTHH:mm:ss.sssZ
    })

```

### Advanced
You can pass in an object to override the default settings
```javascript

let Model = require('objection').Model
let timestampPlugin = require('objection-timestamps')({
    createdAt: 'my_created_at', // change createdAt column name
    updatedAt: 'my_updated_at', // change updatedAt column name
    genDate: function() {
        return 'my date format'
    }
})

class Post extends timestampPlugin(Model) {
    static get tableName() {
        return 'user'
    }
    // allow timestamp plugin on this model
    static get timestamp() {
        return true
    }
}

Post
    .query()
    .insertAndFetch({
        firstName: 'John',
        lastName: 'Doe'
    })
    .then(john => {
        console.log(john.my_created_at) // my date format
        console.log(john.my_updated_at) // my date format
    })
```

If you provide custom values plugin won't override them
```javascript

let Model = require('objection').Model
let timestampPlugin = require('objection-timestamps')

class Post extends timestampPlugin()(Model) {
    static get tableName() {
        return 'user'
    }
    // allow timestamp plugin on this model
    static get timestamp() {
        return true
    }
}

Post
    .query()
    .insertAndFetch({
        firstName: 'John',
        lastName: 'Doe',
        created_at: 'Foobar',
        updated_at: 'Foobiz'
    })
    .then(john => {
        console.log(john.created_at) // Foobar
        console.log(john.updated_at) // Foobiz
    })
```
