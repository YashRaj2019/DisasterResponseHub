import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url = import.meta.env.VITE_API_URL || 'http://localhost:5000') => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(url, {
      withCredentials: true,
    });

    socket.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url]);

  return socket.current;
};

export default useSocket;
