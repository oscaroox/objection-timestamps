"use strict";
// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { expect } from "chai";
import Knex from "knex";
import { compose, mixin, Model } from "objection";
import { timestampPlugin } from "../src";

describe("objection-timestamp test", () => {
  let knex: Knex;

  before(() => {
    knex = Knex({
      client: "sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "./test.db",
      },
    });
  });

  before(() => {
    return knex.schema.createTable("user", (table) => {
      table.increments("id").primary();
      table.string("firstName");
      table.string("created_when");
      table.string("updated_when");
      table.timestamps();
    });
  });

  after(() => {
    return knex.schema.dropTable("user");
  });

  after(() => {
    return knex.destroy();
  });

  beforeEach(() => {
    return knex("user").delete();
  });

  it("should work with the mixin helper", () => {
    class User extends mixin(Model, [ timestampPlugin() ]) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }
    return User
      .query(knex)
      .insert({firstName: "user"})
      .then((user) => {
        expect(Date.parse(user.created_at)).to.not.be.NaN;
        expect(Date.parse(user.updated_at)).to.not.be.NaN;
      });
  });

  it("should work with the compose helper", () => {
    class User extends compose(timestampPlugin())(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }

    return User
      .query(knex)
      .insert({ firstName: "user" })
      .then((user) => {
        expect(Date.parse(user.created_at)).to.not.be.NaN;
        expect(Date.parse(user.updated_at)).to.not.be.NaN;
      });
  });

  it("should modify the `created_at` and `updated_at` columns automatically on insert", () => {
    class User extends timestampPlugin()(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }

    return User
      .query(knex)
      .insert({ firstName: "John" })
      .then((john) => {
        expect(Date.parse(john.created_at)).to.not.be.NaN;
        expect(Date.parse(john.updated_at)).to.not.be.NaN;
      });
  });

  it("should not modify the `created_at` and `updated_at` columns automatically on insert if they are provided", () => {
    class User extends timestampPlugin()(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }

    return User
      .query(knex)
      .insert({ firstName: "John", created_at: "foo", updated_at: "bar" })
      .then((john) => {
        expect(john.created_at).to.equal("foo");
        expect(john.updated_at).to.equal("bar");
      });
  });

  it("should modify the `updated_at` column automatically on update", () => {
    class User extends timestampPlugin()(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }

    return User
        .query(knex)
        .insert({firstName: "Jane"})
        .then((jane) => {
          const createdAt = Date.parse(jane.created_at);
          const updatedAt = Date.parse(jane.updated_at);
          expect(createdAt).to.not.be.NaN;
          expect(updatedAt).to.not.be.NaN;
          return jane
                .$query(knex)
                .updateAndFetch({firstName: "Jan"})
                .then((jan) => {
                  expect(Date.parse(jane.updated_at)).to.not.equal(updatedAt);
                  expect(Date.parse(jane.created_at)).to.equal(createdAt);
                });
        });
  });

  it("should not modify the `updated_at` column automatically on update if it is provided", () => {
    class User extends timestampPlugin()(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_at!: string;
      public updated_at!: string;
    }

    return User
        .query(knex)
        .insert({firstName: "Jane"})
        .then((jane) => {
          const createdAt = Date.parse(jane.created_at);
          const updatedAt = Date.parse(jane.updated_at);
          expect(createdAt).to.not.be.NaN;
          expect(updatedAt).to.not.be.NaN;
          return jane
                .$query(knex)
                .updateAndFetch({firstName: "Jan", updated_at: "bar"})
                .then((jan) => {
                  expect(jane.updated_at).to.equal("bar");
                  expect(Date.parse(jane.created_at)).to.equal(createdAt);
                });
        });
  });

  it("should modify the `created_when` and `updated_when` columns on insert/update with utc date string", () => {
    const timeStamp = timestampPlugin({
      createdAt: "created_when",
      updatedAt: "updated_when",
      genDate() {
        return new Date().toUTCString();
      },
    });

    class User extends timeStamp(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_when!: string;
      public updated_when!: string;
    }

    return User
        .query(knex)
        .insert({firstName: "joey"})
        .then((joey) => {
          expect(Date.parse(joey.created_when)).to.not.be.NaN;
          expect(Date.parse(joey.updated_when)).to.not.be.NaN;
        });
  });

  // tslint:disable-next-line:max-line-length
  it("should not modify the `created_when` and `updated_when` columns on insert/update with utc date string if provided", () => {
    const timeStamp = timestampPlugin({
      createdAt: "created_when",
      updatedAt: "updated_when",
      genDate() {
        return new Date().toUTCString();
      },
    });

    class User extends timeStamp(Model) {
      public static tableName = "user";
      public static timestamp = true;
      public firstName!: string;
      public created_when!: string;
      public updated_when!: string;
    }

    return User
        .query(knex)
        .insert({ firstName: "joey", created_when: "foo", updated_when: "bar" })
        .then((joey) => {
          expect(joey.created_when).to.equal("foo");
          expect(joey.updated_when).to.equal("bar");
        });
  });
});
