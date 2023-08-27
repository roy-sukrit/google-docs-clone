import TextEditor from "./TextEditor";
import { v4 as uuidV4 } from "uuid"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate 

} from "react-router-dom";
function App() {
  return (
    <Router>
        <Routes>
          {/* <Route path="/" element={<a href={`/documents/${uuidV4()}`}>create document</a>} /> */}
          <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`} />} />
           <Route path='/documents/:id' element={ <TextEditor />}/>
        </Routes>
      </Router>


  );
}

export default App;
