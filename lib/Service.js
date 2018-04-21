const uuid = require('uuid')

class Service {
  constructor (stream) {
    // initialize global props
    this.uuid = uuid.v4()
    this.debug = require('debug')('faas:service')
    this.app = stream
  }
  register (filepath) {
    const service = require(filepath)
    this.debug(`${service.name} is registered`)
    this.name = service.name
    this.app.handlers[service.name] = service.handler
    this.app.ds.rpc.provide(service.name, async (params, res) => {
      this.debug(`${service.name} is called`)
      const starttime = Date.now()
      let event = { name: this.name }
      try {
        const result = await this.app.handlers[service.name](params).catch(err => { throw err })
        this.debug(`${service.name} event success`)
        event.exectime = Date.now() - starttime
        this.app.ds.event.emit(this.app.ServiceEventSuccess, event)
        res.send(result)
      } catch (e) {
        this.debug(`${service.name} event error`)
        event.exectime = Date.now() - starttime
        this.app.ds.event.emit(this.app.ServiceEventError, event)
        res.error(e)
      }
    })
  }
}

module.exports = Service
