import { useContext, useEffect, useState } from "react"
import { AppContext } from "../reducer"
import { LayerContext } from "./maintable_panel"

export function TEXT(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  const mainstyle = { ...d.layer.main_style }
  const [v, setV] = useState(
    props.data.isProperty ?
      d.layer[props.data.property]
      : mainstyle[props.data.property])

  const onChange = (e) => {
    if (props.data.isProperty) {
      dispatch({
        type: 'UPDATE_LAYER_PROPPERTY',
        pay: { ...d.layer, ...{ [props.data.property]: e.target.value } }
      })
    }
    else {
      mainstyle[props.data.property] = e.target.value
      dispatch({
        type: 'UPDATE_LAYER_MAIN_STYLE',
        pay: mainstyle
      })
    }
    setV(e.target.value)
  }

  return (
    <input
      onChange={onChange}
      name={d.layer.fieldName}
      type="text"
      defaultValue={v}
      className="form-control form-control-sm" />
  )
}

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
      name={d.layer.fieldName}
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
      name={d.layer.fieldName}
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
  const [v, setV] = useState(
    props.data.isProperty ?
      d.layer[props.data.property]
      : mainstyle[props.data.property])

  const onChange = (e) => {
    if (props.data.isProperty) {
      dispatch({
        type: 'UPDATE_LAYER_PROPPERTY',
        pay: { ...d.layer, ...{ [props.data.property]: e.target.value } }
      })
    }
    else {
      mainstyle[props.data.property] = e.target.value
      dispatch({
        type: 'UPDATE_LAYER_MAIN_STYLE',
        pay: mainstyle
      })
    }
    setV(e.target.value)
  }

  return (
    <select
      name={d.layer.fieldName}
      className="form-control form-control-sm"
      onChange={onChange}
      defaultValue={v}>
      {props.children}
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
      name={d.layer.fieldName}
      disabled={!isLayerActive}
      onChange={onChange}
      onBlur={onBlur}
      type="number"
      {...props.data.attributs}
      value={v}
    />
  )
}

export function SIZE(props) {
  const { state, dispatch } = useContext(AppContext)
  const d = useContext(LayerContext)
  let mainstyle = state.maintable.screenList[d.screenID].layers[d.layerID].main_style
  const isLayerActive = state.maintable.activeScreen === d.screenID && state.maintable.activeLayer === d.layerID ? true : false

  const detectUnit = mainstyle[props.data.property].toString().indexOf('px') > 0 ? 'px' : '%'

  const [unit, setUnit] = useState(detectUnit);
  const [v, setV] = useState(mainstyle[props.data.property].toString().replace('px', '').replace('%', ''))

  const onChange = (e) => {
    setV(e.target.value)
  }

  const onBlur = () => {
    dispatch({
      type: 'UPDATE_LAYER_MAIN_STYLE',
      pay: { ...mainstyle, ...{ [props.data.property]: v + unit } }
    })
  }

  useEffect(() => {
    setV(mainstyle[props.data.property].toString().replace('px', '').replace('%', ''))
  }, [mainstyle[props.data.property]])

  useEffect(() => {
    onBlur()
  }, [unit])

  return (
    <div className="input-group">
      <input
        className="form-control form-control-sm"
        name={d.layer.fieldName}
        disabled={!isLayerActive}
        onChange={onChange}
        onBlur={onBlur}
        type="number"
        {...props.data.attributs}
        value={v}
      />

      <button
        onClick={() => setUnit('px')}
        className={`btn btn-sm btn-${unit === 'px' ? 'warning' : 'secondary'}`}
        type="button">px</button>

      <button
        onClick={() => setUnit('%')}
        className={`btn btn-sm btn-${unit === '%' ? 'warning' : 'secondary'}`}
        type="button">%</button>

    </div>

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
      <input
        name={d.layer.fieldName}
        className="form-control form-control-sm"
        onChange={onChange}
        type="file" />
      <div className="ratio_1x1">
        <img onLoad={onLoad} className="w-100" src={filepath} alt="" />
      </div>
    </div>
  )
}