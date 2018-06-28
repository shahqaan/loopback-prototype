'use strict';

module.exports = function(app) {
  const User = app.models.user;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  // Create Roles
  const roles = [
    'doctor',
    'nurse',
    'admin',
  ];

  Role.find({}, (err, roles) => {
    if (roles.length === 0) {
      Role.create([
        {name: 'doctor'},
        {name: 'nurse'},
        {name: 'admin'},
      ],
      (err, roles) => {
        if (err) throw err;
        roles.forEach(role => {
          console.log('role created: ' + role);
        });
      });
    } else {
      roles.forEach(role => {
        Role.findOne({name: role}, (err, foundRole) => {
          if (!foundRole) {
            Role.create({name: role}, (roleErr, createdRole) => {
              console.log('Created Role: ' + createdRole);
            });
          }
        });
      });
    }
  });

  // Check admin user existence
  const adminUser = {
    username: 'admin',
    email: 'admin@domain.com',
    password: 'admin',
    'employee_type': 'admin',
  };

  User.find({where: {'employee_type': 'admin'}}, (err, admUser) => {
    if (admUser.length === 0) {
      User.create(adminUser, (err, user) => {
        if (err) throw err;
        console.log('User Created...' + user.id);
        Role.findOne({name: 'admin'}, (err, role) => {
          if (err) throw err;
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id,
          }, (err, principal) => {
            if (err) throw err;
            console.log('Created principal:', principal);
          });
        });
      });
    } else {
      console.log('Admin found. Skipping Admin creation..');
    }
  });
};
