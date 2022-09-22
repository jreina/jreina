import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Computer } from "./Computer";
import "./App.css";
import { EventType } from "./const/EventType";

const comp = new Computer();
const session = comp.start();

function formatBuffer(buffer: string) {
  return (
    <>
      {buffer}
      <div className="cursor"></div>
    </>
  );
}

function App() {
  const [buffer, setBuffer] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      session.on(EventType.bufferChange, setBuffer);

      session.init();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleInputKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleInputKeyDown);
    };
  }, []);

  function handleInputKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    const isEnter = e.key === "Enter";
    const isBackspace = e.key === "Backspace";
    const isMeta = e.key === "Meta";
    const isArrowLeft = e.key === "ArrowLeft";
    const isArrowUp = e.key === "ArrowUp";
    const isArrowRight = e.key === "ArrowRight";
    const isArrowDown = e.key === "ArrowDown";
    const isTab = e.key === "Tab";
    const isDelete = e.key === "Delete";
    const isHome = e.key === "Home";
    const isEnd = e.key === "End";
    const isPageUp = e.key === "PageUp";
    const isPageDown = e.key === "PageDown";
    const isInsert = e.key === "Insert";

    const isSpecial = e.key.length > 1;

    session.receiveKeyStroke(isSpecial ? null : e.key, {
      alt: e.altKey,
      ctrl: e.ctrlKey,
      enter: isEnter,
      backspace: isBackspace,
      arrowDown: isArrowDown,
      arrowLeft: isArrowLeft,
      arrowRight: isArrowRight,
      arrowUp: isArrowUp,
      delete: isDelete,
      end: isEnd,
      home: isHome,
      insert: isInsert,
      meta: isMeta,
      pageDown: isPageDown,
      pageUp: isPageUp,
      tab: isTab,
    });
  }
  return (
    <pre className="terminal">
      {buffer}
      <div className="cursor"></div>
    </pre>
  );
}

export default App;
