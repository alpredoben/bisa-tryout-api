import { publishMessage } from '../../config/rabbitmq.config';
import { CS_MessageBroker } from '../../constanta'

const { Queue, Exchange } = CS_MessageBroker

export const eventPublishMessageToSendEmail = async (data: Record<string, any>): Promise<void> => {
    await publishMessage(Exchange.Email, Queue.Email, data)
}