import MainRoutes from '../config/routes.config';
import RouteHealtCheck from './routeHealtCheck';

// Routes
import { authMiddleware } from '../app/middlewares/auth.middleware';
import AuthRouter from '../app/modules/auth';
import FileRouter from '../app/modules/files';
import MenuRouter from '../app/modules/menu';
import RoleRouter from '../app/modules/roles';
import UserRouter from '../app/modules/users';

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck);
    this.router.use(`${tagVersionOne}/auth`, AuthRouter);
    this.router.use(`${tagVersionOne}/users`, authMiddleware, UserRouter);
    this.router.use(`${tagVersionOne}/roles`, authMiddleware, RoleRouter);
    this.router.use(`${tagVersionOne}/menu`, authMiddleware, MenuRouter);
    this.router.use(`${tagVersionOne}/files`, FileRouter);
  }
}

export default new RouteApplication().router;
