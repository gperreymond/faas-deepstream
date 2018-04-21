const path = require('path')
const Stream = require('../').Stream

const stream = new Stream()
stream.subscribe(stream.ServiceEventSuccess, (name, message) => {
  console.log(stream.ServiceEventSuccess, name)
})
stream.subscribe(stream.ServiceEventError, (name, message) => {
  console.log(stream.ServiceEventError, name)
})
stream.register(path.resolve(__dirname, './files/BasicRejectQuery'))
stream.register(path.resolve(__dirname, './files/BasicResolveQuery'))
stream.on('closed', () => {
  console.log('stream is closed')
})
stream.on('connected', () => {
  console.log('stream is connected', stream.uuid)
})
stream.connect()
