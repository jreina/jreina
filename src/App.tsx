import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Computer } from "./Computer";
import "./App.css";
import { EventType } from "./const/EventType";
import { InputMode } from "./const/InputMode";
const comp = new Computer();
const session = comp.start();

function App() {
  const [buffer, setBuffer] = useState<string>("");
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState(InputMode.Public);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      session.listen(
        (message) => {
          setBuffer((buff) => `${buff}\n${message}`);
        },
        (message) => {
          setBuffer((buff) => `${buff}\n${message}`);
        }
      );

      session.on(EventType.inputModeChange, (mode: InputMode) => {
        setInputMode(mode);
      });

      session.init();
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue =
        inputMode === InputMode.Protected
          ? input.replace(/./g, "*")
          : inputMode === InputMode.Private
          ? "***"
          : input;
      setBuffer((buff) => `${buff}${inputValue}`);
      session.stdin(input);
      setInput("");
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
          type={
            [InputMode.Protected, InputMode.Private].includes(inputMode)
              ? "password"
              : "text"
          }
        />
      </pre>
    </div>
  );
}

export default App;
