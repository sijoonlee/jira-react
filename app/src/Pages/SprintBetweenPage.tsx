import React, { Fragment } from 'react';
import { useForm } from "react-hook-form";
import { useSprintBetweenApi } from '../Components/UseApi/UseSprintBetweenApi';
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

type MessageObj = {
    [x: string]: {[x: string]:string}
}

type ResponseFromAPI = {
  columns: Array<string>;
  index: Array<string>;
  data: Array<Array<string>>;
}

interface LooseObject {
    [key: string]: any
}


function SprintBetweenPage() {
  const { register, handleSubmit } = useForm();
  const [ stateForSprintBetween, doFetchSprintBetween] = useSprintBetweenApi(
      'http://0.0.0.0:12345/sprintBetween?start=2020-01-01&end=2020-03-01&boardId=93',
      {"columns":[], "index":[], "data":[]},
  );

  const [ stateForBoard, _doFetchBoard] = usePlainApi(
    'http://0.0.0.0:12345/board',
    {"columns":[], "index":[], "data":[]},
  );

  const onSubmit = (formData:FormData) => {
    const url = `http://0.0.0.0:12345/sprintBetween?start=${formData.startDate}&end=${formData.endDate}&boardId=${formData.boardId}`
    doFetchSprintBetween(url)
  }
  
  const convertBoardResp = (resp:ResponseFromAPI) => {
    let list = []
    for(let row of resp.data){
      list.push({"key":row[0], "value":row[0], "text":row.join(" | ")})
    }
    
    return list
  }
// columns: (2) ["storyPoints", "Percentage"]
// data: Array(5)
// 0: (2) [8, 11.5942028986]
// 1: (2) [15, 21.7391304348]
// 2: (2) [37, 53.6231884058]
// 3: (2) [1, 1.4492753623]
// 4: (2) [8, 11.5942028986]
// index: Array(5)
// 0: "Code Merged"
// 1: "Deployed (Done)"
// 2: "Ready for Production"
// 3: "Ready for QA"
// 4: "Work To Do"
  const renderHeader = (resp:ResponseFromAPI) =>{
    let columns = ["", ...resp.columns]
    return ( <tr> {columns.map((value)=>{return <td>{value}</td>})} </tr>)
  }
  const renderRow = (resp:ResponseFromAPI) => {
    let data = []
    for (let i = 0; i < resp.index.length; i++){
      data.push([resp.index[i], ...resp.data[i]])
    }
    let table = []
    for (let values of data){
      table.push(<tr>{values.map((value)=>{return <td>{value}</td>})}</tr>)
    }
    return table
  }
  const convertSprintBetweenResp = (resp:ResponseFromAPI) => {
    return (
    <tbody>
      {renderHeader(resp)}
      {renderRow(resp)}
    </tbody>
    )
  }

  return (
      <Fragment>
        <Sidebar/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Board Id</label>
            <select name="boardId" ref={register}>
                {stateForBoard.isError && (<option value="error" disabled>Error</option>)}
                {stateForBoard.isLoading ? (<option value="loading" disabled>Loading</option>) : 
                    convertBoardResp(stateForBoard.data!).map(field => 
                        (<option key={field.key} value={field.value}>{field.text}</option>)
                )}
            </select>
            <label>Start Date</label>
            <input name='startDate'type="text" ref={register}/>
            <label>End Date</label>
            <input name='endDate'type="text" ref={register}/>
            <button type="submit">Submit</button>
        </form>

      {stateForSprintBetween.isError && <div>Something went wrong ...</div>}

      {stateForSprintBetween.isLoading ? ( <div>Loading ...</div>) : (
          <div className='content'>
            {convertSprintBetweenResp(stateForSprintBetween.data!)}
          </div>
            
      )}
      </Fragment>
  );
}

export default SprintBetweenPage;