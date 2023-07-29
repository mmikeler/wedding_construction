import { createContext, useContext, useState } from "react"
import { AppContext } from "../reducer"
import { COLORPICKER, NUMBER } from "./fields"
import { LAYER_BODY, PANEL_WIDGET } from "./maintable_panel/layer_body"
import { ICON } from "./icons"


export function MAINTABLE_PANEL() {
  const { state, dispatch } = useContext(AppContext)
  const activeLayer = state.maintable.screenList[state.maintable.activeScreen]?.layers[state.maintable.activeLayer]

  return (
    <div className="maintable__panel">
      <div className="maintable__panel-content h-100 d-flex flex-wrap">
        <div className="maintable__panel-screen w-100">

          <div className="header d-flex align-items-center bg-dark text-white fw-bold">
            {`Экран ${state.maintable.activeScreen + 1} - ${activeLayer?.type} ${state.maintable.activeLayer + 1}`}
            <div className="ms-auto">
              <div
                onClick={() => dispatch({
                  type: 'REMOVE_SCREEN'
                })}
                className="btn btn-danger btn-sm py-0 px-1"
                title="Удалить экран">
                <ICON iconID="x-lg" />
              </div>
            </div>
          </div>

          <div className="body">
            {activeLayer ? <MAINTABLE_PANEL__LAYER
              screenID={state.maintable.activeScreen}
              layerID={state.maintable.activeLayer} /> : null}
          </div>

        </div>

        <div className="mt-auto w-100 d-flex">
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
            className="w-50 p-2"
            title="Режим просмотра">
            <div className="btn btn-outline-info w-100">
              <ICON iconID="eye" size="1.3" />
            </div>
          </div>

          <div className="w-50 p-2" title="Сохранить сайт">
            <REQUEST_BTN />
          </div>
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
    data.append('action', 'update_site_settings')
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
      {upload ? 'Обработка...' : <ICON iconID="save" size="1.3" />}
    </button>
  )
}

function MAINTABLE_PANEL__LAYER(props) {
  const { state, dispatch } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const layer = state.maintable.screenList[props.screenID].layers[props.layerID]

  const deleteLayer = () => {
    dispatch({
      type: 'DELETE_LAYER',
      pay: [props.screenID, props.layerID]
    })
  }

  return (
    <LayerContext.Provider value={
      {
        screenID: props.screenID,
        layerID: props.layerID,
        layer: layer
      }
    }>
      <div className="maintable__panel-layer mt-2">
        <div className={`body${open ? ' open' : ''}`}>
          <LAYER_BODY />

          <PANEL_WIDGET title="Опции">
            <div
              onClick={deleteLayer}
              className="btn btn-sm d-block mx-auto btn-outline-danger mx-1 my-2">
              Удалить элемент
            </div>
          </PANEL_WIDGET>
        </div>
      </div>
    </LayerContext.Provider>
  )
}