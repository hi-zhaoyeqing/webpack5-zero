import _ from 'lodash';
import "./style.css"
import Icon from "./img.jpeg"
import Csv from "./my-csv.csv"
import Xml from "./my-xml.xml"
import yaml from './data.yaml';

import printMe, { a, b } from './print.js'

console.log(a, b);
console.log(yaml.title); // output `YAML Example`
console.log(yaml.owner.name); // output `Tom Preston-Werner`
function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'Bug'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);
  // 打印csv、xml文件
  console.log("csv:", Csv);
  console.log("xml:", Xml);
  //引入print.js
  const btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);
  return element;
}

document.body.appendChild(component());