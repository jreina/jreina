import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Computer } from "./Computer";
import "./App.css";
const comp = new Computer();

function App() {
  const [buffer, setBuffer] = useState<string>("");
  const [input, setInput] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      comp.listen(
        (message) => {
          setBuffer((buff) => `${buff}\n${message}`);
        },
        (message) => {
          setBuffer((buff) => `${buff}\n${message}`);
        }
      );
      comp.start();
    }
  }, []);


  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      setBuffer(buff => `${buff}${input}`)
      comp.input(input);
      setInput('');
    }
  }
  return (
    <div>
      <pre className="terminal">
        {buffer}
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoFocus
          className="terminal-input"
        />
      </pre>
    </div>
  );
}

export default App;
