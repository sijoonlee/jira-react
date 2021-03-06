import React, { Fragment } from 'react';
import { useForm } from "react-hook-form";
import { usePlainApi } from '../Components/UseApi/UsePlainApi';
import { Sidebar } from '../Components/Sidebar/Sidebar'


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

function ProjectPage() {
  const { register, handleSubmit } = useForm();
  const [ state, doFetch] = usePlainApi(
    'http://0.0.0.0:12345/project',
      {"columns":[], "index":[], "data":[]},
  );

  const onSubmit = (formData:FormData) => {
    let url
    const id = formData.projectId.trim()
    if(id.length == 0)
      url = `http://0.0.0.0:12345/project`
    else 
      url = `http://0.0.0.0:12345/project?projectId=${id}`
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
                </tr>)
        })}
    </table>
  }


  return (
      <Fragment>
        <Sidebar/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Project Id</label>
            <input name='projectId'type="text" ref={register}/>
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

export default ProjectPage;