import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Homepage = React.lazy(() => import('./components/homepage'));
const View = React.lazy(() => import('./components/view'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <React.Suspense fallback={
              <div className='logo_wrapper'>
                <div className='z one'>Z</div>
                <div className='z two'>Z</div>
                <div className='z three'>Z</div>
              </div>
            }>
              <Homepage />
            </React.Suspense>
          } />
          <Route path='/:username' element={
            <React.Suspense fallback={
              <div className='logo_wrapper'>
                <div className='z one'>Z</div>
                <div className='z two'>Z</div>
                <div className='z three'>Z</div>
              </div>
            }>
              <View />
            </React.Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;