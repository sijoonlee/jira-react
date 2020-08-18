import React, { useState, useEffect, useReducer, Fragment } from 'react';
import { useForm } from "react-hook-form";
import './App.css';
import fetch from 'node-fetch';

// https://www.robinwieruch.de/react-hooks-fetch-data
// https://www.robinwieruch.de/react-usereducer-hook
// https://stackoverflow.com/questions/42871136/dispatch-function-in-react-redux
// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm



interface IFormData {
  boardId: string;
  startDate: string;
  endDate: string;
}
type FormData = {
  [x: string]: any;
}
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
                console.log(url)
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
  const { register, handleSubmit } = useForm();
  // const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
      'https://hn.algolia.com/api/v1/search?query=redux',
      { hits: [] },
  );

  const onSubmit = (formData:FormData) => {
    console.log(formData)
    const url = formData.boardId + formData.startDate + formData.endDate
    doFetch(url)
  }
  return (
      <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
          <input name='boardId'type="text" ref={register}/>
          <input name='startDate'type="text" ref={register}/>
          <input name='endDate'type="text" ref={register}/>
          <button type="submit">Submit</button>
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

export default App;