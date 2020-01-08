const path = require('path');
module.exports = {
  client: 'oracledb',
  connection: {
    host: '192.168.56.101:1521',
    user: 'retailDW',
    password: 'retailDW',
    database: 'retaildatawarehouse'
  },
  debug: true,
  fetchAsString: ['number', 'clob'],
  migrations: {
    tableName: 'migrations',
    directory: path.resolve(__dirname, './migrations'),
  },
  useNullAsDefault: false
};