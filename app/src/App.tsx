import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import './App.css';
import fetch from 'node-fetch';

interface ItestForm {
  boardId: string;
  startDate: string;
  endDate: string;

}

function onSubmitForm(formData:ItestForm) {
  console.log(formData.boardId, formData.startDate, formData.endDate);
  (async () => {
    const response = await fetch('https://api.github.com/users/github');
    const json = await response.json();
  
    console.log(json);
  })();
}

function App() {
  const [data, setData] = useState({ hits: [] });
 
  useEffect(async () => {
    const result = await axios(
      'https://hn.algolia.com/api/v1/search?query=redux',
    );
 
    setData(result.data);
  });
 

  const { register, handleSubmit } = useForm<ItestForm>();
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <label>
        Board ID: (use 93 for OMP)
        <input type="text" name="boardId" ref={register} />
      </label>
      <label>
        Start Date: (ex 2020-01-01)
        <input type="text" name="startDate" ref={register} />
      </label>
      <label>
        End Date: (ex 2020-04-01)
        <input type="text" name="endDate" ref={register} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
