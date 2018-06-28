'use strict';

module.exports = function(User) {
 /**
  * Model specific code goes here. All business logic
  * related to the model like remoteMethods will be defined here
  */

  // control hooks can be used to add customized business logic to default methods
  User.observe('after save', (ctx, next) => {
    const Role = User.app.models.Role;
    const RoleMapping = User.app.models.RoleMapping;
    if (ctx.instance) {
      Role.findOne({
        where: {
          name: ctx.instance.employee_type,
        },
      }, (err, role) => {
        if (err) throw err;
        if (role) {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: ctx.instance.id,
          }, function(err, principal) {
            if (err) throw err;
          });
        }
      });
    }
    next();
  });

  /**
    Remote methods can be created to add functionality to the API which is not in built
    TODO: take a parameter which doesn't exist in a model and make a validation check on it
    TODO: return error if it doesn't exist or doesn't contain an expected value
   */
  User.listNurses = callBack => {
    const userModel = User.app.models.user;
    userModel.find({where: {'employee_type': 'nurse'}}, callBack);
  };

  User.remoteMethod('listNurses', {
    returns: {
      arg: 'users',
      type: 'array',
    },
    http: {
      path: '/nurses',
      verb: 'get',
    },
  });
};
