import api from "./api";
import { useMutation } from "react-query";


export const useSendFormaPage = () => {

const submitForm = async ( answers) => {
    const res = await api.post(
        "/auth/submit-form",
        answers , 
        { withCredentials: true }
    );
    return res.data;
};
return useMutation(submitForm);
}


