import api from "./api";
import { useMutation } from "react-query";


export const useSendFormaPage = () => {

const submitForm = async ( answers) => {
    const res = await api.post(
        "/auth/submit-form",
        answers , // Ensure token is a string
        { withCredentials: true }
    );
    return res.data;
};
return useMutation(submitForm, {
    onSuccess: (data) => {
        navigate(data.Redirect);
        alert(data.Message);
    },
    onError: (error) => {
        console.error("Error submitting form:", error);
        alert("Submission failed, please try again.");
    }
});
}


