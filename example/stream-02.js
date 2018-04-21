const Stream = require('../').Stream

const stream = new Stream()
stream.on('closed', () => {
  console.log('stream is closed')
})
stream.on('connected', async () => {
  console.log('stream is connected', stream.uuid)
  stream.subscribe(stream.ServiceEventSuccess, (message) => {
    console.log(stream.ServiceEventSuccess, message)
  })
  stream.subscribe(stream.ServiceEventError, (message) => {
    console.log(stream.ServiceEventError, message)
  })
  // request BasicNopeQuery
  try {
    const r1 = await stream.request('BasicResolveService', {}).catch(err => { throw err })
    console.log('result', r1)
    const r2 = await stream.request('BasicRejectService', {}).catch(err => { throw err })
    console.log('result', r2)
  } catch (e) {
    console.log('e', e)
  }
})
stream.connect()
