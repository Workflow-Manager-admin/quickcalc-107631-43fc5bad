import React from 'react';
import './App.css';
import QuickCalcContainer from './QuickCalcContainer';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <span className="subtitle" style={{ color: "#00ffff" }}>
              QuickCalc
            </span>
          </div>
        </div>
      </nav>

      <main>
        <div style={{ paddingTop: 100, minHeight: "calc(100vh - 100px)" }}>
          <QuickCalcContainer />
        </div>
      </main>
    </div>
  );
}

export default App;