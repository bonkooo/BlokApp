import React, { useState } from "react";
import "./recruitmentForm.css";

const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Bezbednost" },
    { id: 3, name: "Motivacija i Agitacija" },
    { id: 4, name: "Komunikacija" },
    { id: 5, name: "Logistika" },
    { id: 6, name: "Moderator" },
    { id: 7, name: "Redar" }
];

const RecruitmentForm = () => {
    const [formData, setFormData] = useState({
        ime: "",
        prezime: "",
        fakultet: "",
        brojIndeksa: "",
        selectedRole: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="recruitment-form-container">
            <h2>Prijava za Članstvo</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Ime:
                    <input type="text" name="ime" value={formData.ime} onChange={handleChange} required />
                </label>

                <label>
                    Prezime:
                    <input type="text" name="prezime" value={formData.prezime} onChange={handleChange} required />
                </label>

                <label>
                    Fakultet:
                    <input type="text" name="fakultet" value={formData.fakultet} onChange={handleChange} required />
                </label>

                <label>
                    Broj indeksa:
                    <input type="text" name="brojIndeksa" value={formData.brojIndeksa} onChange={handleChange} required />
                </label>

                <label>
                    Odaberi grupu:
                    <select name="selectedRole" value={formData.selectedRole} onChange={handleChange} required>
                        <option value=""></option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </label>

                <button type="submit">Prijavi se</button>
            </form>
        </div>
    );
};

export default RecruitmentForm;
