const chai = require("chai");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../src/config/objectConfig");
const { beforeEach } = require("mocha");

const expect = chai.expect;
//URL BASE
const requester = supertest("http://localhost:8080");

describe("testing mercadito tio ari", () => {
  let cookieAuth;
  let adminCookie;
  let adminEmail = "FedePro@gmail.com";
  let userEmail = "UserMock@gmail.com";
  let firstPassword = "123321";

  let newUserCartId;
  let idNewuser;
  let idProduct;
  let titleProduct;
  describe("Test de sessions", () => {
    let emailCookie;

    let idToDelete;
    beforeEach(function () {
      this.timeout(5000);
    });
    it("El endpoint de Post /api/sessions/register debe crear un usuario correctamente", async () => {
      const userMock = {
        first_name: "user",
        last_name: "Mock",
        age: 232,
        email: userEmail,
        password: firstPassword,
      };
      const result = await requester
        .post("/api/sessions/register")
        .send(userMock);
      expect(result._body.payload.email).to.be.equal(userMock.email);
      expect(result._body.payload.first_name).to.be.equal(userMock.first_name);
      expect(result._body.payload).to.have.property("cartId");
      expect(result._body.payload).to.have.property("role");
      expect(result.statusCode).to.be.equal(200);
      expect(result.ok).to.be.ok;
    });
    it("El endpoint de post /api/sessions/login debe loggear al usuario correctamente", async () => {
      const userLoginMock = {
        email: userEmail,
        password: firstPassword,
      };
      const result = await requester
        .post("/api/sessions/login")
        .send(userLoginMock);
      const cookieResult = result.headers["set-cookie"][0];

      const token = cookieResult.split("=")[1];
      //El token de la cookieResult siempre queda con " ; Max-Age" después del token,
      //por eso el segundo split en el value
      cookieAuth = {
        name: cookieResult.split("=")[0],
        value: token.split(";", 1)[0],
      };

      const userFromToken = jwt.verify(cookieAuth.value, JWT_PRIVATE_KEY);
      expect(cookieAuth.name).to.be.ok.and.eql("coderCookie");
      expect(userFromToken).to.be.ok;
      expect(userFromToken.user.email).to.be.deep.equal(userLoginMock.email);
      expect(result.statusCode).to.be.equal(302);
    });
    it(`El servicio envía un Email al usuario registrado seteando una cookie para poder restablecer su contraseña,
    el envío del email está comentado ya que da un error de timeout aunque el email sí se mande`, (done) => {
      const emailMock = { email: userEmail };
      requester
        .post("/api/sessions/emailRestorePass")
        .send(emailMock)
        .end(async (err, result) => {
          if (err) return done(err);

          const cookieResult = result.headers["set-cookie"][0];
          const token = cookieResult.split("=")[1];
          emailCookie = {
            name: cookieResult.split("=")[0],
            value: token.split(";", 1)[0],
          };

          try {
            const userFromToken = jwt.verify(
              emailCookie.value,
              JWT_PRIVATE_KEY
            );
            expect(emailCookie.name).to.be.ok.and.eql("emailCookie");
            expect(userFromToken).to.be.ok;
            expect(userFromToken.user.email).to.be.equal(emailMock.email);
            expect(result.statusCode).to.be.equal(302);

            done();
          } catch (error) {
            done(error);
          }
        });
    });
    it("El servicio restablece la contraseña por una nueva", (done) => {
      const reqBodyMock = {
        email: userEmail,
        newPassword: "asfasasdfgsadg",
        confirmPassword: "asfasasdfgsadg",
      };

      requester
        .post("/api/sessions/restorePass")
        .send(reqBodyMock)
        .set("Cookie", [`${emailCookie.name}=${emailCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result).to.be.ok;
          expect(result._body.status).to.be.equal("success");
          expect(result._body.message).to.be.equal(
            "Contraseña actualizada correctamente"
          );
          expect(result.statusCode).to.be.equal(200);
          done();
        });
    });
    it("El servicio se loggea como admin", (done) => {
      const adminMock = {
        email: adminEmail,
        password: firstPassword,
      };
      requester
        .post("/api/sessions/login")
        .send(adminMock)
        .end((err, result) => {
          if (err) return done(err);
          const cookieResult = result.headers["set-cookie"][0];
          const token = cookieResult.split("=")[1];
          adminCookie = {
            name: cookieResult.split("=")[0],
            value: token.split(";", 1)[0],
          };

          done();
        });
    });
    it("El servicio trae todos los usuarios y guarda el Id del último", (done) => {
      requester
        .get("/api/sessions/users")
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          idToDelete =
            result._body.payload[result._body.payload.length - 1]._id;

          expect(result._body).to.have.property("payload");
          expect(result._body).to.have.property("status");
          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload).to.be.an("array");
          done();
        });
    });
    it("El servicio trae 1 usuario", (done) => {
      const uid = idToDelete;

      requester
        .get(`/api/sessions/users/${uid}`)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);
          expect(result._body).to.have.property("payload");
          expect(result._body).to.have.property("status");
          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload).to.be.an("object");
          expect(result._body.payload).to.have.property("_id");
          expect(result._body.payload._id).to.be.equal(idToDelete);
          done();
        });
    });
    it("El servicio elimina el usuario creado", (done) => {
      const uid = idToDelete;
      requester
        .delete(`/api/sessions/users/${uid}`)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);
          expect(result._body).to.have.property("message");
          expect(result._body).to.have.property("status");
          expect(result._body.status).to.be.equal("success");
          expect(result._body.message).to.be.equal(
            "Usuario eliminado correctamente"
          );

          done();
        });
    });
  });
  describe("Test de products", () => {
    before((done) => {
      const userMock = {
        first_name: "user",
        last_name: "Mock2",
        age: 232,
        email: userEmail,
        password: firstPassword,
      };

      // Primera solicitud: Registro de usuario
      requester
        .post("/api/sessions/register")
        .send(userMock)
        .end((err, result) => {
          if (err) return done(err);

          idNewuser = result._body.payload._id;
          newUserCartId = result._body.payload.cartId;

          const userLoginMock = {
            email: userEmail,
            password: firstPassword,
          };

          // Segunda solicitud: Inicio de sesión del usuario registrado
          requester
            .post("/api/sessions/login")
            .send(userLoginMock)
            .end((err, result) => {
              if (err) return done(err);

              const cookieResult = result.headers["set-cookie"][0];

              const token = cookieResult.split("=")[1];
              // El token de la cookieResult siempre queda con " ; Max-Age" después del token,
              // por eso el segundo split en el value
              cookieAuth = {
                name: cookieResult.split("=")[0],
                value: token.split(";", 1)[0],
              };

              done();
            });
        });
    });

    it("El servicio crea un producto", (done) => {
      const productMock = {
        title: "MockProd",
        description: "Mock of a product",
        price: 1000,
        thumbnail: "s",
        code: "asfsgrgesyheasdtfh",
        stock: 50,
        category: "Mocks",
      };

      requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          idProduct = result._body.payload._id;
          titleProduct = result._body.payload.title;

          expect(result._body).to.have.property("status");
          expect(result._body).to.have.property("payload");
          expect(result._body.payload).to.have.property("_id");
          expect(result._body.payload.title).to.be.equal(productMock.title);
          expect(result._body.payload.description).to.be.equal(
            productMock.description
          );
          expect(result.statusCode).to.be.equal(200);
          done();
        });
    });
    it("El servicio debe traer todos los productos", (done) => {
      requester
        .get("/api/products")
        .set("Cookie", [`${cookieAuth.name}=${cookieAuth.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result.statusCode).to.be.equal(200);
          expect(result.text).to.include(
            '<a href="/api/sessions/logout"><button>Lougout</button></a>'
          );
          expect(result.text).to.include("<li>");
          expect(result.text).to.include(
            '<button type="submit">Agregar al carrito</button>'
          );
          expect(result.text).to.include(`<h2>${titleProduct}</h2>`);
          expect(result.text).to.include(
            `action="/api/carts/${newUserCartId}/products/${idProduct}"`
          );
          expect(result.text).to.include(
            '<button type="submit">Agregar al carrito</button>'
          );

          done();
        });
    });
    it("El servicio trae 1 producto", (done) => {
      requester
        .get(`/api/products/${idProduct}`)
        .set("Cookie", [`${cookieAuth.name}=${cookieAuth.value}`])
        .end((err, result) => {
          if (err) return done(err);
          expect(result._body.payload._id).to.be.equal(idProduct);
          expect(result._body.payload).to.be.an("object");
          expect(result._body.payload.title).to.be.equal(titleProduct);
          expect(result.statusCode).to.be.equal(200);
          done();
        });
    });
    it("El servicio actualiza un producto", (done) => {
      const updateProduct = {
        title: "MockProdUpdate",
        description: "Mock of a product",
        price: 1000,
        thumbnail: "s",
        code: "asfsgrgesyheasasfafdtfh",
        stock: 50,
        category: "Mocks",
      };
      requester
        .put(`/api/products/${idProduct}`)
        .send(updateProduct)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload.acknowledged).to.be.equal(true);
          expect(result._body.payload.modifiedCount).to.be.equal(1);
          expect(result.statusCode).to.be.equal(200);
          done();
        });
    });
    it("El servicio elimina un producto", (done) => {
      requester
        .delete(`/api/products/${idProduct}`)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload.acknowledged).to.be.equal(true);
          expect(result._body.payload.deletedCount).to.be.equal(1);
          expect(result.statusCode).to.be.equal(200);
          done();
        });
    });
  });
  describe("Test de carts", () => {
    before((done) => {
      const productMock = {
        title: "MockProd",
        description: "Mock of a product",
        price: 1000,
        thumbnail: "s",
        code: "asfsgrgesyheasdtfh",
        stock: 50,
        category: "Mocks",
      };

      requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          idProduct = result._body.payload._id;
          titleProduct = result._body.payload.title;
          done();
        });
    });
    it("El servicio trae todos los carritos", (done) => {
      requester
        .get("/api/carts")
        .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload).to.be.an("array");
          expect(result._body.payload[0]).to.have.property("_id");
          expect(result._body.payload[0]).to.have.property("products");
          expect(result._body.payload[0]).to.have.property("userId");
          done();
        });
    });
    it("El servicio añade un producto al carrito", (done) => {
      requester
        .post(`/api/carts/${newUserCartId}/products/${idProduct}`)
        .set("Cookie", [`${cookieAuth.name}=${cookieAuth.value}`])
        .end((err, result) => {
          if (err) return done(err);

          expect(result._body.status).to.be.equal("success");
          expect(result._body.payload).to.have.property("_id");
          expect(result._body.payload).to.have.property("products");
          expect(result._body.payload.products[0]).to.have.property("product");
          expect(result._body.payload.products[0]).to.have.property("_id");
          expect(result._body.payload.products[0]).to.have.property("quantity");
          expect(result._body.payload.products[0].product._id).to.be.equal(
            idProduct
          );

          done();
        });
    });
    it("El servicio trae 1 solo carrito", (done) => {
      requester
        .get(`/api/carts/${newUserCartId}`)
        .set("Cookie", [`${cookieAuth.name}=${cookieAuth.value}`])
        .end((err, result) => {
          if (err) return done(err);

         
          expect(result.text).to.include(`<li>`);
          expect(result.text).to.include(
            `<p><span style="color: rgb(255, 0, 0);">${titleProduct}</span></p>`
          );
          expect(result.statusCode).to.be.equal(200)
          
          done();
        });
    });
    it('El servicio elimina 1 producto del carrito', (done) =>{
      requester
        .delete(`/api/carts/${newUserCartId}/products/${idProduct}`)
        .set("Cookie", [`${cookieAuth.name}=${cookieAuth.value}`])
        .end((err, result) => {
          if (err) return done(err);


          expect(result._body.status).to.be.equal('success')
          expect(result._body.payload).to.have.property('products')
          expect(result._body.payload.products).to.be.an('array')
          expect(result._body.payload.products).to.not.deep.include({ _id: idProduct })

          done()
        })
    })
  });
});
