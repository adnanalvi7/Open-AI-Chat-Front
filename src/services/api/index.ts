import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const fetchMessages = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  console.log("API Response (fetchMessages):", response);
  return response.data;
};

export const sendMessage = async (messageData: {
  user: string;
  message: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}`, messageData);
  return response.data;
};

// **Login API**
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    console.log("Login Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// **Signup API**
export const singUpUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name,
      email,
      password,
    });
    console.log("Login Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// **Send Otp code for reset password**
export const sendOtpCode = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
    console.log("code sent", response.data);
    return response.data;
  } catch (error) {
    console.error("failed to send code:", error);
    throw error;
  }
};

// **Verify Otp code for reset password**
export const verifyOtpCode = async (otp: string, email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      otp,
      email,
    });
    console.log("code verified", response.data);
    return response.data;
  } catch (error) {
    console.error("failed to verify code:", error);
    throw error;
  }
};

// **Reset password**
export const resetPassword = async (newPassword: string, email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      newPassword,
      email,
    });
    console.log("password changed", response.data);
    return response.data;
  } catch (error) {
    console.error("failed to verify code:", error);
    throw error;
  }
};
