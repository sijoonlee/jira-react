import React, { useState, useEffect, useReducer, Fragment } from 'react';
import { useForm } from "react-hook-form";
import './App.css';
import fetch from 'node-fetch';

// https://www.robinwieruch.de/react-hooks-fetch-data
// https://www.robinwieruch.de/react-usereducer-hook
// https://stackoverflow.com/questions/42871136/dispatch-function-in-react-redux
// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm


type FormData = {
    [x: string]: any;
    // boardId?: string;
    // startDate?: string;
    // endDate?: string;
}
interface IData {
    state: number;
    message: string;
}

interface IState { 
    data? : IData;
    isLoading? : boolean;
    isError? : boolean;
}

type UserActionWithPayload = {
    type: string;
    payload: IData;
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


const useDataApi = (initialUrl:string, initialData:IData):[IState, Function] => {
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
                console.log(result)
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

function App() {
  const { register, handleSubmit } = useForm();
  // const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
      'http://0.0.0.0:12345/sprint?start=2020-01-01&end=2020-03-01&boardId=93',
      { state: 200, message:"Init" },
  );

//   useEffect(async () => {
//     const result = await axios(
//       'https://hn.algolia.com/api/v1/search?query=redux',
//     );
 
//     setData(result.data);
//   }, []);

  const onSubmit = (formData:FormData) => {
    const url = `http://0.0.0.0:12345/sprint?start=${formData.startDate}&end=${formData.endDate}&boardId=${formData.boardId}`
    doFetch(url)
  }
  const options = ["1", "2"]
  return (
      <Fragment>
        <select name="gender" ref={register}>
            {options.map(value => 
                (<option key={value} value={value}>{value}</option>)
            )}
        </select>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Board Id</label>
            <input name='boardId'type="text" ref={register}/>
            <label>Start Date</label>
            <input name='startDate'type="text" ref={register}/>
            <label>End Date</label>
            <input name='endDate'type="text" ref={register}/>
            <button type="submit">Submit</button>
        </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? ( <div>Loading ...</div>) : (
            <div className="content" dangerouslySetInnerHTML={{__html:data!.message as string}}></div>
      )}
      </Fragment>
  );
}

export default App;