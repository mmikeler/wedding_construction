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
      <div className="maintable__panel-content">
        <div className="maintable__panel-screen">
          <div className="header bg-dark text-white fw-bold">
            {`Screen ${state.maintable.activeScreen + 1}`}
          </div>
          <div className="body">
            {layerList}
          </div>
          <div className="footer d-flex justify-content-between p-2" style={{ borderTop: '2px solid #ddd' }}>
            <button className="btn btn-sm btn-primary" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'block' })}>Блок</button>
            <button className="btn btn-sm btn-primary" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'text' })}>Текст</button>
            <button className="btn btn-sm btn-primary" onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'image' })}>Фото</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const LayerContext = createContext(null)

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