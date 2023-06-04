// const { createLogger, format:{ combine, timestamp, label, prettyPrint }, transports, config } = require('winston');
// const moment = require('moment'); 
// const path = 'src'
// const format = combine(
//   timestamp(),
//   prettyPrint()
// )

// const getErrorPath = (model)=> path + `/logs/error/${model}/${moment().format('MM-DD-YYYY')}.log`;
// const getLogPath = (model)=> path + `/logs/${model}/${moment().format('MM-DD-YYYY')}.log`
// // const usersLogger = createLogger({

// //   // format: format.combine(
// //   //   format.timestamp({
// //   //     format: 'YYYY-MM-DD HH:mm:ss'
// //   //   }),
// //   // ),
// //   format,
// //   transports: [
// //     new transports.File({
// //       level: 'info',
// //       filename: getLogPath('user'),
// //      }),
// //     new transports.File({
// //       level: 'error',
// //       filename: getErrorPath('user'),
// //     })
// //   ]
// // });





// // module.exports = {
// //   usersLogger: usersLogger
// // };