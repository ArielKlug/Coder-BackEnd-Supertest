const { faker } = require("@faker-js/faker");



exports.generateProducts = () => {
  
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.url(),
    code: faker.database.mongodbObjectId(),
    stock: faker.string.numeric(),
    category: faker.commerce.department(),
  }
  
};
