import { useEffect, useState } from "react";

export default function NotificationPopup() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data.message);
            console.log(data.message)

            setTimeout(() => setMessage(""), 3000);
        };

        return () => socket.close();
    }, []);

    if (!message) return null;

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {message}
        </div>
    );
}