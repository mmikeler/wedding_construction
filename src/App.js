import { useReducer } from 'react';
import './App.sass';
import { MAINTABLE } from './c/maintable';
import { AppContext, initialState, reducer } from './reducer';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      <MAINTABLE />
    </AppContext.Provider>
  );
}

export default App;