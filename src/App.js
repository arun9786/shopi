import './App.css';
import LogIn from './Components/LogIn'
import Register from './Components/Register';

import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/register' element={<Register/>}/>
          <Route exact path='/' element={<LogIn/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
