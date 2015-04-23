import keyMirror from "react/lib/keyMirror";

const Actions = keyMirror({

    CHANGE_ROUTE_SUCCESS: null,
    CHANGE_ROUTE_START: null,
    STATUS_404: null,
    STATUS_500: null,

    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT: null,

});

export default Actions;
