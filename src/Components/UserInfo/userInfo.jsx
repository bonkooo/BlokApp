import React from "react";
import "./userInfo.css";

const UserInfo = ({ ime, prezime, fakultet, brojIndeksa, radnaGrupa }) => {
    return (
        <div className="user-info-container">
            <h2 className="user-name">{ime} {prezime}</h2>
            <div className="user-details">
                <p><strong>Fakultet:</strong> {fakultet}</p>
                <p><strong>Broj indeksa:</strong> {brojIndeksa}</p>
                <p><strong>Radna grupa:</strong> {radnaGrupa}</p>
            </div>
        </div>
    );
};

export default UserInfo;
