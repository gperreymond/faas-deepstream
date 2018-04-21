const uuid = require('uuid')
const util = require('util')
const deepstream = require('deepstream.io-client-js')
const EventEmitter = require('events').EventEmitter

const STREAM_GET_USERS_INTERVAL_TIME = 250

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
    // connections
    this.ds.on('connectionStateChanged', connectionState => {
      this.debug('connectionStateChanged: %s', connectionState)
      if (connectionState === 'OPEN') {
        this.emit('connected')
        this.getUsers()
      }
      if (connectionState === 'CLOSED') { this.emit('closed') }
    })
    // this class is now an event emitter
    EventEmitter.call(this)
  }
  connect () {
    this.ds.login({username: this.uuid})
  }
  getUsers () {
    setTimeout(() => {
      this.ds.presence.getAll(users => {
        console.log(users)
        this.getUsers()
      })
    }, STREAM_GET_USERS_INTERVAL_TIME)
  }
}

util.inherits(Stream, EventEmitter)
module.exports = Stream
