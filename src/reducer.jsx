import { createContext } from "react";

export const AppContext = createContext(null);

export const initialState = {
  isAdmin: false,
  userLoggedIn: window.userLoggedIn,
  maintable: {
    activeScreen: 0,
    activeLayer: 0,
    fonts: ['Roboto'],
    body_style: {
      fontFamily: 'Roboto',
    },
    screenSize: {
      width: 360,
      height: 800
    },
    screenList: [
      {
        main_style: {
          backgroundColor: '#ffffff',
        },
        layers: []
      }
    ]
  }
};

export const reducer = (state, action) => {
  const { type, pay } = { ...action }
  let s = { ...state }
  let activeLayer = s.maintable.screenList[s.maintable.activeScreen]?.layers[s.maintable.activeLayer]
  let layerMainStyle = activeLayer?.main_style
  let fonts = s.maintable.fonts

  let setLayerMainStyle = (newStyle) => {
    s.maintable.screenList[s.maintable.activeScreen].layers[s.maintable.activeLayer].main_style = newStyle
  }

  let setLayerProperty = (newLayerObject) => {
    s.maintable.screenList[s.maintable.activeScreen].layers[s.maintable.activeLayer] = newLayerObject
  }

  let Layer = (layerType) => {
    let layer = {
      type: layerType,
      main_style: {
        top: 0,
        left: 0,
        transformX: 0,
        transformY: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        backgroundPosition: '0 0',
        backgroundColor: '#3C88EC',
        backgroundSize: '100% 100%',
      }
    }

    if (layerType === 'text') {
      layer.innertext = 'Небольшой текст в несколько строк!'
      layer.main_style = {
        ...layer.main_style,
        ...{
          height: 'auto',
          top: s.maintable.screenSize.height / 2,
          backgroundColor: 'transparent',
          fontSize: 20,
          fontWeight: 400,
          color: '#333',
          textAlign: 'center',
          lineHeight: 1.2
        }
      }
    }

    if (layerType === "image") {
      layer.main_style = {
        ...layer.main_style,
        ...{
          backgroundColor: 'transparent',
          height: 0, // 0 интерпретируется как auto
          src: ''
        }
      }
    }

    if (layerType === "form") {
      layer.fieldType = 'text'
      layer.fieldValue = ''
      layer.fieldName = 'Label text'
      layer.fieldOptions = ['Имя опции']
      layer.main_style = {
        ...layer.main_style,
        ...{
          backgroundColor: 'transparent',
          height: 0,
          constants: ['height']
        }
      }
    }

    return layer
  }

  let newScreen = () => {
    let screen =
    {
      main_style: {
        backgroundColor: '#ffffff',
      },
      layers: []
    }
    s.maintable.screenList.push(screen)
  }

  switch (type) {
    case 'UPDATE_MAIN_STATE':
      s[pay.key] = pay.val
      break

    case 'UPDATE_MAINTABLE_PROP':
      s.maintable[pay.key] = pay.val
      break

    case 'UPDATE_BODYSTYLE_PROP':
      s.maintable.body_style[pay.key] = pay.val
      break

    case 'UPDATE_LAYER_MAIN_STYLE':
      setLayerMainStyle(pay)
      break

    case 'UPDATE_LAYER_POSITION':
      let position = {
        top: layerMainStyle.top + pay[1],
        left: layerMainStyle.left + pay[0]
      }
      setLayerMainStyle({
        ...layerMainStyle,
        ...position
      })
      break

    case 'UPDATE_LAYER_PROPPERTY':
      setLayerProperty(pay)
      break

    case 'UPDATE_ACTIVE_LAYER_PROPERTY':
      let tempStyle = { ...layerMainStyle, [pay.key]: pay.val }
      setLayerMainStyle(tempStyle)
      break;

    case 'SET_ACTIVE_LAYER':
      s.maintable.activeScreen = pay
      break

    case 'RESET_LAYER_SIZE':
      let mod = {
        width: state.maintable.screenSize.width,
        height: state.maintable.screenSize.height
      }
      setLayerMainStyle({
        ...layerMainStyle,
        ...mod
      })
      break

    case 'RESET_LAYER_POSITION':
      setLayerMainStyle({
        ...layerMainStyle,
        ...{ left: 0, top: 0 }
      })
      break

    case 'ADD_NEW_LAYER':
      let newLayer = Layer(pay)
      state.maintable.screenList[state.maintable.activeScreen].layers.push(newLayer)
      break

    case 'DELETE_LAYER':
      s.maintable.screenList[pay[0]].layers.splice(pay[1], 1)
      break

    case 'CHANGE_LAYER':
      s.maintable.activeLayer = pay
      break

    case 'ADD_SCREEN':
      newScreen()
      break

    case 'REMOVE_SCREEN':
      s.maintable.screenList.splice(s.maintable.activeScreen, 1)
      break

    case 'ADD_SITE_FONT':
      if (fonts.indexOf(pay) < 0)
        state.maintable.fonts.push(pay)
      break

    case 'REMOVE_SITE_FONT':
      if (fonts.indexOf(pay) > -1)
        state.maintable.fonts.splice(fonts.indexOf(pay), 1)
      break

    default:
      return { ...state }
  }
  sessionStorage.setItem('_temp_site', JSON.stringify(s.maintable))
  return s
};