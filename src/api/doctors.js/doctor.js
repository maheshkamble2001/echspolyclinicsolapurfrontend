import { encryptData, decryptData } from "../../configs/encryption";
import { instance as axios } from "../../configs/axiosInstance";
import Cookies from "js-cookie";

const isEncryptionEnabled = import.meta.env.VITE_ENCRYPTION === "true";

// Get All Doctors List
export const getDoctorsList = async (data) => {
  const access_token = Cookies.get("access_token");

  const payload = isEncryptionEnabled
    ? encryptData({ ...data,access_token })
    : { ...data,access_token };

  try {
    const response = await axios.get("/listDoctors", {
      params: isEncryptionEnabled ? { reqData: payload } : payload,
    });

    const decrypted = isEncryptionEnabled ? decryptData(response) : response.data;
    return decrypted;
  } catch (error) {
    console.error("Error inside getDoctorsList:", error);
    throw error;
  }
};


export const doctorLogin = async (data) => {
  try {
    const payload = isEncryptionEnabled
      ? { reqData: encryptData(data) }
      : data;

    const response = await axios.post("/doctorLogin", payload);
    
    const decrypted = isEncryptionEnabled ? decryptData(response) : response.data;
    return decrypted;
  } catch (error) {
    console.error("Error inside doctorLogin:", error);
    throw error;
  }
};