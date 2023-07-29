import { useContext } from "react"
import { PANEL_WIDGET } from "./layer_body"
import { SELECT, TEXT } from "../fields"
import { LayerContext } from "../maintable_panel"
import { AppContext } from "../../reducer"

export function FORM_FIELDS() {
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
          <SELECT
            data={{
              property: 'fieldType',
              isProperty: true,
            }}>
            <option value="text">Текст</option>
            <option value="number">Число</option>
            <option value="textarea">Длинный текст</option>
            <option value="select">Выбор из списка</option>
            <option value="yes_no">Да/Нет</option>
            <option value="date">Дата</option>
            <option value="submit">Кнопка отправки</option>
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

    case 'submit':
      return (
        <ADDITIONAL_SUBMIT />
      )

    default:
      return null
  }
}

function ADDITIONAL_SUBMIT() {

  return (
    <>
      <label className="mt-2 w-100">
        <span>Идентификатор формы</span>
        <SELECT data={{ property: 'formID', isProperty: true }}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SELECT>
      </label>
      <label className="mt-2 w-100">
        <span>E-mail получателя</span>
        <TEXT data={{
          property: 'submitEmail',
          isProperty: true
        }} />
      </label>
      <label className="mt-2 w-100">
        <span>Тема письма</span>
        <TEXT data={{
          property: 'emailSubject',
          isProperty: true
        }} />
      </label>
    </>
  )
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