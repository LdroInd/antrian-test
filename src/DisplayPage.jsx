import { useEffect, useRef, useState } from 'react';
import { useQueue } from './QueueContext';
import { dingThenSpeak } from './speak';

export default function DisplayPage() {
  const { queue, currentServing, announceNumber } = useQueue();
  const lastAnnounceRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  // Play sound when announceNumber changes
  useEffect(() => {
    if (!announceNumber) return;
    if (lastAnnounceRef.current === announceNumber.ts) return;
    lastAnnounceRef.current = announceNumber.ts;

    // Trigger animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);

    // Play ding + speech
    dingThenSpeak(announceNumber.number);
  }, [announceNumber]);

  return (
    <div className="display-page">
      <h1 className="display-title">Antrian</h1>

      <div className={`display-serving ${animating ? 'display-serving-animate' : ''}`}>
        <p className="display-serving-label">NOMOR ANTRIAN</p>
        <div className="display-serving-number">
          {currentServing ? String(currentServing).padStart(3, '0') : '---'}
        </div>
        <p className="display-serving-sub">Sedang Dilayani</p>
      </div>

      <div className="display-next">
        <div className="display-next-box">
          <p className="display-next-label">Berikutnya</p>
          <p className="display-next-number">
            {queue.length > 0 ? String(queue[0]).padStart(3, '0') : '---'}
          </p>
        </div>
        <div className="display-next-box">
          <p className="display-next-label">Sisa Antrian</p>
          <p className="display-next-number">{queue.length}</p>
        </div>
      </div>

      {queue.length > 0 && (
        <div className="display-queue-list">
          <h2 className="display-queue-title">Daftar Tunggu</h2>
          <div className="display-queue-grid">
            {queue.map((num, idx) => (
              <div key={num} className={`display-queue-item ${idx === 0 ? 'display-queue-first' : ''}`}>
                {String(num).padStart(3, '0')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
