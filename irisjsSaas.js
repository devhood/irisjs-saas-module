
var GitFactory = require("./irisjsSaas-factory");

iris.modules.irisjsSaas.registerHook("hook_entity_updated", 0, function (thisHook, data) {
  
  if(data && data.githubaccesstoken){
    
    var userQuery = {
         entities: ['user'],
         queries: [{
            field: 'eid',
            operator: 'IS',
            value: data.eid
         }]
    };
          
    iris.invokeHook("hook_entity_fetch", "root", null, userQuery).then(function (entities) {

        if(entities.length && (!entities[0].repositoryurl || !entities[0].workspace)){
          
          var Git = new GitFactory("github");
          var git = new Git({token:data.githubaccesstoken});

          git.cloneTemplateRepository({user:'devhood',repo:'iris-saas-template'},function(err,result){
            if(err){
              
              iris.log("error", err);
              thisHook.fail(err);
              
            }
            else{
              
              var userEntity = {
                "entityType": "user",
                "eid": data.eid,
                "repositoryurl" : result.clone_url,
                "workspace" : iris.sitePath  + '/' +result.full_name + '/' + "current",
              };
              
              if(data.git && data.git.length){
                userEntity.git = data.git;
                userEntity.git[0].gitpath = userEntity.workspace;
              }
              else{
                userEntity.git = [];
                userEntity.git.push({
                  gitpath : userEntity.workspace
                });
              }
              iris.invokeHook("hook_entity_edit", "root", null, userEntity);
              
              var cloneinfo = {
                "repositoryurl" : userEntity.repositoryurl,
                "workspace" : userEntity.workspace,
                "githubaccesstoken" : data.githubaccesstoken,
              };
              
              git.cloneRepository(cloneinfo,function(err,repo){
                if(err){
                  thisHook.pass(err);   
                }
                else{
                  thisHook.pass(data);    
                }
                
              });
              
            }
          });

        }
        else{
          
        }
    }, function (fail) {
                    
       iris.log("error", fails);
       res.redirect('/admin');
                  
    });
    

  }


});



process.on("dbReady", function(){
   
  if (iris.modules.irisjsSaas) {

    var schema = iris.entityTypes['user'];

    if ((Object.keys(schema.fields).indexOf('repositoryurl') <= 0) || (Object.keys(schema.fields).indexOf('workspace') <= 0)) {

      schema.fields.repositoryurl = {
        "description": "iris site repository url",
          "fieldType": "Textfield",
          "label": "Git URL",
          "machineName": "repositoryurl",
          "permissions": [],
          "required": false,
          "unique": false
      };
      
      schema.fields.workspace = {
        "description": "iris site workspace directory url",
          "fieldType": "Textfield",
          "label": "Workspace Directory",
          "machineName": "workspace",
          "permissions": [],
          "required": false,
          "unique": false
      };

      iris.saveConfig(schema, "entity", 'user', function (data) {

      });

    }


  }
  
});

