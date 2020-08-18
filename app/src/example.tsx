import React, { Fragment, useState, useEffect, useReducer, Dispatch } from 'react';
import fetch from 'node-fetch';

interface IData {
    hits: Array<any>;
}

interface IState { 
    data? : IData;
    isLoading? : Boolean;
    isError? : Boolean;
}

type UserActionWithPayload = {
    type: String;
    payload: IData;
}

type UserActionWithoutPayload = {
    type: String;
}

type UserAction = UserActionWithPayload | UserActionWithoutPayload;

 
//   function userReducer(state: string, action: UserAction): string {
//     switch (action.type) {
//       case "LOGIN":
//         return (action as UserActionWithPayload).username;
//       case "LOGOUT":
//         return "";
//       default:
//         throw new Error("Unknown 'user' action");
//     }
//   }


const dataFetchReducer = (state:IState, action:UserAction):IState => {
    switch (action.type) {
        case 'FETCH_INIT':
        return { ...state, isLoading: true, isError: false };
        case 'FETCH_SUCCESS':
        return { ...state, isLoading: true, isError: false, data: (action as UserActionWithPayload).payload };
        case 'FETCH_FAILURE':
        return { ...state, isLoading: false, isError: true };
        default:
        throw new Error();
    }
};

const useDataApi = (initialUrl:string, initialData:IData):[IState, Function] => {
    let didCancel = false;

    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });

    useEffect(() => {
        let didCancel = false;
        
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' } as UserActionWithoutPayload);
        
            try {
                const response = await fetch(url);
                const result = await response.json();
            
                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data } as UserActionWithPayload);
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

function App() {
const [query, setQuery] = useState('redux');
const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'https://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] },
);

return (
    <Fragment>
    <form
        onSubmit={event => {
        doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
        );

        event.preventDefault();
        }}
    >
        <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
    </form>

    {isError && <div>Something went wrong ...</div>}

    {isLoading ? ( <div>Loading ...</div>) : (
        <ul>
        {data!.hits.map(item => (
            <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
            </li>
        ))}
        </ul>
    )}
    </Fragment>
);
}
