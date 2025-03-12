import React, { useState, useEffect } from "react";
import axios from "axios";
import "./recruitmentForm.css";

const GET_APPLICATIONS_URL = "http://192.168.255.63:4000/get_group_applications";
const SUBMIT_APPLICATION_URL = "http://192.168.255.63:4000/submit_group_application";
const ACCEPT_APPLICATION_URL = "http://192.168.255.63:4000/set_group";
const DENY_APPLICATION_URL = "http://192.168.255.63:4000/deny_submission";

const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Bezbednost" },
    { id: 3, name: "Motivacija i Agitacija" },
    { id: 4, name: "Komunikacija" },
    { id: 5, name: "Logistika" },
    { id: 6, name: "Moderator" },
    { id: 7, name: "Redar" }
];

const RecruitmentForm = ({ isAdmin }) => {
    const [formData, setFormData] = useState({
        ime: "",
        prezime: "",
        fakultet: "",
        indeks: "",
        selectedRole: ""
    });

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get(GET_APPLICATIONS_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const formattedSubmissions = response.data.map(app => ({
                    id: app.idPrijave,
                    idUser: app.idUser,
                    ime: app.ime,
                    prezime: app.prezime,
                    fakultet: app.fakultet,
                    indeks: app.indeks,
                    selectedRole: app.idGroup
                }));

                setSubmissions(formattedSubmissions);
            } catch (err) {
                setError("Failed to fetch applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        
        if (!formData.selectedRole) {
            alert("Molimo odaberite grupu!");
            return;
        }

        try {
            await axios.post(SUBMIT_APPLICATION_URL, {
                ime: formData.ime,
                prezime: formData.prezime,
                fakultet: formData.fakultet,
                indeks: formData.indeks,
                idGroup: parseInt(formData.selectedRole),
                idUser: sessionStorage.getItem("userId") // Ensure userId is stored in session
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Uspešno poslata prijava!");
        } catch (error) {
            alert("Neuspešno slanje prijave.");
        }

        setFormData({ ime: "", prezime: "", fakultet: "", indeks: "", selectedRole: "" });
    };

    const handleDecision = async (id, idUser, idGroup, accepted) => {
        const token = sessionStorage.getItem("token");
    
        if (accepted) {
            // If accepting, keep the current POST request
            const url = ACCEPT_APPLICATION_URL;
            try {
                await axios.post(url, { idUser, idGroup }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubmissions(submissions.filter(sub => sub.id !== id));
                alert("Korisnik je prihvaćen u grupu!");
            } catch (error) {
                alert("Korisnik je prihvaćen u grupu!");
            }
        } else {
            // If declining, use DELETE
            const url = DENY_APPLICATION_URL; // Assuming backend expects ID in URL
            try {
                await axios.post(url, { idUser, idGroup }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubmissions(submissions.filter(sub => sub.id !== id));
                alert("Korisnik je izbacen!");
            } catch (error) {
                alert("Korisnik je izbacen!");
            }
        }
    };
    

    return (
        <div className="recruitment-form-container">
            <h2>Prijava za Članstvo</h2>

            {isAdmin && (
                <div className="admin-panel">
                    <h3>Pregled prijava</h3>
                    {loading ? (
                        <p>Loading applications...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : submissions.length > 0 ? (
                        submissions.map((sub) => {
                            const groupName = roles.find(role => role.id === parseInt(sub.selectedRole))?.name || "Nepoznata grupa";
                            return (
                                <div key={sub.id} className="submission-card">
                                    <p><strong>{sub.ime} {sub.prezime}</strong> - {sub.fakultet}, {sub.indeks}</p>
                                    <p>Željena grupa: <strong>{groupName}</strong></p>
                                        <button className="accept-btn" onClick={() => handleDecision(sub.id, sub.idUser, sub.selectedRole, true)}>Prihvati</button>

                                        <button className="decline-btn" onClick={() => handleDecision(sub.id, sub.idUser, sub.selectedRole, false)}>Odbij</button>


                                </div>
                            );
                        })
                    ) : (
                        <p className="no-submissions">Nema novih prijava.</p>
                    )}
                </div>
            )}

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
                    <input type="text" name="indeks" value={formData.indeks} onChange={handleChange} required />
                </label>

                <label>
                    Odaberi grupu:
                    <select name="selectedRole" value={formData.selectedRole} onChange={handleChange} required>
                        <option value="">-- Odaberi --</option>
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