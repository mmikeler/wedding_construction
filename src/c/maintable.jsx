import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../reducer"
import { MAINTABLE_PANEL } from "./maintable_panel"
import { MAINTABLE_NAV } from "./maintable_nav"


export function MAINTABLE() {


  return (
    <div className="maintable">
      <div className="maintable__wrapper">
        <MAINTABLE_NAV />
        <div className="maintable__content">
          <SCREEN_LIST />
        </div>
        <MAINTABLE_PANEL />
      </div>
    </div>
  )
}

export function SCREEN_LIST() {
  const { state } = useContext(AppContext)
  const list = state.maintable.screenList.map((screen, ind) => {
    return <SCREEN key={ind} index={ind} />
  })

  return list
}

export function SCREEN(props) {
  const { state, dispatch } = useContext(AppContext)
  const [pressed, setPressed] = useState(false)

  const list = state.maintable.screenList[props.index].layers.map((layer, ind) => {
    return <LAYER key={ind} screenIndex={props.index} layerIndex={ind} />
  })

  // Update the current position if mouse is down
  const onMouseMove = (event) => {
    if (pressed) {
      dispatch({
        type: 'UPDATE_LAYER_POSITION',
        pay: [event.movementX, event.movementY]
      })
    }
  }

  const onMouseDown = () => {
    setPressed(true)
  }

  const onMouseLeave = () => {
    setPressed(false)
  }

  return (
    <div
      id={`screen_${props.index}`}
      style={state.maintable.screenList[props.index].main_style}
      onMouseUp={() => { setPressed(false) }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="maintable__screen">
      {list}
    </div>
  )
}

export function LAYER(props) {
  const { state } = useContext(AppContext)
  const data = state.maintable.screenList[props.screenIndex].layers[props.layerIndex]
  const isLayerActive = state.maintable.activeLayer === props.layerIndex ? ' active' : ''

  if (data.type === 'image') {
    return <img
      draggable={false}
      className={`layer ${data.type} ${isLayerActive}`}
      style={data.main_style}
      src={data.filepath} alt="" />
  }

  if (data.type === 'block') {
    return (
      <div
        className={`layer ${data.type} ${isLayerActive}`}
        style={data.main_style}>
      </div>)
  }

  if (data.type === 'text') {
    return (
      <div
        className={`layer ${data.type} ${isLayerActive}`}
        style={data.main_style}>
        data.innertext
      </div>)
  }
}