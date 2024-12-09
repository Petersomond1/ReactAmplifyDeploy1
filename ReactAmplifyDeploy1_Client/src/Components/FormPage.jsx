import React, { useState } from "react";
import { useMutation } from 'react-query';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSendFormaPage } from "../service/formPageService";

const FormPage = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState(['', '', '', '', '']);
    const {mutateAsync:sendFormPage} = useSendFormaPage();

    const handleSubmit = (e) => {
      e.preventDefault();
      sendFormPage( answers );
  };

    const handleInputChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Question 1: Who is your referral and suggested guide? </label>
            <input type="text" onChange={(e) => handleInputChange(0, e.target.value)} />
          </div>
          <div>
            <label>Question 2: What is your official name?</label>
            <input type="text" onChange={(e) => handleInputChange(1, e.target.value)} />
          </div>
          <br />
          <div>
            <label>Question 3: What is your alias (what do friends call you and what do you want friends to really call you)?</label>
            <input type="text" onChange={(e) => handleInputChange(2, e.target.value)} />
          </div>
          <br />
          <div>
            <label>Question 4: Where is your origin? Outline from root as your (a)clan/family, (b)communities of community/village/area, (c)your town/area of main town, (d)your council of local Govt, (e)your state, (f)your birth nationality. </label>
            <input type="text" onChange={(e) => handleInputChange(3, e.target.value)} />
          </div>
          <br />
          <div>
            <label>Question 5: Do you consider yourself well educated? If yes; what is your highest earned academic degree/certificate from an institution?</label>
            <input type="text" onChange={(e) => handleInputChange(4, e.target.value)} />
          </div>
          <button type="submit">Submit</button>
        </form>
    );
};

export default FormPage;