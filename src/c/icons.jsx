

export function ICON(props) {
  return (
    <span
      className={`bi bi-${props.iconID}`}
      style={{ fontSize: props.size + 'em' }}></span>
  );
}

export function ICON_BLOCK() {
  return (
    <ICON iconID="square" />
  );
}

export function ICON_TEXT() {
  return (
    <ICON iconID="type" />
  );
}

export function ICON_IMAGE() {
  return (
    <ICON iconID="image" />
  );
}

export function ICON_FORMFIELD() {
  return (
    <ICON iconID="card-checklist" />
  );
}

export function ICON_GALLERY() {
  return (
    <ICON iconID="images" />
  );
}

export function ICON_FONTS() {
  return (
    <ICON iconID="fonts" />
  );
}

export function ICON_SETTINGS() {
  return (
    <ICON iconID="sliders2" />
  );
}