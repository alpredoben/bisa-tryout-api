import { publishMessage } from '../../config/rabbitmq.config';
import { CS_MessageBroker } from '../../constanta';

const { Queue, Exchange } = CS_MessageBroker;

export const executeTransaction = async (payload: Record<string, any>[] | [] | any): Promise<void> => {
  await publishMessage(Exchange.Transaction, Queue.Transaction, payload);
};
