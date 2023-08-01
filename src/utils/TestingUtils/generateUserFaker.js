const { faker } = require("@faker-js/faker");

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.string.numeric(),
        description: faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        image:faker.image.url()
    }
};

exports.generateUser = () => {
  let numOfProducts = parseInt(
    faker.string.numeric(1, { bannedDigits: ["0"] })
  );
  let products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProducts());
  }
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    sex: faker.person.sex(),
    birth_date: faker.date.birthdate(),
    products
  }
};
