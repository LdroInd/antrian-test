import { useQueue } from './QueueContext';
import { Link } from 'react-router-dom';

export default function PetugasPage() {
  const { queue, nextNumber, currentServing, takeNumber, callNext, skipNumber, resetQueue } = useQueue();

  return (
    <div className="app">
      <h1 className="app-title">🎫 Panel Petugas</h1>
      <p className="nav-link">
        <Link to="/display" target="_blank">🖥️ Buka Display Antrian</Link>
      </p>

      <div className="serving-section">
        <p className="serving-label">Sedang Dilayani</p>
        <div className="serving-number">
          {currentServing ? String(currentServing).padStart(3, '0') : '---'}
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-take" onClick={takeNumber}>🎟️ Ambil Antrian</button>
        <button className="btn btn-call" onClick={callNext} disabled={queue.length === 0}>📢 Panggil Berikutnya</button>
        <button className="btn btn-skip" onClick={skipNumber} disabled={queue.length === 0}>⏭️ Lewati</button>
        <button className="btn btn-reset" onClick={resetQueue}>🔄 Reset</button>
      </div>

      <div className="info-bar">
        <div className="info-item">
          <span className="info-label">Menunggu</span>
          <span className="info-value">{queue.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Diambil</span>
          <span className="info-value">{nextNumber - 1}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Berikutnya</span>
          <span className="info-value">{queue.length > 0 ? String(queue[0]).padStart(3, '0') : '---'}</span>
        </div>
      </div>

      <div className="queue-section">
        <h2 className="queue-title">Daftar Antrian ({queue.length})</h2>
        {queue.length === 0 ? (
          <p className="queue-empty">Belum ada antrian</p>
        ) : (
          <div className="queue-grid">
            {queue.map((num, idx) => (
              <div key={num} className={`queue-card ${idx === 0 ? 'queue-card-next' : ''}`}>
                <span className="queue-number">{String(num).padStart(3, '0')}</span>
                {idx === 0 && <span className="queue-badge">Berikutnya</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
