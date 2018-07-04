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

  // Remote methods can be created to add functionality to the API which is not in built
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

  // Remote method to as example of custom response and error handling.
  User.getOperations = (view, options, callback) => {
    const operationModel = User.app.models.operation;
    let currentUser = null;
    if (options) {
      currentUser = options.currentUser;
    }

    if (view === 'mine') {
      // get operations of current user only. throw error in case of admin
      if (currentUser.employee_type === 'admin') {
        // throw some exception 400 bad request
        const error = new Error('Admin does not have any operations as per business logic');
        error.status = 400;
        return callback(error);
      }

      const result = {};
      operationModel.find({
        where: {
          userId: currentUser.id,
        },
      }, (err, operations) => {
        if (err) throw err;
        if (operations) {
          result.operations = operations;
          callback(null, result);
        }
      });
    } else if (view === 'all') {
      // get operations of all users with mine flag set if operation is of current user.
      const result = {};
      operationModel.find({}, (err, operations) => {
        if (err) throw err;
        if (operations) {
          result.operations = operations;
          result.operations = result.operations.map(op => {
            if (op.userId.toString() == currentUser.id.toString()) {
              return {...op.__data, mine: true};
            }
            else {
              return {...op.__data, mine: false};
            }
          });
          callback(null, result);
        }
      });
    } else {
      // throw bad request
      const error = new Error("invalid value for view attribute");
      error.status = 400;
      return callback(error);
    }
  };

  User.remoteMethod('getOperations', {
    http: {
      path: '/ops',
      verb: 'get',
    },
    accepts: [
      {arg: 'view', type: 'string', required: true},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    returns: {
      type: 'object', root: true,
    },
  });
  
  // adding currentUser information to context before remote method
  User.beforeRemote('getOperations', (ctx, unused, next) => {
    if (!ctx.args.options.accessToken) return next();
    const userModel = User.app.models.User;
    userModel
    .findById(ctx.args.options.accessToken.userId, 
      (err, user) => {
      if (err) return next(err);
      ctx.args.options.currentUser = user;
      next();
    });
  });

};
