import AppDataSource from '../../config/db.config';
import { MenuSeeders } from './MenuSeeders';
import { PermissionSeeders } from './PermissionSeeders';
import { RoleMenuPermissionSeeder } from './RoleMenuPermissionSeeder';
import { RoleSeeders } from './RoleSeeders';
import { UserSeeders } from './UserSeeders';

const runSeeders = async () => {
  try {
    // Only initialize if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }

    /** Role */
    console.log('Seeding master roles running....');
    await RoleSeeders();
    console.log('Seeding master roles successfully');

    /** User */
    console.log('Seeding master users running....');
    await UserSeeders();
    console.log('Seeding master users successfully');

    /** Menu */
    console.log('Seeding master menu running....');
    await MenuSeeders();
    console.log('Seeding master menu successfully');

    /** Menu */
    console.log('Seeding master permission running....');
    await PermissionSeeders();
    console.log('Seeding master permission successfully');

    /** RoleMenuPermission */
    console.log('Seeding role menu permission running....');
    await RoleMenuPermissionSeeder();
    console.log('Seeding role menu permission successfully');

    /**
     * REGISTER FUNCTION SEEDER IN HERE
     */

    // Close the connection if we initialized it
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    // Close the connection if it's open
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    // Exit with error
    process.exit(1);
  }
};

runSeeders();
