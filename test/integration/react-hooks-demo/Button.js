import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

function Button(props) {
  const button = useRef();
  const [clicked, setClicked] = useState(false);

  function animate(e) {
    var d = document.createElement("div");
    d.className = "circle";
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    d.style.left = `${x}px`;
    d.style.top = `${y}px`;
    button.current.appendChild(d);
    d.addEventListener("animationend", function() {
      d.parentElement.removeChild(d);
    });
  }

  return (
    <button
      {...props}
      ref={button}
      onClick={e => {
        animate(e);
      }}
    >
      {props.children}
    </button>
  );
}

export default styled(Button)`
  overflow: hidden;
  position: relative;
  display: block;
  font-weight: bold;
  width: fit-content;
  height: fit-content;
  color: #ffffff;
  cursor: pointer;
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: #4f9eed;
  transition: 0.1s ease 0s;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  &:hover {
    background: #2e78c2;
  }

  .circle {
    position: absolute;
    box-sizing: border-box;
    background: white;
    border-radius: 50%;
    animation: clickEffect 0.4s ease-out;
    z-index: 99999;
  }

  @keyframes clickEffect{
      0% {
        opacity: 1;
        width: 0.5em; 
        height: 0.5em;
        margin: -0.25em;
        border-width: 0.5em;
      }

      100% {
        opacity: 0;
        width: 15em; 
        height: 15em;
        margin: -7.5em;
        border-width: 0.03em;
      }
  }
`;
