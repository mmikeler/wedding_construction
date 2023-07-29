import { useEffect, useReducer } from 'react';
import './App.sass';
import { MAINTABLE } from './c/maintable';
import { AppContext, initialState, reducer } from './reducer';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  let temp = sessionStorage.getItem('_temp_site')

  if (temp) {
    initialState.maintable = JSON.parse(temp)
  }

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const data = new FormData()
    data.append('action', 'get_site_settings')
    data.append('postID', window.myajax.postID)
    data.append('nonce', window.myajax.nonce)

    fetch(window.myajax.url, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        res.code === 'ok' &&
          dispatch({
            type: 'UPDATE_MAIN_STATE',
            pay: {
              key: 'maintable',
              val: res.data
            }
          })
      })
  }, [])

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      <MAINTABLE />
    </AppContext.Provider>
  );
}

export default App;