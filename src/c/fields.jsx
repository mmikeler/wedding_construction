import { useContext, useEffect, useState } from "react"
import { AppContext } from "../reducer"
import { LayerContext } from "./maintable_panel"

export function COLORPICKER(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const isLayerActive = state.maintable.activeScreen === d.screenID && state.maintable.activeLayer === d.layerID ? true : false
  const mainstyle = { ...state.maintable.screenList[state.maintable.activeScreen].layers[state.maintable.activeLayer].main_style }
  const [v, setV] = useState(props.data.default)

  const onChange = (e) => {
    setV(e.target.value)
    mainstyle[props.data.property] = v
    dispatch({
      type: 'UPDATE_LAYER_MAIN_STYLE',
      pay: { ...mainstyle }
    })
  }

  return (
    <input
      className="form-control"
      disabled={!isLayerActive}
      onChange={onChange}
      type="color"
      value={v}
    />
  )
}

export function TEXTAREA(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  let layer = state.maintable.screenList[d.screenID].layers[d.layerID]
  const isLayerActive = state.maintable.activeScreen === d.screenID && state.maintable.activeLayer === d.layerID ? true : false
  const [v, setV] = useState(layer[props.data.property])

  const onChange = (e) => {
    dispatch({
      type: 'UPDATE_LAYER_PROPPERTY',
      pay: { ...layer, ...{ [props.data.property]: e.target.value } }
    })
    setV(e.target.value)
  }

  return (
    <textarea
      disabled={!isLayerActive}
      onChange={onChange}
      type="text"
      className="form-control form-control-sm"
      value={v}
    ></textarea>
  )
}

export function SELECT(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const mainstyle = { ...d.layer.main_style }
  const [v, setV] = useState(mainstyle[props.data.property])

  const onChange = (e) => {
    mainstyle[props.data.property] = e.target.value
    dispatch({
      type: 'UPDATE_LAYER_MAIN_STYLE',
      pay: mainstyle
    })
    setV(e.target.value)
  }

  return (
    <select className="form-control form-control-sm" onChange={onChange} defaultValue={v}>
      <option value="left">Слева</option>
      <option value="center">По центру</option>
      <option value="right">Справа</option>
    </select>
  )
}

export function NUMBER(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  let mainstyle = state.maintable.screenList[d.screenID].layers[d.layerID].main_style
  const isLayerActive = state.maintable.activeScreen === d.screenID && state.maintable.activeLayer === d.layerID ? true : false
  const [v, setV] = useState(mainstyle[props.data.property])

  const onChange = (e) => {
    setV(e.target.value)
  }

  const onBlur = () => {
    dispatch({
      type: 'UPDATE_LAYER_MAIN_STYLE',
      pay: { ...mainstyle, ...{ [props.data.property]: +v } }
    })
  }

  useEffect(() => {
    setV(mainstyle[props.data.property])
  }, [mainstyle[props.data.property]])

  return (
    <input
      className="form-control form-control-sm"
      disabled={!isLayerActive}
      onChange={onChange}
      onBlur={onBlur}
      type="number"
      {...props.data.attributs}
      value={v}
    />
  )
}

export function FILE(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const [filepath, setPath] = useState('')

  const onChange = (e) => {
    let path = URL.createObjectURL(e.target.files[0])
    dispatch({
      type: 'UPDATE_LAYER_PROPPERTY',
      pay: { ...d.layer, ...{ [props.data.property]: path } }
    })
    setPath(path)
  }

  const onLoad = (e) => {
    let w = e.target.width
    let h = e.target.height
    let screenW = state.maintable.screenSize.width
    let screenH = state.maintable.screenSize.height
    let mainstyle = d.layer.main_style
    dispatch({
      type: 'UPDATE_LAYER_MAIN_STYLE',
      pay: { ...mainstyle, ...{ height: Math.floor(h / w * screenW) } }
    })
  }

  return (
    <div className="">
      <input className="form-control form-control-sm" onChange={onChange} type="file" />
      <div className="ratio_1x1">
        <img onLoad={onLoad} className="w-100" src={filepath} alt="" />
      </div>
    </div>
  )
}