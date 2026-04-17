import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueueProvider } from './QueueContext';
import PetugasPage from './PetugasPage';
import DisplayPage from './DisplayPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <QueueProvider>
        <Routes>
          <Route path="/" element={<PetugasPage />} />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </QueueProvider>
    </BrowserRouter>
  );
}

export default App;
