import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/TransitionWrapper.css'; // Ensure your transition styles are here

interface TransitionWrapperProps {
  children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
  // Ensure children is a single element
  return (
    <CSSTransition
      in={true} // Use a condition to control when the transition occurs
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div>{children}</div> {/* Wrap children in a div to satisfy CSSTransition */}
    </CSSTransition>
  );
};

export default TransitionWrapper;
