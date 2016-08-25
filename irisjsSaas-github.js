var Client = require("github");
var client;
  
  
  
function github(options){
  
   client = new Client();
  
   client.authenticate({
     type: options.type || "oauth",
     token: options.token
   });
    
};
/*
 * for the list of available parameters please check the following link
 * 
 * https://github.com/mikedeboer/node-github/blob/master/doc/apidoc.js
 */
github.prototype.createRepository = function(parameters,cb){
    
  if (parameters === undefined) {
        parameters = {};
  }
    
  client.repos.create(parameters,cb);

};

github.prototype.cloneTemplateRepository = function(parameters,cb){
    
  if (parameters === undefined) {
        parameters = {};
  }
    
  client.repos.fork(parameters,cb);

};

module.exports = github;