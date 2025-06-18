import MainRoutes from '../config/routes.config';
import RouteHealtCheck from './routeHealtCheck';

// Routes
import { authMiddleware } from '../app/middlewares/auth.middleware';
import AuthRouter from '../app/modules/auth';
import FileRouter from '../app/modules/files';
import HistoryTryoutRouter from '../app/modules/history-tryout';
import MenuRouter from '../app/modules/menu';
import OrganizationRouter from '../app/modules/organization';
import PermissionRouter from '../app/modules/permissions';
import RoleRouter from '../app/modules/roles';
import TryoutCategoryRouter from '../app/modules/tryout-category';
import TryoutDetailRouter from '../app/modules/tryout-details';
import TryoutPackageRouter from '../app/modules/tryout-package';
import TryoutStageRouter from '../app/modules/tryout-stage';
import UserRouter from '../app/modules/users';

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck);
    this.router.use(`${tagVersionOne}/auth`, AuthRouter);
    this.router.use(`${tagVersionOne}/users`, authMiddleware, UserRouter);
    this.router.use(`${tagVersionOne}/roles`, authMiddleware, RoleRouter);
    this.router.use(`${tagVersionOne}/menu`, authMiddleware, MenuRouter);
    this.router.use(`${tagVersionOne}/permissions`, authMiddleware, PermissionRouter);
    this.router.use(`${tagVersionOne}/files`, FileRouter);
    this.router.use(`${tagVersionOne}/organizations`, authMiddleware, OrganizationRouter);

    this.router.use(`${tagVersionOne}/tryout-categories`, authMiddleware, TryoutCategoryRouter);

    this.router.use(`${tagVersionOne}/tryout-stages`, authMiddleware, TryoutStageRouter);

    this.router.use(`${tagVersionOne}/tryout-packages`, authMiddleware, TryoutPackageRouter);

    this.router.use(`${tagVersionOne}/tryout-details`, authMiddleware, TryoutDetailRouter);
    this.router.use(`${tagVersionOne}/history-tryout`, authMiddleware, HistoryTryoutRouter);
  }
}

export default new RouteApplication().router;
