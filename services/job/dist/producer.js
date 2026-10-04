import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();
let producer;
let admin;
export const connectKafka = async () => {
    try {
        const broker = process.env.Kafka_Broker || "localhost:9092";
        const isRemote = !broker.includes("localhost") && !broker.includes("127.0.0.1");
        const kafka = new Kafka({
            clientId: "job-service",
            brokers: [broker],
            ssl: isRemote,
            connectionTimeout: 5000,
        });
        admin = kafka.admin();
        await admin.connect();
        const topics = await admin.listTopics();
        if (!topics.includes("send-mail")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1,
                    },
                ],
            });
            console.log("✅ Topic 'send-mail' created");
        }
        await admin.disconnect();
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ connected to kafka producer");
    }
    catch (error) {
        console.log("Failed to connect to kafka", error);
    }
};
export const publishToTopic = async (topic, message) => {
    if (!producer) {
        console.log("kafka producer is not initialized");
        return;
    }
    try {
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
    }
    catch (error) {
        console.log("Failed to publish message to kafka", error);
    }
};
export const disconnectKafka = async () => {
    if (producer) {
        producer.disconnect();
    }
};
