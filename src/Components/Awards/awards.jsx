import React from "react";
import "./awards.css";
import z5 from '../../Assets/z5.png'
import z10 from '../../Assets/z10.png'
import z15 from '../../Assets/z15.png'
import z20 from '../../Assets/z20.png'
import z25 from '../../Assets/z25.png'

const achievements = [
    { id: "z5", threshold: 5, image: z5, text: "5 Zaduženja" },
    { id: "z10", threshold: 10, image: z10, text: "10 Zaduženja" },
    { id: "z15", threshold: 15, image: z15, text: "15 Zaduženja" },
    { id: "z20", threshold: 20, image: z20, text: "20 Zaduženja" },
    { id: "z25", threshold: 25, image: z25, text: "25 Zaduženja" }
];

const Awards = ({ completedAssignments }) => {
    const earnedAchievements = achievements.filter(a => completedAssignments >= a.threshold);

    return (
        <div className="awards-container">
            <h2>Tvoje Nagrade</h2>
            <div className="awards-grid">
                {earnedAchievements.map(ach => (
                    <div key={ach.id} className="award-card">
                        <img src={ach.image} alt={ach.text} className="award-image" />
                        <p className="award-text">{ach.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;
