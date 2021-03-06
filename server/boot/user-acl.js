'use strict';

module.exports = (app) => {
  const userAcl = [
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'DENY',
    },
    {
      accessType: '*',
      principalType: 'ROLE',
      principalId: 'admin',
      permission: 'ALLOW',
    },
    {
      principalType: 'ROLE',
      principalId: 'admin',
      permission: 'ALLOW',
      property: 'create',
    },
    {
      principalType: 'ROLE',
      principalId: '$owner',
      permission: 'ALLOW',
      property: 'deleteById',
    },
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'ALLOW',
      property: 'login',
    },
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'ALLOW',
      property: 'logout',
    },
    {
      principalType: 'ROLE',
      principalId: '$owner',
      permission: 'ALLOW',
      property: 'findById',
    },
    {
      principalType: 'ROLE',
      principalId: '$owner',
      permission: 'ALLOW',
      property: 'patchAttributes',
    },
    {
      principalType: 'ROLE',
      principalId: '$owner',
      permission: 'ALLOW',
      property: 'replaceById',
    },
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'ALLOW',
      property: 'verify',
      accessType: 'EXECUTE',
    },
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'ALLOW',
      property: 'confirm',
    },
    {
      principalType: 'ROLE',
      principalId: 'doctor',
      permission: 'ALLOW',
      property: 'listNurses',
    },
    {
      accessType: 'EXECUTE',
      principalType: 'ROLE',
      principalId: 'doctor',
      permission: 'ALLOW',
      property: 'getOperations',
    },
    {
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'ALLOW',
      property: 'resetPassword',
      accessType: 'EXECUTE',
    },
    {
      principalType: 'ROLE',
      principalId: '$authenticated',
      permission: 'ALLOW',
      property: 'changePassword',
      accessType: 'EXECUTE',
    },
    {
      principalType: 'ROLE',
      principalId: '$authenticated',
      permission: 'ALLOW',
      property: 'setPassword',
      accessType: 'EXECUTE',
    },
    {
      principalType: 'ROLE',
      principalId: '$owner',
      permission: 'ALLOW',
      property: '__get__operations',
    },
    {
      principalType: 'ROLE',
      principalId: 'doctor',
      permission: 'ALLOW',
      property: '__create__operations',
    },
  ];

  app.models.User.settings.acls = userAcl;
  console.log('User ACL override');
};
