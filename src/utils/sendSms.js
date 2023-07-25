const twilio = require('twilio')
const config = require('../config/objectConfig')

const twilioSid =config.twilioAccountSid
const twilioAuthToken=config.twilioAuthToken
const twilioPhoneNumber=config.twilioPhoneNumber

const cliente = twilio(twilioSid, twilioAuthToken)

exports.sendSms= () =>cliente.messages.create({
    body: 'body del sms',
    from: twilioPhoneNumber,
    to: config.myPhoneNumber
})


