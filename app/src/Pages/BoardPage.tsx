import React, { Fragment } from 'react';
import { useForm } from "react-hook-form";
import { useBoardApi } from '../Components/UseApi/UseBoardApi';

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
type ResponseFromAPI = {
    columns: Array<string>;
    index: Array<string>;
    data: Array<Array<string>>;
}

function BoardPage() {
  const { register, handleSubmit } = useForm();
  const [ state, doFetch] = useBoardApi(
    'http://0.0.0.0:12345/board',
      {"columns":[], "index":[], "data":[]},
  );

  const onSubmit = (formData:FormData) => {
    const url = `http://0.0.0.0:12345/board?boardId=${formData.boardId}`
    doFetch(url)
  }
  

  const renderHeader = (resp:ResponseFromAPI) => {
    return (
        <tr>{resp.columns.map(column => {return <th>{column}</th>})}</tr>
    )
  }


  const convertResp = (resp:ResponseFromAPI) => {
    return <table>
        {renderHeader(resp)}
        {resp.data.map(row => {
            return (
                <tr>
                    {row.map(column => {
                        return <td>{column}</td>
                    })}
                </tr>
            )
        })}
        
    </table>
  }


  return (
      <Fragment>

        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Board Id</label>
            <input name='boardId'type="text" ref={register}/>
            <button type="submit">Submit</button>
        </form>

      {state.isError && <div>Something went wrong ...</div>}

      {state.isLoading ? ( <div>Loading ...</div>) : (
          <div className='content'>
            {convertResp(state.data!)}
          </div>
            
      )}
      </Fragment>
  );
}

export default BoardPage;