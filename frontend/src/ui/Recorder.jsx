import React, { useEffect, useRef, useState } from "react";

function Recorder({ setContent, Icon }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false); // Track recording state in ref

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    let fullTranscript = "";

    recognition.onstart = () => {
      console.log("Recognition started");
      fullTranscript = ""; // Reset on start
    };

    recognition.onresult = (event) => {
      console.log("Recognition result received");
      let interimTranscript = "";
      let finalTranscript = "";

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || "";

        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update full transcript with only final results
      if (finalTranscript) {
        fullTranscript += finalTranscript;
      }

      // Set content with accumulated final + current interim
      const textToSet = fullTranscript + interimTranscript;
      console.log("Setting content:", textToSet);
      setContent(textToSet.trim());
    };

    recognition.onerror = (err) => {
      console.error("Recognition error:", err?.error || err);

      // Handle specific errors
      if (err?.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone permissions.");
        setIsRecording(false);
        isRecordingRef.current = false;
      } else if (err?.error === "no-speech") {
        console.log("No speech detected, continuing...");
      } else {
        setIsRecording(false);
        isRecordingRef.current = false;
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended, isRecording:", isRecordingRef.current);

      // Auto-restart if we should still be recording
      if (isRecordingRef.current) {
        try {
          console.log("Attempting to restart recognition");
          recognition.start();
        } catch (e) {
          console.warn("Failed to restart recognition:", e);
          setIsRecording(false);
          isRecordingRef.current = false;
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        if (recognitionRef.current) {
          isRecordingRef.current = false;
          recognitionRef.current.stop();
        }
      } catch (e) {
        console.warn("Recognition cleanup failed:", e);
      }
      recognitionRef.current = null;
    };
  }, [setContent]); // Only setContent as dependency

  const toggleRecording = () => {
    const rec = recognitionRef.current;

    if (!rec) {
      alert(
        "Speech recognition not supported in this browser.\n\n" +
          "Desktop: Try Chrome or Edge\n" +
          "Mobile: Limited support - try Chrome on Android (iOS Safari doesn't support it)"
      );
      return;
    }

    if (isRecording) {
      console.log("Stopping recording");
      isRecordingRef.current = false;
      try {
        rec.stop();
      } catch (e) {
        console.warn("Recognition stop failed:", e);
      }
      setIsRecording(false);
    } else {
      console.log("Starting recording");
      isRecordingRef.current = true;

      try {
        rec.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Recognition start failed:", e);
        isRecordingRef.current = false;

        if (e.message && e.message.includes("already started")) {
          alert(
            "Recording is already in progress. Please wait a moment and try again."
          );
        } else {
          alert(
            "Failed to start recording. Please check microphone permissions and try again."
          );
        }
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className="md:pl-24 sm:pl-24 p-2"
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      style={{
        opacity: isRecording ? 1 : 0.7,
        transition: "opacity 0.2s",
      }}
    >
      <span className={isRecording ? "speaking" : ""}>{Icon}</span>
      {isRecording && (
        <span style={{ fontSize: "10px", color: "red" }}> ●</span>
      )}
    </button>
  );
}

export default Recorder;
