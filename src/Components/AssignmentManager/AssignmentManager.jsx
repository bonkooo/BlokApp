import React, { useState } from "react";
import "./AssignmentManager.css";

const AssignmentManager = ({ isAdmin }) => {
    const [assignments, setAssignments] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newMaxPeople, setNewMaxPeople] = useState("");
    const [newGroup, setNewGroup] = useState("");

    const handleAddAssignment = (e) => {
        e.preventDefault();
        if (!newTitle || !newDescription || !newDate || !newMaxPeople || !newGroup) return;

        const newAssignment = {
            id: Date.now(),
            title: newTitle,
            description: newDescription,
            date: newDate,
            maxPeople: newMaxPeople,
            group: newGroup,
            registered: 0
        };

        setAssignments([newAssignment, ...assignments]);
        setNewTitle("");
        setNewDescription("");
        setNewDate("");
        setNewMaxPeople("");
        setNewGroup("");
    };

    const handleRegister = (id) => {
        setAssignments(assignments.map(a =>
            a.id === id && a.registered < a.maxPeople
                ? { ...a, registered: a.registered + 1 }
                : a
        ));
    };

    return (
        <div className="assignment-container">
            {isAdmin && (
                <div className="assignment-form">
                    <h2>Dodaj Zaduženje</h2>
                    <form onSubmit={handleAddAssignment}>
                        <input
                            type="text"
                            placeholder="Naslov"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Opis zaduženja..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Max ljudi"
                            value={newMaxPeople}
                            onChange={(e) => setNewMaxPeople(e.target.value)}
                            required
                        />
                        <select
                            value={newGroup}
                            onChange={(e) => setNewGroup(e.target.value)}
                            required
                        >
                            <option value="" disabled>Izaberi Radnu Grupu</option>
                            <option value="Bezbednost">Bezbednost</option>
                            <option value="Motivacija i Agitacija">Motivacija i Agitacija</option>
                            <option value="Logistika">Logistika</option>
                            <option value="Komunikacije">Komunikacije</option>
                        </select>
                        <button type="submit">Dodaj</button>
                    </form>
                </div>
            )}

            <div className="assignment-list">
                {assignments.length === 0 ? (
                    <p className="no-assignments">Nema dostupnih zaduženja.</p>
                ) : (
                    assignments.map((assignment) => (
                        <div key={assignment.id} className="assignment-card">
                            <h3 className="assignment-title">{assignment.title}</h3>
                            <p className="assignment-description">{assignment.description}</p>
                            <p className="assignment-meta">
                                Datum: {assignment.date} | Max ljudi: {assignment.maxPeople} | Prijavljeni: {assignment.registered}
                            </p>
                            <p className="assignment-group"><strong>Radna Grupa:</strong> {assignment.group}</p>
                            <button
                                className="register-button"
                                onClick={() => handleRegister(assignment.id)}
                                disabled={assignment.registered >= assignment.maxPeople}
                            >
                                {assignment.registered >= assignment.maxPeople ? "Popunjeno" : "Prijavi se"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignmentManager;
