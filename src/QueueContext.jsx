import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const QueueContext = createContext();
const CHANNEL_NAME = 'antrian-sync';

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [currentServing, setCurrentServing] = useState(null);
  const channelRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Setup BroadcastChannel
  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = ch;

    ch.onmessage = (e) => {
      const { type, data } = e.data;
      if (type === 'sync') {
        isRemoteUpdate.current = true;
        setQueue(data.queue);
        setNextNumber(data.nextNumber);
        setCurrentServing(data.currentServing);
      } else if (type === 'request-sync') {
        // Tab baru minta data, kirim state saat ini
        broadcastState();
      }
    };

    // Minta sync dari tab yang sudah ada
    ch.postMessage({ type: 'request-sync' });

    return () => ch.close();
  }, []);

  // Broadcast state ke semua tab setiap kali berubah
  const broadcastState = useCallback(() => {
    channelRef.current?.postMessage({
      type: 'sync',
      data: { queue, nextNumber, currentServing },
    });
  }, [queue, nextNumber, currentServing]);

  useEffect(() => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    broadcastState();
  }, [queue, nextNumber, currentServing, broadcastState]);

  const takeNumber = useCallback(() => {
    const number = nextNumber;
    setQueue(prev => [...prev, number]);
    setNextNumber(prev => prev + 1);
  }, [nextNumber]);

  const callNext = useCallback(() => {
    if (queue.length === 0) return;
    setCurrentServing(queue[0]);
    setQueue(prev => prev.slice(1));
  }, [queue]);

  const skipNumber = useCallback(() => {
    if (queue.length === 0) return;
    const skipped = queue[0];
    setQueue(prev => [...prev.slice(1), skipped]);
  }, [queue]);

  const resetQueue = useCallback(() => {
    if (!window.confirm('Yakin ingin reset semua antrian?')) return;
    setQueue([]);
    setNextNumber(1);
    setCurrentServing(null);
  }, []);

  return (
    <QueueContext.Provider value={{
      queue, nextNumber, currentServing,
      takeNumber, callNext, skipNumber, resetQueue,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  return useContext(QueueContext);
}
