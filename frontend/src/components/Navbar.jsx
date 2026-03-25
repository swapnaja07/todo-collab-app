import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md">

            {/* 🔹 Logo Section */}
            <h1 className="text-2xl font-bold text-white tracking-wide cursor-pointer">
                Todo Board
            </h1>

            {/* 🔹 Right Section */}
            <div className="flex items-center gap-4">

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;