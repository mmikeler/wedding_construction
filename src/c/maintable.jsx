import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../reducer"
import { MAINTABLE_PANEL } from "./maintable_panel"
import { MAINTABLE_NAV } from "./maintable_nav"


export function MAINTABLE() {
  const { state, dispatch } = useContext(AppContext)

  if (!state.isAdmin) {
    return (
      <>
        <div className="release">
          <SCREEN_LIST />
        </div>

        {state.userLoggedIn ? <div
          onClick={() => dispatch({
            type: 'UPDATE_MAIN_STATE',
            pay: {
              key: 'isAdmin',
              val: true
            }
          })}
          className="btn btn-secondary position-fixed"
          style={{
            bottom: '20px',
            right: '20px'
          }}>
          <div className="bi bi-pen" style={{ fontSize: '2em' }}></div>
        </div>
          : null}

      </>
    )
  }

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
  const list = state.maintable.screenList?.map((screen, ind) => {
    return <SCREEN key={ind} index={ind} />
  })

  return list
}

export function SCREEN(props) {
  const { state, dispatch } = useContext(AppContext)
  const [pressed, setPressed] = useState(false)

  const list = state.maintable.screenList[props.index].layers?.map((layer, ind) => {
    return <LAYER key={ind} screenIndex={props.index} layerIndex={ind} />
  })

  // Update the current position if mouse is down
  const onMouseMove = (event) => {
    if (!state.userLoggedIn) return
    if (pressed) {
      dispatch({
        type: 'UPDATE_LAYER_POSITION',
        pay: [event.movementX, event.movementY]
      })
    }
  }

  const onMouseDown = () => {
    if (!state.userLoggedIn) return
    setPressed(true)
  }

  const onMouseLeave = () => {
    if (!state.userLoggedIn) return
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
        {data.innertext}
      </div>)
  }

  if (data.type === 'form') {
    return (
      <div
        className={`layer ${data.type} ${isLayerActive}`}
        style={data.main_style}>
        <INPUT data={data} />
      </div>)
  }
}

function INPUT(props) {
  const fd = props.data

  switch (fd.fieldType) {

    case 'number':
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <input name={fd.fieldName} className="form-control form-control-sm" type="number" />
        </label>
      )

    case 'textarea':
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <textarea className="form-control form-control-sm" name={fd.fieldName} rows="5"></textarea>
        </label>
      )

    case 'select':
      let options = fd.fieldOptions.map((option, ind) => {
        return <option key={ind} value={option}>{option}</option>
      })
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <select name={fd.fieldName} className="form-control form-control-sm">
            {options}
          </select>
        </label>
      )

    case 'yes_no':
      return (
        <div className="p-3">
          <strong>{fd.fieldName}</strong>
          <div class="form-check mt-2">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name={fd.fieldName} checked />
              <span>Да</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name={fd.fieldName} />
              <span>Нет</span>
            </label>
          </div>
        </div>
      )

    default:
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <input name={fd.fieldName} className="form-control form-control-sm" type={fd.fieldType} />
        </label>
      )
  }
}