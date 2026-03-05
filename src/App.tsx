import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SituationPage from './pages/SituationPage';
import ReadingListPage from './pages/ReadingListPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/situation/:situationId" element={<SituationPage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
