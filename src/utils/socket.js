
import { io } from 'socket.io-client';

const SOCKET_URL = "https://medicarebd-server-side-1.onrender.com";


const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['polling'],
  reconnection: true,
  reconnectionAttempts: 10
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.io server');
});




export default socket;