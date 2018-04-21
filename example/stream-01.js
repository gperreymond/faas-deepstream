const path = require('path')
const Stream = require('../').Stream

const stream = new Stream()
stream.subscribe(stream.ServiceEventSuccess, (message) => {
  console.log(stream.ServiceEventSuccess, message)
})
stream.subscribe(stream.ServiceEventError, (message) => {
  console.log(stream.ServiceEventError, message)
})
stream.register(path.resolve(__dirname, './services/basic/resolve'))
stream.register(path.resolve(__dirname, './services/basic/reject'))
stream.on('closed', () => {
  console.log('stream is closed')
})
stream.on('connected', () => {
  console.log('stream is connected', stream.uuid)
})
stream.connect()
