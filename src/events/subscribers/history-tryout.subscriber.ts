import { TryoutPackageService } from '../../app/modules/tryout-package/service';
import { subscribeMessage } from '../../config/rabbitmq.config';
import { CS_MessageBroker, CS_TypeName } from '../../constanta';
import { I_RequestCustom } from '../../interfaces/app.interface';

const { Queue, Exchange } = CS_MessageBroker;

const extractHistoryTryoutMessage = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
  const { origin, history_id, type_name, request } = JSON.parse(message);
  const req: I_RequestCustom = request;
  switch (type_name) {
    case CS_TypeName.TryoutPackage:
      const tryoutService = new TryoutPackageService();
      await tryoutService.executeTryoutPackageImport(origin, history_id, req);
      break;

    default:
      break;
  }
};

export const eventSubscribeHistoryTryout = async (): Promise<void> => {
  const queue: string = Queue.HistoryTryout;
  const exchange: string = Exchange.HistoryTryout;

  console.info(`System checking exchange and queue (${exchange}, ${queue}) response from broker`);

  try {
    await subscribeMessage(exchange, queue, extractHistoryTryoutMessage);
  } catch (err: any) {
    console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err);
  }
};
