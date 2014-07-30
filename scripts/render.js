var mcss = require('mcss');


var renderer = function(data, options, callback){
  var config = hexo.config.mcss || {};

  var instance = mcss({
      filename: data.path
  }).translate(data.text).done(function(text){
    callback(null, text);
  }).fail(function(err){
    console.log(err)
  })
};

hexo.extend.renderer.register('mcss', 'css', renderer);
