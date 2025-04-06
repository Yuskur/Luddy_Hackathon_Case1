import React from "react";
import { useNavigate } from "react-router-dom";
import "./MoreInfo.css";


function MoreInfo(props) {
    return props.trigger ? (
        <div className="popup-body">
            <div className="popup-inner">
                <button className="close-button" onClick={() => props.setTrigger(false)}>
                    x
                </button>
                <h2 className="popup-title">More Info</h2>
                <div className="popup-content">
                    This is the reasoning and action steps taken
                </div>
            </div>
        </div>
    ) : null;
}


export default MoreInfo;