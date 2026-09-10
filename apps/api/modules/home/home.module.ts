import { HomeAppService } from './application/home.app.service';

import { HomeRepository } from './infrastructure/home.repository';
import { HomeController } from './presentation/home.controller';

export const createHomeModule = () => {
    const homeRepo = new HomeRepository();
    const homeAppSvc = new HomeAppService(homeRepo);
    const homeController = new HomeController(homeAppSvc);

    return { homeAppSvc, , homeController };
};