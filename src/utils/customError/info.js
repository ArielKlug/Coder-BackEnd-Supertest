exports.generateProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    Product requirements list:
        * title: neesd to be a String, received ${product.title} 
        * description: neesd to be a String, received ${product.description} 
        * price: neesd to be a Number, received ${product.price} 
        * thumbnail: neesd to be a String, received ${product.thumbnail}
        * code: neesd to be a String, received ${product.code}
        * stock: neesd to be a Number, received ${product.stock} 
        * category: neesd to be a String, received ${product.category} `;
};
