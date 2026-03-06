// App.jsx
import SpeechToText from "./SpeechToText";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-100 overflow-hidden">
      <SpeechToText />
    </div>
  );
}