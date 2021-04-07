import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false, 
    error: null, 
    data: null, 
    extra: null, 
    identifier: null
};

const httpReducer = (curHttpState, action) => {
    switch (action.type){
        case "SEND":
            return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
        case "Response":
            return { ...curHttpState, loading: false, data: action.responseData, extra: action.extra};
        case "Error":
            return { loading: false, error: action.errorMessage};
        case "Clear": 
            return initialState;
        default:
            throw new Error ("Should not be reached");
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: 'Clear'}), []);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({type: "SEND", identifier: reqIdentifier});
        fetch(
            url, 
            {
                method: method, 
                body: body, 
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                dispatchHttp({type: "Response", responseData: responseData, extra: reqExtra})
            })
            .catch(error => {
                dispatchHttp({type: "Error", errorMessage: "Something went wrong"})
            })
    }, []);
    

    return {
        isLoading: httpState.loading, 
        data: httpState.data, 
        error: httpState.error, 
        sendRequest: sendRequest, 
        reqExtra: httpState.extra, 
        reqIdentifier: httpState.identifier, 
        clear: clear
    }
};


export default useHttp;