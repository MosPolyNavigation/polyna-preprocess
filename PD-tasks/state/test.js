import use_state from "./main.js";

const [getValue, setValue, updateValue] = use_state({a: 1});

console.log(getValue());
updateValue(state => state['a'] += 2);
console.log(getValue());
setValue({b: 2});
console.log(getValue());
