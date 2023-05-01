import { useContext } from "react"
import { COLORPICKER, FILE, NUMBER, SELECT, TEXT, TEXTAREA } from "../fields"
import { AppContext } from "../../reducer"
import { LayerContext } from "../maintable_panel"


export function LAYER_BODY(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const layer = state.maintable.screenList[d.screenID].layers[d.layerID]

  const out = () => {
    switch (layer.type) {

      case 'block':
        return <DIV_FIELDS />

      case 'text':
        return <TEXT_FIELDS />

      case 'image':
        return <IMAGE_FIELDS />

      default:
        return null
    }
  }

  return (
    <>
      <DEFAULT_FIELDS />
      {out()}
    </>
  )
}

function DEFAULT_FIELDS() {
  const { dispatch } = useContext(AppContext)

  return (
    <>
      <PANEL_WIDGET title="Размер">

        <div className="d-flex align-items-end mt-2">
          <label>
            <span className="pe-1">Ширина</span>
            <NUMBER data={{
              property: 'width',
            }} />
          </label>
          <label className="ms-2">
            <span className="pe-1">Высота</span>
            <NUMBER data={{
              property: 'height',
            }} />
          </label>
          <button
            className="btn btn-secondary btn-sm py-0 px-1 ms-2"
            onClick={() => dispatch({ type: 'RESET_LAYER_SIZE' })}>Сброс</button>
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
    <PANEL_WIDGET title="Фон">
      <label>
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
        <label className="mt-2 w-50 p-1">
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
        <label className="mt-2 w-50 p-1">
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
        <label className="mt-2 w-50 p-1">
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
        <label className="mt-2 w-50 p-1">
          <div>Цвет</div>
          <COLORPICKER data={{
            property: 'color',
          }} />
        </label>
        <label className="mt-2">
          <div>Выравнивание текста</div>
          <SELECT data={{ property: 'textAlign' }} />
        </label>
      </PANEL_WIDGET>
    </>
  )
}

function IMAGE_FIELDS() {

  return (
    <PANEL_WIDGET title="Файл">
      <label className="mt-2">
        <FILE data={{ property: 'filepath' }} />
      </label>
    </PANEL_WIDGET>
  )
}

function PANEL_WIDGET(props) {
  return (
    <div className="widget p-2">
      <div className="fw-bold" style={{ borderBottom: '1px solid #ddd' }}>{props.title}</div>
      {props.children}
    </div>
  )
}