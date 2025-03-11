import React, { useState } from "react";
import "./quiz.css";

const questions = [
    { 
        question: "Kako reaguješ u hitnim situacijama?", 
        options: [
            { text: "Održavam mir i organizujem ljude", group: "bezbednost" },
            { text: "Podižem moral i motivišem", group: "motivacija" },
            { text: "Razmišljam kako da obezbedim potrebne resurse", group: "logistika" },
            { text: "Obaveštavam sve i koordiniram komunikaciju", group: "komunikacije" }
        ] 
    },
    { 
        question: "Šta te najviše privlači u timskom radu?", 
        options: [
            { text: "Briga o sigurnosti i redu", group: "bezbednost" },
            { text: "Povezivanje i inspiracija drugih", group: "motivacija" },
            { text: "Efikasnost i organizacija", group: "logistika" },
            { text: "Komunikacija i širenje informacija", group: "komunikacije" }
        ] 
    },
    { 
        question: "Kakav si u kriznim situacijama?", 
        options: [
            { text: "Preuzimam kontrolu i osiguravam bezbednost", group: "bezbednost" },
            { text: "Podižem moral i održavam atmosferu", group: "motivacija" },
            { text: "Brzo smišljam plan za rešavanje problema", group: "logistika" },
            { text: "Obaveštavam sve o razvoju situacije", group: "komunikacije" }
        ] 
    },
    { 
        question: "Šta ti je najvažnije u projektu?", 
        options: [
            { text: "Da sve bude bezbedno i pod kontrolom", group: "bezbednost" },
            { text: "Da svi budu motivisani i uključeni", group: "motivacija" },
            { text: "Da sve funkcioniše bez problema", group: "logistika" },
            { text: "Da komunikacija bude jasna i brza", group: "komunikacije" }
        ] 
    }
];

const Quiz = () => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleAnswer = (questionIndex, group) => {
        setAnswers({ ...answers, [questionIndex]: group });
    };

    const calculateResult = () => {
        let scores = { bezbednost: 0, motivacija: 0, logistika: 0, komunikacije: 0 };
        Object.values(answers).forEach(group => scores[group]++);
        let bestFit = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
        setResult(bestFit);
    };

    return (
        <div className="quiz-container">
            <h2>Test ličnosti: Koja grupa je za tebe?</h2>
            {questions.map((q, index) => (
                <div key={index} className="question">
                    <p>{q.question}</p>
                    {q.options.map(option => (
                        <label key={option.text} className="option">
                            <input 
                                type="radio" 
                                name={`question-${index}`} 
                                onChange={() => handleAnswer(index, option.group)}
                            />
                            {option.text}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={calculateResult} className="submit-btn">Pošalji odgovore</button>
            {result && <p className="result">Najbolja grupa za tebe je: <strong>{result}</strong></p>}
        </div>
    );
};

export default Quiz;
