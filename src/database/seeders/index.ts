import AppDataSource from "../../config/db.config";

const runSeeders = async () => {
    try {
        // Only initialize if not already initialized
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connection established');
        }

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
}

runSeeders();