const handler = function (params) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject(new Error('error 418'))
    }, 500)
  })
}

module.exports = handler
