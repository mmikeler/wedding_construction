import { useEffect } from "react";
import { ICON } from "./icons";


export function TOOLTIP(props) {

  return (
    ''
  );
}

export function TOAST(props) {
  const { title, subtitle, mess } = { ...props.settings }

  return (
    <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      <div id="liveToast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <ICON iconID={'info-circle'} />
          <strong className="ms-2 me-auto">{title}</strong>
          <small>{subtitle}</small>
          <button type="button" className="btn-close" dataBsDismiss="toast" ariaLabel="Close"></button>
        </div>
        <div className="toast-body">
          {mess}
        </div>
      </div>
    </div>
  )
}