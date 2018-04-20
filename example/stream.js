const Stream = require('../').Stream

const stream = new Stream()
stream.on('closed', () => {
  console.log('stream is closed')
})
stream.on('connected', () => {
  console.log('stream is connected')
})
stream.connect()
