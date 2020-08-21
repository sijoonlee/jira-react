import { useState, useEffect, useReducer } from 'react';

type ResponseFromAPI = {
    columns: Array<string>;
    index: Array<string>;
    data: Array<Array<string>>;
}

interface IState { 
    data? : ResponseFromAPI;
    isLoading? : boolean;
    isError? : boolean;
}

type UserActionWithPayload = {
    type: string;
    payload: ResponseFromAPI;
}

type UserActionWithoutPayload = {
    type: string;
}
type UserAction = UserActionWithPayload | UserActionWithoutPayload;

const dataFetchReducer = (state:IState, action:UserAction):IState => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, isError: false, data: (action as UserActionWithPayload).payload };
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        default:
            throw new Error();
    }
};


export const usePlainApi = (initialUrl:string, initialData: ResponseFromAPI):[IState, Function] => {
    let didCancel = false;

    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });

    useEffect(() => {
        
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' } as UserActionWithoutPayload);
        
            try {
                const response = await fetch(url);
                const result = await response.json();
                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result } as UserActionWithPayload);
                }

            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_FAILURE' } as UserActionWithoutPayload);
                }
            }
        };
        
        fetchData();
        
        /*
        Every Effect Hook comes with a clean up function which runs when a component unmounts. 
        The clean up function is the one function returned from the hook. 
        In our case, we use a boolean flag called didCancel to let our data fetching logic know 
        about the state (mounted/unmounted) of the component. 
        If the component did unmount, the flag should be set to true 
        which results in preventing to set the component state 
        after the data fetching has been asynchronously resolved eventually.
        */
        return () => {
            didCancel = true;
        };
    }, [url]);


    return [state, setUrl];
};
