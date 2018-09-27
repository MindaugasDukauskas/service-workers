var React = require("react");
var ReactDOM = require("react-dom");

var Hello = () => {
  return <h1 className="red">Hello!</h1>;
};

var element = React.createElement(Hello, {});
ReactDOM.render(element, document.querySelector(".container"));
