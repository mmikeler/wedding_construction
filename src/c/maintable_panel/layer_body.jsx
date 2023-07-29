import { useContext, useEffect, useRef, useState } from "react"
import { COLORPICKER, FILE, NUMBER, SELECT, SIZE, TEXT, TEXTAREA } from "../fields"
import { AppContext } from "../../reducer"
import { LayerContext } from "../maintable_panel"
import { MEDIATEKA_CALL_BTN } from "../mediateka"
import { FONTS_SELECT_OPTIONS } from "../fontsteka"
import { FORM_FIELDS } from "./form_fields"


export function LAYER_BODY(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const layer = state.maintable.screenList[d.screenID].layers[d.layerID]

  const out = () => {
    switch (layer?.type) {

      case 'block':
        return <DIV_FIELDS />

      case 'text':
        return <TEXT_FIELDS />

      case 'image':
        return <IMAGE_FIELDS />

      case 'form':
        return <FORM_FIELDS />

      default:
        return null
    }
  }

  if (layer) {
    return (
      <>
        <DEFAULT_FIELDS layerType={layer.type} />
        {out()}
      </>
    )
  }
  else {
    return null
  }

}

function DEFAULT_FIELDS(props) {
  const { state, dispatch } = useContext(AppContext)

  return (
    <>
      <PANEL_WIDGET title="Размер">

        <div className="d-flex align-items-end mt-2">
          <div className="w-75">
            <label className="d-flex align-items-center">
              <span className="pe-1" style={{ width: '20px' }}>Ш</span>
              <SIZE data={{
                property: 'width',
                baseValue: state.maintable.screenSize.width
              }} />
            </label>
            <label className="d-flex align-items-center mt-1">
              <span className="pe-1" style={{ width: '20px' }}>В</span>
              <SIZE data={{
                property: 'height',
                baseValue: state.maintable.screenSize.height
              }} />
            </label>
          </div>

          <div className="px-1">
            <button
              className="btn btn-secondary btn-sm mx-1"
              onClick={() => dispatch({ type: 'RESET_LAYER_SIZE' })}>
              <span className="bi bi-arrow-repeat"></span>
            </button>
          </div>

        </div>

      </PANEL_WIDGET>

      <PANEL_WIDGET title="Расположение">
        <div className="d-flex align-items-end mt-2">
          <label>
            <span className="pe-1">X</span>
            <NUMBER data={{
              property: 'left',
            }} />
          </label>
          <label className="ms-2">
            <span className="pe-1">Y</span>
            <NUMBER data={{
              property: 'top',
            }} />
          </label>
          <label className="ms-2">
            <span>Z</span>
            <div style={{ width: '50px' }}>
              <NUMBER data={{ property: 'zIndex' }} />
            </div>
          </label>

          {/* <button
            className="btn btn-secondary btn-sm py-0 px-1 ms-2"
            onClick={() => dispatch({ type: 'RESET_LAYER_POSITION' })}>Сброс</button> */}
        </div>
      </PANEL_WIDGET>
    </>
  )
}

function DIV_FIELDS() {
  const { state } = useContext(AppContext)
  const d = useContext(LayerContext)
  const layer = state.maintable.screenList[d.screenID].layers[d.layerID]

  return (
    <PANEL_WIDGET title="Цвета">
      <label className="mt-1">
        <span style={{ marginRight: '10px', fontSize: '0.9em' }}>Цвет фона:</span>
        <COLORPICKER data={{
          property: 'backgroundColor',
          default: layer.main_style.backgroundColor
        }} />
      </label>
    </PANEL_WIDGET>
  )
}

function TEXT_FIELDS() {

  return (
    <>
      <PANEL_WIDGET title="Текст">
        <label className="mt-2 w-100">
          <TEXTAREA data={{
            property: 'innertext',
            attributs: {
              placeholder: 'Ваш текст'
            }
          }} />
        </label>
      </PANEL_WIDGET>

      <PANEL_WIDGET title="Шрифт">

        <label className="mt-2 w-100 px-1">
          <div>Семейство</div>
          <SELECT data={{ property: 'fontFamily' }}>
            <option value="">По-умолчанию</option>
            <FONTS_SELECT_OPTIONS />
          </SELECT>
        </label>

        <label className="mt-2 w-50 px-1">
          <span>Размер</span>
          <NUMBER data={{
            property: 'fontSize',
            attributs: {
              step: 1,
              min: 12,
              max: 100
            }
          }} />
        </label>

        <label className="mt-2 w-50 px-1">
          <span>Толщина</span>
          <NUMBER data={{
            property: 'fontWeight',
            attributs: {
              step: 100,
              min: 100,
              max: 900
            }
          }} />
        </label>
        <label className="mt-2 w-50 px-1">
          <span>Высота линии</span>
          <NUMBER data={{
            property: 'lineHeight',
            attributs: {
              step: 0.1,
              min: 0.1,
              max: 900
            }
          }} />
        </label>
        <label className="mt-2 w-50 px-1">
          <div>Цвет</div>
          <COLORPICKER data={{
            property: 'color',
          }} />
        </label>
        <label className="mt-2">
          <div>Выравнивание текста</div>
          <SELECT data={{ property: 'textAlign' }}>
            <option value="left">Слева</option>
            <option value="center">По центру</option>
            <option value="right">Справа</option>
          </SELECT>
        </label>
      </PANEL_WIDGET>
    </>
  )
}

function IMAGE_FIELDS() {
  const layer = useContext(LayerContext)
  const [img, setImg] = useState();

  const onLoad = (e) => {
    setImg(e.target)
  }

  return (
    <>
      <PANEL_WIDGET title="Файл">

        <div className="ratio_1x1 d-flex align-items-start bg-dark mb-2">
          <img className="m-auto" onLoad={onLoad} src={layer.layer.main_style?.src} width="100" alt="" />
        </div>

        <div className="mx-auto">
          <MEDIATEKA_CALL_BTN text="Выбрать из Медиатеки" recall={true} />
        </div>

      </PANEL_WIDGET>
    </>
  )
}



export function PANEL_WIDGET(props) {
  return (
    <div className="widget p-2">
      <div className="fw-bold" style={{ borderBottom: '1px solid #ddd' }}>{props.title}</div>
      {props.children}
    </div>
  )
}