import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../reducer"
import { MAINTABLE_PANEL } from "./maintable_panel"
import { MAINTABLE_NAV } from "./maintable_nav"
import { MEDIATEKA, MEDIATEKA_CALL_BTN } from "./mediateka"
import { FONTSTEKA, FONTSTEKA_CALL_BTN } from "./fontsteka"
import { ICON_BLOCK, ICON_FORMFIELD, ICON_IMAGE, ICON_TEXT } from "./icons"
import { MAINOPTIONS_CALL_BTN, MAIN_SETTINGS } from "./main_options"
import { TOAST } from "./tooltip"

export function MAINTABLE() {
  const { state, dispatch } = useContext(AppContext)

  if (!state.isAdmin) {
    return (
      <>
        <div className="release" style={{ ...state.maintable.body_style }}>
          <SCREEN_LIST />
          <FONTSTEKA />
          <MAIN_SETTINGS />
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
    <>
      <MEDIATEKA />
      <FONTSTEKA />
      <MAIN_SETTINGS />
      <div className="maintable">
        <MAINTABLE_TOP_PANEL />
        <div className="maintable__wrapper">
          <MAINTABLE_NAV />
          <div className="maintable__content" style={{ ...state.maintable.body_style }}>
            <SCREEN_LIST />
          </div>
          <MAINTABLE_PANEL />
        </div>
      </div>
    </>
  )
}

function MAINTABLE_TOP_PANEL() {
  const { state, dispatch } = useContext(AppContext)

  return (
    <div className="maintable__toppanel">
      <div className="d-flex flex-wrap justify-content-center align-items-center p-2">
        <img className="me-3" width={'33'} src="https://ms.be-original.ru/wp-content/themes/ms/img/logo.png" alt="Минисайт" />
        <button
          title="Блок"
          className="btn btn-sm btn-primary  ms-1"
          onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'block' })}>
          <ICON_BLOCK />
        </button>
        <button
          title="Текст"
          className="btn btn-sm btn-primary  ms-1"
          onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'text' })}>
          <ICON_TEXT />
        </button>
        <button
          title="Изображение"
          className="btn btn-sm btn-primary  ms-1"
          onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'image' })}>
          <ICON_IMAGE />
        </button>
        <button
          title="Поле формы"
          className="btn btn-sm btn-primary  ms-1"
          onClick={() => dispatch({ type: 'ADD_NEW_LAYER', pay: 'form' })}>
          <ICON_FORMFIELD />
        </button>

        <div className="mx-auto"></div>

        <MEDIATEKA_CALL_BTN recall={false} />
        <div className="ms-1"></div>
        <FONTSTEKA_CALL_BTN />
        <div className="ms-1"></div>
        <MAINOPTIONS_CALL_BTN />

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
  const data = { ...state.maintable.screenList[props.screenIndex].layers[props.layerIndex] }
  const isLayerActive = state.maintable.activeLayer === props.layerIndex ? ' active' : ''

  if (data.main_style?.width === '0px' || data.main_style?.width === '0%')
    data.main_style.width = 'auto'

  if (data.main_style?.height === '0px' || data.main_style?.height === '0%')
    data.main_style.height = 'auto'

  if (data.type === 'image') {
    return <img
      draggable={false}
      className={`layer ${data.type} ${isLayerActive}`}
      style={data.main_style}
      src={data.main_style.src} alt="" />
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
  const { state } = useContext(AppContext)
  const fd = props.data
  const formID = fd?.formID ?? 1

  switch (fd.fieldType) {

    case 'number':
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <input formid={formID} name={fd.fieldName} className="form-control form-control-sm" type="number" />
        </label>
      )

    case 'textarea':
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <textarea formid={formID} className="form-control form-control-sm" name={fd.fieldName} rows="5"></textarea>
        </label>
      )

    case 'select':
      let options = fd.fieldOptions.map((option, ind) => {
        return <option key={ind} value={option}>{option}</option>
      })
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <select formid={formID} name={fd.fieldName} className="form-control form-control-sm">
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
              <input formid={formID} class="form-check-input" type="radio" name={fd.fieldName} checked />
              <span>Да</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input formid={formID} class="form-check-input" type="radio" name={fd.fieldName} />
              <span>Нет</span>
            </label>
          </div>
        </div>
      )

    case 'submit':
      return (
        <label className="w-100 p-3">
          <SUBMIT_BTN
            settings={{
              action: 'send_email',
              formID: fd.formID,
              sendTo: fd.submitEmail,
              subject: fd.emailSubject
            }}
            value={'Отправить'} />
        </label>
      )

    default:
      return (
        <label className="w-100 p-3">
          <span>{fd.fieldName}</span>
          <input formid={formID} name={fd.fieldName} className="form-control form-control-sm" type={fd.fieldType} />
        </label>
      )
  }
}

export function SUBMIT_BTN(props) {
  const { state } = useContext(AppContext)
  const [res, setRes] = useState(false);
  const set = props.settings

  const onSub = () => {
    const form = new FormData()
    const fields = document.querySelectorAll(`[formid="${set.formID}"]`)
    fields.forEach((field) => {
      form.append(field.name, field.value)
    })
    form.append('action', set.action)
    form.append('postID', window.myajax.postID)
    form.append('subject', set.subject)
    form.append('to', set.sendTo)
    window
      .fetch(window.myajax.url, {
        method: 'POST',
        body: form
      })
      .then(res => res.json())
      .then(res => {
        setRes(res);
      })
      .catch((res) => setRes(res))

    setTimeout(() => {
      setRes(false)
    }, 7000)
  }

  return (
    <>
      {res ?
        <TOAST
          settings={{
            title: 'Уведомление',
            subtitle: '',
            mess: res.message
          }}
        /> : null}
      <input
        onClick={onSub}
        disabled={state.isAdmin}
        value={props.value}
        className="btn btn-sm btn-success form-control form-control-sm"
        type={'submit'} />
    </>
  )
}