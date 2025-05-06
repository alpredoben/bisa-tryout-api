import ConverterDataController from '../app/modules/converter_data';
import MainRoutes from '../config/routes.config';
import RouteHealtCheck from './routeHealtCheck';

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck);
    this.router.use(`${tagVersionOne}/transaction`, ConverterDataController);
  }
}

export default new RouteApplication().router;
