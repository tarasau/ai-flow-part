window.addEventListener("message", (event) => {
  if (
    event.data.type === "getNodeResponse" &&
    event.data.nodeId === window.nodeId
  ) {
    const node = JSON.parse(event.data.value);
    document.getElementById("custom-value").innerHTML = node.details.body.value;
  }
});
parent.postMessage({ type: "getNode", nodeId: window.nodeId }, "*");

document.getElementById("alert-button").onclick = function () {
  parent.postMessage("HELLO THERE22", "*");
};
