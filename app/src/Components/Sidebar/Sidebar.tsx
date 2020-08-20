import React from 'react';
import { useHistory } from 'react-router-dom';
import './Sidebar.css'

type LinkProp = {
    address: string;
    buttonName: string;
}

function ButtonLink(props:LinkProp) {
    const history = useHistory();
    function handleClick(){
        history.push(props.address)
    }
    return (
        <button type="button" onClick={handleClick}>{props.buttonName}</button>
    )
}

// function HomeButton(){
//     return ButtonLink("/")
// }

export const Sidebar = () => {
    return <div className='sidebar'>
            <ButtonLink address="/" buttonName="Home"/>
            <ButtonLink address="/board" buttonName="Board"/>
            <ButtonLink address="/sprintBetween" buttonName="Search Sprint Between Days"/>
        </div>
}