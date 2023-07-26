const nodemailer = require("nodemailer");
const config = require("../config/objectConfig");

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      //credenciales del que utiliza el servicio
      user: config.gmailUserApp,
      pass: config.gmailPassApp,
    },
  })


  exports.sendMail = async ( destinatario, asunto, html) => {
    try {
      
        return await transport.sendMail({
        
    from: `Ari test <${config.gmailUserApp}>`,
    //Correo del destinatario
    to: `${destinatario}`,
    subject: asunto,
    html: html,
    //Enviar archivos
    attachments: [{
      filename: 'Doom_Wallpaper.jpg',
      path: './src/public/img/Doom_Wallpaper.jpg',
      cid: 'DoomWallpaper'
    }]
  });
    } catch (error) {
        throw new Error(error)
    }
   
  }




