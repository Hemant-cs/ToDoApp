import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import ToDo from "./component/ToDoApp";

function App() {
  return (
    <div className="App">
      <h1>To Do List</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ToDo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
