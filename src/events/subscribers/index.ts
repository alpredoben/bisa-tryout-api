import { Logger } from '../../config/logger.config';
import { eventSubscribeTransaction } from './transaction.subscriber';

export const RunSubscribers = async () => {
  try {
    console.info(`Start run all subscriber`);
    await eventSubscribeTransaction();
  } catch (err: any) {
    console.info(`Opps... service run all subscriber error`, err);
    Logger().error(`Opps... service run all subscriber error`, err);
  }
};
