import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignmentManager.css";

const groupMapping = {
    2: "Bezbednost",
    3: "Motivacija i Agitacija",
    5: "Logistika",
    4: "Komunikacije"
};

const AssignmentManager = ({ isAdmin }) => {
    const [assignments, setAssignments] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newMaxPeople, setNewMaxPeople] = useState("");
    const [newGroup, setNewGroup] = useState("");

    // Fetch assignments on component mount
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get("http://192.168.255.63:4000/list_all_assignments", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data)
                if (response.data && Array.isArray(response.data)) {
                    // Convert API response structure to match component needs
                    const formattedAssignments = response.data.map((assignment) => ({
                        id: assignment.idZad,
                        title: assignment.naslov,
                        description: assignment.tekst,
                        date: assignment.datum,
                        maxPeople: assignment.max,
                        group: groupMapping[assignment.idGroup] || "Nepoznata grupa",
                        registered: assignment.brojPrijavljenih || 0
                    }));

                    setAssignments(formattedAssignments);
                }
            } catch (error) {
                console.error("Greška pri učitavanju zaduženja:", error);
            }
        };

        fetchAssignments();
    }, []);

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        if (!newTitle || !newDescription || !newDate || !newMaxPeople || !newGroup) return;

        const idGroup = Object.keys(groupMapping).find(key => groupMapping[key] === newGroup);
        if (!idGroup) return;

        const assignmentData = {
            naslov: newTitle,
            tekst: newDescription,
            datum: newDate,
            idGroup: parseInt(idGroup, 10),
            max: newMaxPeople
        };

        try {
            const token = sessionStorage.getItem("token");
            await axios.post("http://192.168.255.63:4000/register_assignment", assignmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newAssignment = {
                id: Date.now(), // Temporary ID for UI updates
                title: newTitle,
                description: newDescription,
                date: newDate,
                maxPeople: newMaxPeople,
                group: newGroup,
                registered: 0
            };

            setAssignments((prevAssignments) => [newAssignment, ...prevAssignments]);
            setNewTitle("");
            setNewDescription("");
            setNewDate("");
            setNewMaxPeople("");
            setNewGroup("");
        } catch (error) {
            console.error("Greška pri dodavanju zaduženja:", error);
        }
    };

    const handleRegister = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                "http://192.168.255.63:4000/apply_for_assignment",
                { idZad: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.status === 200) {
                setAssignments((prevAssignments) =>
                    prevAssignments.map((a) =>
                        a.id === id && a.registered < a.maxPeople
                            ? { ...a, registered: a.registered + 1 }
                            : a
                    )
                );
            }
        } catch (error) {
            console.error("Greška pri prijavi na zaduženje:", error);
        }
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
                            {Object.values(groupMapping).map((group) => (
                                <option key={group} value={group}>{group}</option>
                            ))}
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
                            <p className="assignment-group">
                                <strong>Radna Grupa:</strong> {assignment.group}
                            </p>
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
