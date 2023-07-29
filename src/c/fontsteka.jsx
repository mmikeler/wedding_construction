import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../reducer";
import { ICON_FONTS } from "./icons";
import { CHECKBOX } from "./fields";


export function FONTSTEKA_CALL_BTN(props) {
  const { state, dispatch } = useContext(AppContext)

  return (
    <>
      <button
        title="Шрифты"
        className="btn btn-success btn-sm d-block"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasFonts"
        aria-controls="offcanvasFonts">
        <span><ICON_FONTS /></span>
        {props?.text ? <span className="ms-2">{props.text}</span> : null}
      </button>
    </>
  )
}

export function FONTSTEKA(props) {
  const { state } = useContext(AppContext)

  return (
    <>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasFonts" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            <i className="bi bi-fonts text-muted"></i>
            <span className="ms-2">Шрифты</span>
          </h5>
          <button id="mediateka-close-btn" type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {/* <label className="mt-2 w-100 position-relative">
            <div className="btn btn-success mediateka-overlay">
              Загрузить файл
            </div>
            <form encType="multipart/form-data">
              <input
                className="form-control form-control-sm"
                onChange={onChange}
                name="attachment[]"
                multiple="multiple"
                disabled="disabled"
                type="file" />
            </form>
          </label> */}

          <div className="alert alert-info text-center">
            Выберите шрифты для отображения на сайте. Мы не рекомендуем добавлять больше трёх.
          </div>

          <div className="fontslist">
            <FONTS_LIST />
          </div>
        </div>
      </div>
    </>
  )
}

function FONTS_LIST() {

  const lib = {
    Alegreya: '300;400;500;700;900&Алегрея',
    Bitter: '300;400;500;700;900&Биттер',
    Jost: '300;400;500;700;900&Джост',
    Literata: '300;400;500;700;900&Литерата',
    Montserrat: '300;400;500;700;900&Монтсеррат',
    Open_Sans: '400;700&Оупен Санс',
    Pangolin: '400&Панголин',
    Raleway: '300;400;500;700;900&Райлуэй',
    Roboto: '300;400;500&Робото',
    Sofia_Sans: '300;400;500;700;900&София Санс',
    Ubuntu: '400;500;700;900&Убунту'
  }

  const lib1 = []
  for (let font in lib) {
    let t = lib[font].split('&')
    let wght = t[0]
    let rusTitle = t[1]
    lib1.push(
      <FONTS_LIST_ITEM__WRAP
        key={font}
        ind={font} title={font.replace('_', ' ') + ' - ' + rusTitle}
        font={{ title: font, wght: wght }}>
        <FONT_PREVIEW font={{ title: font, wght: wght }} />
      </FONTS_LIST_ITEM__WRAP>
    )
  }

  return (
    <div className="accordion w-100" id="accordion-fontsteka">
      {lib1}
    </div>
  );
}

function FONTS_LIST_ITEM__WRAP(props) {

  const { state, dispatch } = useContext(AppContext)

  if (state.maintable.fonts === undefined) return null

  const fontName = 'family=' + props.font.title.replace('_', '+')
  const fontStyle = props.font.wght ? ':wght@' + props.font.wght : ''
  const fontUrl = "https://fonts.googleapis.com/css2?" + fontName + fontStyle + "&display=swap"
  const key = 'key_' + props.ind
  const isFontChecked = state.maintable.fonts.includes(props.font.title) ? true : false
  const fontLink = (state.userLoggedIn && state.isAdmin) || isFontChecked ?
    <link rel="stylesheet" href={fontUrl} /> : null

  return (
    <div className="accordion-item" style={{ fontFamily: props.font.title.replace('_', ' ') }}>
      <style>
        {
          fontLink
        }
      </style>
      <h2 className="accordion-header" id={key}>
        <div className="d-flex align-items-center">
          <div className="m-1">
            <CHECKBOX
              options={{
                args: {
                  id: props.font.title + '_checked',
                  checked: isFontChecked,
                  onChange: (e) => {
                    dispatch({
                      type: e.target.checked ? 'ADD_SITE_FONT' : 'REMOVE_SITE_FONT',
                      pay: props.font.title
                    })
                  }
                }
              }}
            />
          </div>
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={'#collapse' + key}
            aria-expanded="false"
            aria-controls={'collapse' + key}>
            <span>{props.title}</span>
          </button>
        </div>
      </h2>
      <div id={"collapse" + key} className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
        <div className="accordion-body">
          {props.children}
        </div>
      </div>
    </div>
  )
}

function FONT_PREVIEW(props) {

  const fontStyleArray = props.font.wght ?
    props.font.wght.split(';').map((fontWeight, ind) => {
      return (
        <div
          className="mb-1"
          key={ind}
          style={{ fontWeight: fontWeight, fontSize: '18px' }}>
          <strong className="me-2 small opacity-75" style={{ fontSize: '12px' }}>
            {fontWeight}
          </strong>
          Фраза на русском для проверки
        </div>
      )
    })
    : false

  return (
    <div className="mb-2">
      <div className="mb-1 text-secondary fw-bold">{props.font[0]}</div>
      <div>
        {fontStyleArray}
      </div>
    </div>
  )
}

export function FONTS_SELECT_OPTIONS() {
  const { state } = useContext(AppContext)
  const fontList = state.maintable.fonts.map((font, ind) => {
    return <option key={ind} value={font}>{font}</option>
  })
  return (
    fontList
  )
}