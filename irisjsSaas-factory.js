/*
 * repo e.g. github or bitbucket
 */
var nodegit = require('nodegit');

module.exports = function GitFactory(repo){
  var git = require("./irisjsSaas-" + repo);
  
  git.prototype.cloneRepository = function(parameters,cb){
    if(parameters.repositoryurl && parameters.githubaccesstoken){
      
      var cloneOptions = {};
      
      cloneOptions.fetchOpts = {
        callbacks: {
          certificateCheck: function() { return 1; },
          credentials: function() {
            return nodegit.Cred.userpassPlaintextNew(parameters.githubaccesstoken, "x-oauth-basic");
          }
        }
      };

      var cloneRepository = nodegit.Clone(parameters.repositoryurl, parameters.workspace, cloneOptions);
      
      cb(null,cloneRepository);
    }
    else{
      cb({"message":"repository url and access token is required"});
    }
  };
  
  return git;
}