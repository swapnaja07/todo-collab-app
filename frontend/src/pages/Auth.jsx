import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const url = isLogin
                ? "http://127.0.0.1:8000/api/login/"
                : "http://127.0.0.1:8000/api/signup/";

            const payload = isLogin
                ? { email: email, password }
                : { email: email, password };

            const res = await axios.post(url, payload);

            if (isLogin) {
                localStorage.setItem("token", res.data.access);
                localStorage.setItem("user", email);
                navigate("/dashboard");
            } else {
                alert("Signup successful, please login");
                setIsLogin(true);
            }
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || "Something went wrong"));
        }
    };

    return (
        <div className="h-screen flex">

            {/* LEFT IMAGE */}
            <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <img
                    src="login.png"
                    alt="todo"
                    className="w-80"
                />
            </div>

            {/* RIGHT FORM */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-xl w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isLogin ? "Login" : "Signup"}
                    </h2>

                    <input
                        className="border p-3 w-full mb-3 rounded"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="border p-3 w-full mb-3 rounded"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700"
                    >
                        {isLogin ? "Login" : "Signup"}
                    </button>

                    <p
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm mt-4 text-center cursor-pointer text-blue-500"
                    >
                        {isLogin
                            ? "New user? Signup"
                            : "Already have account? Login"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;