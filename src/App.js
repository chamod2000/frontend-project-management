import { CSpinner } from '@coreui/react';
import './App.css';
import React, { Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
const TaskList = React.lazy(() => import('./components/TaskList'))
function App() {
  return (
   <HashRouter>
    <Suspense fallback={
       <div className="pt-3 text-center">
       <CSpinner color="primary" variant="grow" />
     </div>
    }>
      <Routes>
        <Route exact path="/" name="Dashboard" element={<TaskList />} />
      </Routes>
    </Suspense>
   </HashRouter>
  );
}

export default App;
