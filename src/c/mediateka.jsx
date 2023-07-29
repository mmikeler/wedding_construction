import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../reducer";
import { ICON_GALLERY } from "./icons";


export function MEDIATEKA_CALL_BTN(props) {
  const { state, dispatch } = useContext(AppContext)

  return (
    <>
      <button
        onClick={() => dispatch({
          type: 'UPDATE_MAIN_STATE',
          pay: { key: 'changeImageProcess', val: props.recall }
        })}
        title="Медиатека"
        className="btn btn-success btn-sm d-block"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample">
        <span><ICON_GALLERY /></span>
        {props?.text ? <span className="ms-2">{props.text}</span> : null}
      </button>
    </>
  )
}

export function MEDIATEKA(props) {
  const { state } = useContext(AppContext)
  const [medialist, setMedialist] = useState([]);
  const form = useRef()

  useEffect(() => {
    const data = new FormData()
    data.append('action', 'get_site_media')
    data.append('postID', window.myajax.postID)
    data.append('nonce', window.myajax.nonce)
    fetch(window.myajax.url, {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 'ok') {
          const files = []
          for (let file in res.data) {
            files.push(<MEDIATEKA_ITEM key={file} data={[res.data[file], file]} />)
          }
          setMedialist(files)
        }
      })
      .catch((res) => { console.log('fail download media', res); })
  }, [])

  const onChange = (e) => {

    if (state.changeImageProcess) { } else { return }

    const data = new FormData(form.current)
    data.append('action', 'upload_file')
    data.append('postID', window.myajax.postID)
    data.append('nonce', window.myajax.nonce)

    fetch(window.myajax.url, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        res.code === 'ok' &&
          console.log('OK');
      })
      .catch(() => { console.log('fail'); })
  }

  return (
    <>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            <i className="bi bi-images text-muted"></i>
            <span className="ms-2">Медиатека</span>
          </h5>
          <button id="mediateka-close-btn" type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <label className="mt-2 w-100 position-relative">
            <div className="btn btn-success mediateka-overlay">
              Загрузить файл
            </div>
            <form ref={form} encType="multipart/form-data">
              <input
                className="form-control form-control-sm"
                onChange={onChange}
                name="attachment[]"
                multiple="multiple"
                type="file" />
            </form>
          </label>

          <div className="medialist mt-5">
            <div className="row row-cols-3">
              {medialist}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function MEDIATEKA_ITEM(props) {

  const { state, dispatch } = useContext(AppContext)

  const addMediaFileToLayer = () => {
    dispatch({
      type: 'UPDATE_ACTIVE_LAYER_PROPERTY',
      pay: {
        key: 'src',
        val: props.data[0]
      }
    })
    if (state.changeImageProcess)
      document.getElementById('mediateka-close-btn').click()
  }

  return (
    <div
      onClick={addMediaFileToLayer}
      id={props.data[1]}
      className="mediateka__wrap col p-0 mt-1">
      <div className="p-1">
        <div
          className="ratio ratio-1x1 overflow-hidden img-thumbnail"
          style={{ background: `url(${props.data[0]}) center / cover` }}>
        </div>
      </div>
    </div>
  )
}