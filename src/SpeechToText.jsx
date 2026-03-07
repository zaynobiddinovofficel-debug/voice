import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

export default function SpeechToText() {
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const mediaRecorderRef = useRef(null);

    function handleClick() {
        if (!recording) {
            setResult(""); 

            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];

                recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

                recorder.onstop = () => {
                    setLoading(true);
                    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    const formData = new FormData();
                    formData.append("file", blob);
                    formData.append("language", "uz");

                    fetch("https://uzbekvoice.ai/api/v1/stt", {
                        method: "POST",
                        headers: { 
                            Authorization: "1e64eb54-24d1-4ce2-89ca-327905484e5f:f9caa827-e570-4542-9925-f3d75124b0ac" },
                        body: formData,
                    })
                        .then(res => res.json())
                        .then(data => {
                            let text = data.result?.conversation_text || data.text || "Matn topilmadi";
                            text = text.replace(/Speaker \d+:\s*/g, "");
                            setResult(text);
                        })
                        .catch(() => setResult("Xatolik yuz berdi"))
                        .finally(() => setLoading(false));
                };

                recorder.start();
                setRecording(true);
            }).catch(() => setResult("Mikrofonga ruxsat berilmadi"));
        } else {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                setRecording(false);
            }
        }
    }


    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <button
                onClick={handleClick}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition
        ${recording ? "bg-red-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            >
                {recording ? <Square size={32} /> : <Mic size={32} />}
            </button>
            <p className="text-lg font-medium text-gray-700">
                {recording ? "Gapiring..." : "Mikrofonni bosing"}
            </p>
            {loading && (
                <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="animate-spin" />
                    <span>Ovoz qayta ishlanmoqda...</span>
                </div>
            )}
            <div className="w-[500px] min-h-[120px] bg-white border rounded-xl shadow p-5 text-lg flex items-start">
                <span className="break-words">{result || "Natija shu yerda chiqadi..."}</span>
            </div>
        </div>
    );
}