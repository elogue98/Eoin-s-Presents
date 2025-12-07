import { Route, Routes } from 'react-router-dom';
import GiftPage from './pages/GiftPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:slug" element={<GiftPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;