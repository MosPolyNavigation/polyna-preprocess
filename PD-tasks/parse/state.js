import use_state from "../state/main.js";

export const [getSchedule, setSchedule, updateSchedule] = use_state({});
export const [getAuditories, setAuditories, ] = use_state({});

export default {getSchedule, setSchedule, updateSchedule, getAuditories, setAuditories};
