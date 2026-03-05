import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SituationPage from './pages/SituationPage';
import ReadingListPage from './pages/ReadingListPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-bg text-cyber-text relative">

        {/* Animated background blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Grid overlay */}
        <div className="bg-grid" />

        {/* Scanlines */}
        <div className="scanlines" />

        {/* App content */}
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/situation/:situationId" element={<SituationPage />} />
            <Route path="/reading-list" element={<ReadingListPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}
