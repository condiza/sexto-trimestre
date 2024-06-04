import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient({
    password:process.env.PASSWORDREDIS ,
    socket: {
        host: process.env.HOSTREDIS,
        port: 14910
    }
});

export const checkRedisConnection = async () => {
    try {
      await client.connect();
      console.log("Conexión a la base de datos Redis exitosa.");
    } catch (error) {
      console.error('Error al conectar con Redis:', error);
    }
  };