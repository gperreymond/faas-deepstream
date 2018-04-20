const uuid = require('uuid')
const util = require('util')
const deepstream = require('deepstream.io-client-js')
const EventEmitter = require('events').EventEmitter

class Stream {
  constructor () {
    // initialize global props
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.debug = require('debug')('faas:stream')
    // initialize deepstream
    this.ds = deepstream('ws://localhost:6020/faas')
    this.ds.on('error', (error) => {
      this.debug('stream on error: %s', error)
      this.ds.close()
    })
    this.ds.on('connectionStateChanged', connectionState => {
      this.debug('connectionStateChanged: %s', connectionState)
      if (connectionState === 'OPEN') { this.emit('connected') }
      if (connectionState === 'CLOSED') { this.emit('closed') }
    })
    // this class is now an event emitter
    EventEmitter.call(this)
  }
  connect () {
    this.ds.login()
  }
}

util.inherits(Stream, EventEmitter)
module.exports = Stream
