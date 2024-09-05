import App from "./App.svelte";

import "./app.css";

class FlowWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) {
      return;
    }

    const linkElem = document.createElement("link");

    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/assets/flow/app.css");

    this.shadowRoot.appendChild(linkElem.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    new App({ target: this.shadowRoot });
  }
}

customElements.define("flow-web-component", FlowWebComponent);

export default (target: HTMLElement): void => {
  const flow = document.createElement("flow-web-component");

  flow.attributeStyleMap.set("all", "initial");

  target.appendChild(flow);
};
