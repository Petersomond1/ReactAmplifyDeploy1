import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FormPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState(['', '']);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("http://localhost:3000/submit-form", { token, answers });
        if (res.data.Status === "Success") {
            navigate(res.data.Redirect);
        } else {
            alert(res.data.Message);
        }
    };

    const handleInputChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
      };
      
      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Question 1</label>
            <input type="text" onChange={(e) => handleInputChange(0, e.target.value)} />
          </div>
          <div>
            <label>Question 2</label>
            <input type="text" onChange={(e) => handleInputChange(1, e.target.value)} />
          </div>
          <button type="submit">Submit</button>
        </form>
      );
}

export default FormPage;
