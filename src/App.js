import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join';
import Main from './pages/Main';
import Feed from './components/Feed';
import CreateFeed from './components/CreateFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* 기본 경로를 로그인으로 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Join />} />
        <Route path="/profile-edit" element={<Join />} />
        {/* Main 레이아웃을 위한 중첩 라우트 */}
        <Route path="/feed/*" element={<Main />}>
          <Route index element={<Feed />} />  {/* /feed 경로에서 피드 표시 */}
          <Route path="create" element={<CreateFeed />} /> {/* /feed/create 경로 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
