const uuid = require('uuid')

class Service {
  constructor () {
    // initialize global props
    this.uuid = uuid.v4()
  }
}

module.exports = Service
