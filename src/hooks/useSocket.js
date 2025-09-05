import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const socketRef = useRef();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  const joinTaskRoom = (taskId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_task', taskId);
    }
  };

  const leaveTaskRoom = (taskId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_task', taskId);
    }
  };

  const sendMessage = (taskId, content) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', { taskId, content });
    }
  };

  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('new_message', callback);
    }
  };

  const offNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.off('new_message', callback);
    }
  };

  return {
    socket: socketRef.current,
    joinTaskRoom,
    leaveTaskRoom,
    sendMessage,
    onNewMessage,
    offNewMessage
  };
};