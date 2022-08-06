// inspiration https://joi.dev/api/?v=17.6.0
// https://github.com/jquense/yup
// https://github.com/guillaumepotier/validator.js
// https://validator-fns.smonn.se/

// Philosophy
// no external dependencies
// typescript support
// lightweight
// simple to understand - API will guide you
// only functions + data = you already know it

function createSchema(schema) {
  return schema;
}

function required(message) {
  return (value) => {
    if (value === null || value === undefined) {
      return message;
    }
  };
}

const isString = (v) => typeof v === "string" || v instanceof String;

function string(message, config) {
  return (value) => {
    if (!isString(value)) {
      return message;
    }
  };
}

function number(message, config) {
  return (value) => {
    if (!Number.isFinite(value)) {
      return message;
    }
  };
}

function email(message) {
  return (value) => {
    if (!isString(value) || !value.includes("@")) {
      return message;
    }
  };
}

function date(message) {
  return (value) => {
    return message;
  };
}

async function validateSchema(schema, data) {
  let errors = {};

  Object.keys(schema).forEach((key) => {
    let validationFn = schema[key];

    let value = data[key];
    let error = validationFn(value);
    if (error) {
      errors[key] = error;
      return;
    }
    errors[key] = undefined;
  });

  return errors;
}

function boolean(message) {
  return (value) => {
    if (typeof value !== "boolean") {
      return message;
    }
  };
}

test("it works", async () => {
  let userSchema = createSchema({
    name: string("Must provide name", { min: 5, max: 20 }),
    age: number("Age must be between $min and $max", { min: 0, max: 18 }),
    email: email("This is not valid email"),
    createdOn: date("Not a valid date", { min: "now" }),
    isBig: boolean("Must be boolean"),
  });

  const errors = await validateSchema(userSchema, {});

  expect(errors).toEqual({
    name: "Must provide name",
    age: "Age must be between $min and $max",
    email: "This is not valid email",
    createdOn: "Not a valid date",
    isBig: "Must be boolean",
  });
});

test("it works with conditional", async () => {
  let schema = createSchema({
    isBig: boolean("Must be boolean"),
    count: when((v) => v.isBig, {
      then: number("Must be at least 5", { min: 5 }),
      else: number("Must be at least 0", { min: 0 }),
    }),
  });

  const errors = await validateSchema(schema, { isBig: undefined });

  expect(errors).toEqual({
    isBig: "Must be boolean",
  });
});
