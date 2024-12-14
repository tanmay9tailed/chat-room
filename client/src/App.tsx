import React, { useState, useEffect } from "react";

const App = () => {
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const joinRoom = () => {
    if (ws && roomId) {
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
      setJoinedRoom(roomId);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (ws && message) {
      ws.send(
        JSON.stringify({ type: "chat", payload: { roomId: joinedRoom, message } })
      );
      setMessage("");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">WebSocket Chat App</h1>

      {/* Join Room Section */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Join a Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>

      {/* Chat Section */}
      {joinedRoom && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-lg font-semibold mb-4">
            Room: <span className="text-blue-600">{joinedRoom}</span>
          </h2>

          <div className="flex-grow h-60 border p-2 mb-4 overflow-auto rounded bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="p-1 text-gray-700">
                  {msg}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet...</p>
            )}
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
