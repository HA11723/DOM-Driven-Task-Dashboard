export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}
export function delegate(parentSelector, selector, type, handler) {
  const parent = qs(parentSelector);
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      handler(event);
    }
  });
}
