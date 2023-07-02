import { useContext, useEffect } from "react"
import { COLORPICKER, FILE, NUMBER, SELECT, SIZE, TEXT, TEXTAREA } from "../fields"
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

      case 'form':
        return <FORM_FIELDS />

      default:
        return null
    }
  }

  return (
    <>
      <DEFAULT_FIELDS layerType={layer.type} />
      {out()}
    </>
  )
}

function DEFAULT_FIELDS(props) {
  const { dispatch } = useContext(AppContext)

  return (
    <>
      <PANEL_WIDGET title="Размер">

        <div className="d-flex align-items-end mt-2">
          <label>
            <span className="pe-1">Ширина</span>
            <SIZE data={{
              property: 'width',
            }} />
          </label>
          <label className="ms-2">
            <span className="pe-1">Высота</span>
            <SIZE data={{
              property: 'height',
            }} />
          </label>
          <button
            className="btn btn-secondary btn-sm py-0 px-1 ms-2"
            onClick={() => dispatch({ type: 'RESET_LAYER_SIZE' })}>
            <span className="bi bi-arrow-repeat"></span>
          </button>
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

function FORM_FIELDS() {
  return (
    <>
      <PANEL_WIDGET title="Атрибуты поля">
        <label className="mt-2 w-100">
          <span>Имя поля</span>
          <TEXT data={{
            property: 'fieldName',
            isProperty: true
          }} />
        </label>

        <label className="mt-2 w-100">
          <span>Тип поля</span>
          <SELECT data={{
            property: 'fieldType',
            isProperty: true,
          }}>
            <option value="text">Текст</option>
            <option value="number">Число</option>
            <option value="textarea">Длинный текст</option>
            <option value="select">Выбор из списка</option>
            <option value="yes_no">Да/Нет</option>
            <option value="date">Дата</option>
          </SELECT>
        </label>

        <div>
          <ADDITIONAL_FIELD_PROPERTIES />
        </div>
      </PANEL_WIDGET>
    </>
  )
}

function ADDITIONAL_FIELD_PROPERTIES() {
  const { state } = useContext(AppContext)
  const d = useContext(LayerContext)
  const layer = state.maintable.screenList[d.screenID].layers[d.layerID]

  switch (layer.fieldType) {
    case 'select':
      return (
        <>
          <hr className="mb-1 mt-3" />
          <ADDITIONAL_SELECT />
        </>
      )

    default:
      return null
  }
}

function ADDITIONAL_SELECT() {
  const { dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const layer = { ...d.layer }

  const onChange = (e, ind) => {
    layer.fieldOptions[ind] = e.target.value
    dispatch({
      type: 'UPDATE_LAYER_PROPERTY',
      pay: layer.fieldOptions
    })
  }

  const removeOption = (ind) => {
    layer.fieldOptions.splice(ind, 1)
    dispatch({
      type: 'UPDATE_LAYER_PROPERTY',
      pay: layer.fieldOptions
    })
  }

  const list = layer.fieldOptions.map((option, ind) => {
    return (
      <label className="w-100 mt-1">
        <span>{"Вариант " + (ind + 1)}</span>
        <div className="input-group">
          <input
            onChange={(e) => onChange(e, ind)}
            className="form-control form-control-sm"
            type="text"
            defaultValue={option} />
          <span onClick={() => removeOption(ind)} className="input-group-text py-0 px-2" style={{ cursor: 'pointer' }}>
            <div className="bi bi-x"></div>
          </span>
        </div>

      </label>
    )
  })

  const addOption = () => {
    layer.fieldOptions.push('Введите вариант')
    dispatch({
      type: 'UPDATE_LAYER_PROPERTY',
      pay: layer.fieldOptions
    })
  }

  return (
    <>
      {list}
      <div
        onClick={addOption}
        className="my-2 text-center" style={{ cursor: 'pointer' }}>Добавить</div>
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