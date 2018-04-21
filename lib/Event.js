class Event {
  constructor (stream) {
    // initialize global props
    this.debug = require('debug')('faas:event')
    this.app = stream
  }
  subscribe (name, handler) {
    this.debug(`subscribe to ${name}`)
    this.name = name
    this.app.ds.event.subscribe(name, handler)
  }
}

module.exports = Event
