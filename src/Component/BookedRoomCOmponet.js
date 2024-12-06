import { useState } from "react";
import { Sidebark } from "./Sidebar";
import './upcoming.css'
import { LastFragment } from "./Fragment/LastFragemnt";
import { OngoingFragemnt } from "./Fragment/OngoingFragemnt";
import { UpcomingFragment } from "./Fragment/UpcomingFragment";
export function Upcoming({user}){
  const [SelectedId, setSelectedId] = useState(6);
  function handleClick(id) {
    setSelectedId(id !== SelectedId ? id : null);
  }
    return (
        <div style={{ display: "flex" }}>
        <Sidebark user={user}/>
          <div className="rooms book" style={{ position: "relative", left: "20%" }}>
            <h1>Room Booking Status</h1>
            <div style={{display:'flex',width:'100%',textAlign:'center'}} className="changer">
              <div style={{width:"33.33%",padding:'10px'}} className={`${5 === SelectedId ? "active" : ""}`} onClick={()=>setSelectedId(5)}>Last</div>
              <div style={{width:'33.33%',padding:'10px'}} className={`${6 === SelectedId ? "active" : ""}`} onClick={()=>setSelectedId(6)}>OnGoing</div>
              <div style={{width:'33.33%',padding:'10px'}} className={`${7 === SelectedId ? "active" : ""}`} onClick={()=>setSelectedId(7)}>Upcoming</div>
            </div>
            <div  className={` ${5 === SelectedId ? "show" : "hide"} `} >
              <LastFragment  user={user}/>
            </div>
            <div className={` ${6 === SelectedId ? "show" : "hide"} `} >
              <OngoingFragemnt user={user}/>
            </div>
            <div className={` ${7 === SelectedId ? "show" : "hide"} `} >
              <UpcomingFragment user={user}/>
            </div>
          </div>
        </div>
      );
}