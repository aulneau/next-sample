module.exports = {
  plugins: [
    require('postcss-easy-import')({prefix: '_'}), // keep this first
    require('postcss-cssnext')({
      features: {
        customProperties: {
          warnings: false
        }
      }
    })
  ]
};
