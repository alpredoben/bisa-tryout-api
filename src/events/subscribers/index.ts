import { Logger } from '../../config/logger.config';

export const RunSubscribers = async () => {
  try {
    console.info(`Start run all subscriber`);
  } catch (err: any) {
    console.info(`Opps... service run all subscriber error`, err);
    Logger().error(`Opps... service run all subscriber error`, err);
  }
};
