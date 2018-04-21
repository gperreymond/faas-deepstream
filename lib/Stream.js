const uuid = require('uuid')
const util = require('util')
const deepstream = require('deepstream.io-client-js')
const EventEmitter = require('events').EventEmitter

const Event = require('./Event')
const Service = require('./Service')

const STREAM_GET_USERS_INTERVAL_TIME = 250

class Stream {
  constructor () {
    // internal constants
    this.ServiceEventSuccess = 'service-event-success'
    this.ServiceEventError = 'service-event-error'
    // initialize global props
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.debug = require('debug')('faas:stream')
    this.streams = []
    this.handlers = {}
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
  subscribe (eventname, handler) {
    const event = new Event(this)
    event.subscribe(eventname, handler)
  }
  register (filepath) {
    // register service as rpc
    const service = new Service(this)
    service.register(filepath)
  }
  request (name, data) {
    // request for a service is called
    this.debug(`service ${name} is requested (start)`)
    return new Promise((resolve, reject) => {
      this.ds.rpc.make(name, data, (err, result) => {
        this.debug(`service ${name} is requested (finish)`)
        if (err) { return reject(err) }
        resolve(result)
      })
    })
  }
  getUsers () {
    setTimeout(() => {
      this.ds.presence.getAll(users => {
        this.streams = users
        this.getUsers()
      })
    }, STREAM_GET_USERS_INTERVAL_TIME)
  }
}

util.inherits(Stream, EventEmitter)
module.exports = Stream
