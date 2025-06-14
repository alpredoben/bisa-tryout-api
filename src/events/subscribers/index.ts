import { Logger } from '../../config/logger.config';
import { eventSubscribeHistoryTryout } from './history-tryout.subscriber';

export const RunSubscribers = async () => {
  try {
    console.info(`Start run all subscriber`);

    await eventSubscribeHistoryTryout();
  } catch (err: any) {
    console.info(`Opps... service run all subscriber error`, err);
    Logger().error(`Opps... service run all subscriber error`, err);
  }
};
