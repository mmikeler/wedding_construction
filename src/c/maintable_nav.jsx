import { useContext } from "react"
import { AppContext } from "../reducer"


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
        className="bi bi-plus-square text-center text-muted"
        style={{ fontSize: '2rem' }}></div>
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
      {props.index + 1}
    </div>
  )
}