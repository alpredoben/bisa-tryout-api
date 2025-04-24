import MainRoutes from '../config/routes.config';
import RouteHealtCheck from './routeHealtCheck';

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck)
  }
}

export default new RouteApplication().router;
