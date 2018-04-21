const Stream = require('../').Stream

const stream = new Stream()
stream.on('closed', () => {
  console.log('stream is closed')
})
stream.on('connected', async () => {
  console.log('stream is connected', stream.uuid)
  stream.subscribe(stream.ServiceEventError, (name, message) => {
    console.log(stream.ServiceEventError, name)
  })
  // request BasicNopeQuery
  try {
    const r1 = await stream.request('BasicResolveQuery', {}).catch(err => { throw err })
    console.log('result', r1)
    const r2 = await stream.request('BasicRejectQuery', {}).catch(err => { throw err })
    console.log('result', r2)
  } catch (e) {
    console.log('e', e)
  }
})
stream.connect()
