const handler = function (params) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({data: true})
    }, 1000)
  })
}

module.exports = {
  name: 'BasicResolveService',
  handler
}
