import { createContext, useContext, useState } from "react"
import { AppContext } from "../reducer"
import { COLORPICKER, NUMBER } from "./fields"
import { LAYER_BODY } from "./maintable_panel/layer_body"


export function MAINTABLE_PANEL() {
  const { state, dispatch } = useContext(AppContext)
  const layerList = state.maintable.screenList[state.maintable.activeScreen].layers.map((screen, ind) => {
    return <MAINTABLE_PANEL__LAYER
      key={ind}
      screenID={state.maintable.activeScreen}
      layerID={ind} />
  })

  return (
    <div className="maintable__panel">
      <div className="maintable__panel-content h-100 d-flex flex-wrap">
        <div className="maintable__panel-screen w-100">

          <div className="header bg-dark text-white fw-bold">
            {`Экран ${state.maintable.activeScreen + 1}`}
          </div>

          <div className="body">
            {layerList}
          </div>

          <div className="footer d-flex flex-wrap justify-content-between p-2" style={{ borderTop: '2px solid #ddd' }}>
            <button className="btn btn-sm btn-primary mt-2 ms-1" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'block' })}>Блок</button>
            <button className="btn btn-sm btn-primary mt-2 ms-1" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'text' })}>Текст</button>
            <button className="btn btn-sm btn-primary mt-2 ms-1" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'image' })}>Фото</button>
            <button className="btn btn-sm btn-primary mt-2 ms-1" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'form' })}>Форма</button>
          </div>

        </div>

        <div className="mt-auto mx-auto d-flex btn btn-outline-secondary">
          <div
            onClick={() => {
              dispatch({
                type: 'UPDATE_MAIN_STATE',
                pay: {
                  key: 'isAdmin',
                  val: false
                }
              })
            }}
            className="bi bi-eye m-auto"
            style={{ fontSize: '2em' }}></div>
        </div>

        <div className="mt-3 w-100 p-3">
          <REQUEST_BTN />
        </div>

      </div>
    </div>
  )
}

export const LayerContext = createContext(null)

function REQUEST_BTN() {
  const [upload, setUpload] = useState(false);

  const sendRequest = () => {
    const data = new FormData()
    data.append('action', 'save_site_settings')
    data.append('postID', window.myajax.postID)
    data.append('settings', sessionStorage.getItem('_temp_site'))
    data.append('nonce', window.myajax.nonce)

    setUpload(true)

    fetch(window.myajax.url, {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then(res => {
        setUpload(false)
      })
  }

  return (
    <button
      onClick={sendRequest}
      disabled={upload}
      className="btn btn-outline-success w-100">
      {upload ? 'Обработка...' : 'Сохранить сайт'}
    </button>
  )
}

function MAINTABLE_PANEL__LAYER(props) {
  const { state, dispatch } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const layer = state.maintable.screenList[props.screenID].layers[props.layerID]
  const isLayerActive = state.maintable.activeLayer === props.layerID ? ' active' : ''

  const changeLayer = () => {
    dispatch({
      type: 'CHANGE_LAYER',
      pay: props.layerID
    })
  }

  const deleteLayer = () => {
    dispatch({
      type: 'DELETE_LAYER',
      pay: [props.screenID, props.layerID]
    })
  }

  return (
    <LayerContext.Provider value={{ screenID: props.screenID, layerID: props.layerID, layer: layer }}>
      <div className="maintable__panel-layer mt-2">

        <div className={`d-flex header${isLayerActive}`}>
          <span
            onClick={changeLayer}>{layer.type} {props.layerID + 1}</span>

          <div
            onClick={deleteLayer}
            className="bi bi-x-circle-fill text-danger ms-auto"></div>
        </div>

        {isLayerActive && <div className={`body${open ? ' open' : ''}`}>
          <LAYER_BODY />
        </div>}
      </div>
    </LayerContext.Provider>
  )
}