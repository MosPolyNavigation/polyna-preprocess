/**
 * Primitive state managment
 * @param {Object} initial_value 
 * @returns Array{closure}
 */
const use_state = (initial_value) => {
    let state = Object.assign({}, initial_value);
    const get_state = () => state;
    const set_state = (new_value) => {state = Object.assign({}, new_value);};
    const update_state = (closure) => closure(state);
    return [get_state, set_state, update_state];
};

export default use_state;
