const { Router } = require("express");
const { SessionsRouter } = require("./sessionsRouter");
const sessionsRouter = new SessionsRouter();
const { ViewsRouter } = require("./viewsRouter");
const viewsRouter = new ViewsRouter();
const { ProductRouter } = require("./productRouter");
const productRouter = new ProductRouter();
const { CartRouter } = require("./cartRouter");
const cartRouter = new CartRouter();
const { RouterPruebas } = require("./pruebasRouter");
const pruebasRouter = new RouterPruebas();
const router = Router();

router.use("/api/sessions", sessionsRouter.getRouter());
router.use("/", viewsRouter.getRouter());
router.use("/pruebas", pruebasRouter.getRouter());
router.use("/api/products", productRouter.getRouter());
router.use("/api/carts", cartRouter.getRouter());

module.exports = router;
