import { useContext } from "react"
import { AppContext } from "../reducer"
import { ICON_BLOCK, ICON_IMAGE, ICON_TEXT } from "./icons"


export function MAINTABLE_NAV() {
  const { state, dispatch } = useContext(AppContext)

  const screenList = state.maintable.screenList.map((screen, ind) => {
    return <ListElement key={ind} index={ind} />
  })

  return (
    <div className="maintable__nav">
      {screenList}
      <div
        onClick={() => dispatch({ type: 'ADD_SCREEN' })}
        className="bi bi-plus-square text-center"
        style={{ fontSize: '2rem', color: 'var(--bs-gray-400)' }}></div>
    </div>
  )
}

function ListElement(props) {
  const { state, dispatch } = useContext(AppContext)
  const isActive = state.maintable.activeScreen === +props.index ? ' active' : ''

  const changeScreen = () => {
    dispatch({
      type: 'SET_ACTIVE_LAYER',
      pay: props.index
    })
    document.getElementById('screen_' + props.index).scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div onClick={changeScreen} className={`screen-preview${isActive}`}>
      <div className="mb-2 fw-bold">Экран {props.index + 1}</div>
      <ListOfLayers screenInd={props.index} />
    </div>
  )
}

function ListOfLayers(props) {
  const { state, dispatch } = useContext(AppContext)
  const list = state.maintable.screenList[props.screenInd].layers.map((layer, ind) => {
    return (
      <div
        key={ind}
        onClick={() => dispatch({
          type: 'CHANGE_LAYER',
          pay: ind
        })}
        className={`layer-list__item${ind === state.maintable.activeLayer ? ' active' : ''}`}>
        - <span className="fs-6"><ListOfLayersItem type={layer.type} /></span>
      </div>
    )
  })

  return list
}

function ListOfLayersItem(params) {
  switch (params.type) {
    case 'block':
      return <ICON_BLOCK />
    case 'text':
      return <ICON_TEXT />
    case 'image':
      return <ICON_IMAGE />

    default:
      return 'N';
  }
}