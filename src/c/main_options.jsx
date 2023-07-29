import { useContext } from "react"
import { AppContext } from "../reducer"
import { ICON_SETTINGS } from "./icons"
import { PANEL_WIDGET } from "./maintable_panel/layer_body"


export function MAINOPTIONS_CALL_BTN(props) {
  const { state, dispatch } = useContext(AppContext)

  return (
    <>
      <button
        onClick={() => dispatch({
          type: 'UPDATE_MAIN_STATE',
          pay: { key: 'changeImageProcess', val: props.recall }
        })}
        title="Настроййки сайта"
        className="btn btn-success btn-sm d-block"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasMainoptions"
        aria-controls="offcanvasMainoptions">
        <span><ICON_SETTINGS /></span>
        {props?.text ? <span className="ms-2">{props.text}</span> : null}
      </button>
    </>
  )
}

export function MAIN_SETTINGS() {

  return (
    <>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasMainoptions" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMainoptionsLabel">
            <ICON_SETTINGS />
            <span className="ms-2">Настройки сайта</span>
          </h5>
          <button id="mainoptions-close-btn" type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <MS_FONTS />
        </div>
      </div>
    </>
  )
}

function MS_FONTS(params) {

  const { state, dispatch } = useContext(AppContext)

  const fontList = state.maintable.fonts.map((font, ind) => {
    return <option key={ind} value={font}>{font}</option>
  })

  const onChange = (e) => {
    dispatch({
      type: 'UPDATE_BODYSTYLE_PROP',
      pay: { key: 'fontFamily', val: e.target.value }
    })
  }

  return (
    <PANEL_WIDGET title="Шрифты">
      <label className="w-100 mt-2">
        <span>Основной шрифт сайта</span>
        <select
          className="form-control form-control-sm"
          onChange={onChange}
          defaultValue={state.maintable.body_style?.fontFamily}>
          {fontList}
        </select>
      </label>
    </PANEL_WIDGET>
  )
}