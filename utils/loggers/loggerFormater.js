const {  format:{ combine, timestamp, prettyPrint }} = require('winston');
const format = combine(
    timestamp(),
    prettyPrint()
  )

module.exports = {format}