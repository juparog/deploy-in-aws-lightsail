module.exports = {
  apps: [
    {
      name: 'helloworld',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        HOST:'#{HOST}#',
        PORT:'#{PORT}#'
      }
    }
  ]
};
