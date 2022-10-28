import { User, Permission, Role } from '../db/models';
import config from '../env.config';
import routesList from 'express-list-endpoints';

export const autoAddPermission = async(app) => {
  const routes = routesList(app);

  if (!routes) return false;

  try {
    const rootUser = await User.findOne({
      include: [{
        model: Role,
        as: 'role'
      }],
      where: { username: 'root' },
      raw: false,
    });

    if (!rootUser) return false;

    const result = [];

    routes.map(route => {
      if (!route) return false;

      const methods = route.methods.map((method) => {
        method = method.toLowerCase();

        const path = route.path.replace(config.API_PREFIX, '').split('/')[2];
        const permissionName = { name: `${path}_${method}`, created_by: rootUser.id };

        if (!result.find(v => v.name === permissionName.name)) {
          result.push(permissionName);
        }

      });

      return methods;
    });

    const role = rootUser.role;

    if (result.length > 0) {
      const permissions = await Permission.bulkCreate(result, { ignoreDuplicates: true });

      for(let permission of permissions) {
        if (permission.id) {
          await role.addPermission(permission);
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
  
}

export default autoAddPermission;