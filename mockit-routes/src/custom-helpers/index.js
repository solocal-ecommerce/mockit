
module.exports = function helpers(options) {
    options = options || {};
    var hbs = options.handlebars || options.hbs || require('handlebars');
    
    hbs.registerHelper('base64Encode', function (data) {
        let buff = Buffer.from(data);
        return buff.toString('base64');
    });

    hbs.registerHelper('base64Decode', function (data) {
        let buff = Buffer.from(data, 'base64');
        return buff.toString('ascii');
    });

    return hbs.helpers;
  };