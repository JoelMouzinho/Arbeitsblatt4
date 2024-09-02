import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl font-bold" }, `Counter`),
    div({ className: "flex items-center gap-4" }, [
      button({ className: btnStyle, onclick: () => dispatch(MSGS.DECREMENT) }, "-"),
      p({ className: "text-3xl font-mono" }, `${model.counter}`),
      button({ className: btnStyle, onclick: () => dispatch(MSGS.INCREMENT) }, "+"),
    ]),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.INCREMENT:
      return { ...model, counter: model.counter + 1 };

    case MSGS.DECREMENT:
      return { ...model, counter: model.counter - 1 };

    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  counter: 0,
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
