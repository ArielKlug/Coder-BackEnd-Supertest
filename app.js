const { cpus } = require("os");
const cluster = require("cluster");
const { initServer } = require("./src/server")
const { logger } = require('./src/config/logger')


const numeroDeProcesadores = cpus().length


if (cluster.isPrimary) {
    logger.info('Proceso primario, generando processo trabajador')
    for (let i = 0; i < numeroDeProcesadores; i++) {
            //cluster.fork()
    }
    cluster.on('message', worker => {
        logger.info(`El worker ${worker.process.id} dice ${worker.message}`)
    })
} else {
    logger.info('al no ser un proceso forkeado, no cuento como primario por lo tanto isPrimari en false, soy un worker')
    initServer()
}

