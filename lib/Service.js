const uuid = require('uuid')

class Service {
  constructor (stream) {
    // initialize global props
    this.uuid = uuid.v4()
    this.debug = require('debug')('faas:service')
    this.app = stream
  }
  register (name, handler) {
    this.debug(`${name} is registered`)
    this.name = name
    this.app.handlers[name] = handler
    this.app.ds.rpc.provide(name, async (params, res) => {
      this.debug(`${name} is called`)
      try {
        const result = await this.app.handlers[name](params).catch(err => { throw err })
        this.debug(`${name} event success`)
        this.app.ds.event.emit(this.app.ServiceEventSuccess, {name: this.name})
        res.send(result)
      } catch (e) {
        this.debug(`${name} event error`)
        this.app.ds.event.emit(this.app.ServiceEventError, {name: this.name})
        res.error(e)
      }
    })
  }
}

module.exports = Service
