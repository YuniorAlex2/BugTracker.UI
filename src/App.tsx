import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:5256/api/projects")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return <h1>Bug Tracker UI</h1>;
}

export default App;