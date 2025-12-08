import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, StopCircle, Loader2 } from "lucide-react";

interface VideoRecorderProps {
  onRecordingComplete: (file: File) => void;
  onCancel: () => void;
}

export default function VideoRecorder({
  onRecordingComplete,
  onCancel,
}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Failed to access camera. Please grant camera permissions.");
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    try {
      if (!streamRef.current) {
        setError("Camera stream not available");
        return;
      }

      chunksRef.current = [];

      // Optimized: Use VP8 for better playback compatibility and performance
      const options: MediaRecorderOptions = {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
        // No need for fallback checks; VP8 is broadly supported
      };

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await processRecording();
      };

      mediaRecorder.onerror = (event: any) => {
        console.error("MediaRecorder error:", event);
        setError("Recording failed. Please try again.");
        setIsRecording(false);
      };

      // Optimized: Larger timeslice for fewer chunks (better for short recordings)
      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Recording start error:", err);
      setError("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);

    try {
      console.log(
        "Processing recording with",
        chunksRef.current.length,
        "chunks"
      );

      const mimeType = mediaRecorderRef.current?.mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });

      console.log("Blob created:", {
        size: blob.size,
        type: blob.type,
      });

      if (blob.size === 0) {
        throw new Error("Recording resulted in empty file");
      }

      const timestamp = Date.now();
      const file = new File([blob], `recording-${timestamp}.webm`, {
        type: mimeType,
        lastModified: timestamp,
      });

      console.log("File created:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Clean up camera stream before completing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      onRecordingComplete(file);
    } catch (err: any) {
      console.error("Processing error:", err);
      setError("Failed to process recording. Please try again.");
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div
        className="relative rounded-lg overflow-hidden bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-white text-9xl font-bold"
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-full">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <span className="font-semibold text-sm">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <Loader2
                className="mx-auto mb-2 text-white animate-spin"
                size={48}
              />
              <p className="text-white text-sm">Processing video...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {!isRecording && countdown === null && !isProcessing && (
          <>
            <motion.button
              onClick={startCountdown}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                background:
                  "linear-gradient(90deg,#F6C066 0%, #F0A43A 50%, #E38826 100%)",
                color: "#111827",
                boxShadow:
                  "0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2), 0 18px 36px rgba(227,129,38,0.18), inset 0 6px 18px rgba(255,255,255,0.08)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.3), 0 18px 36px rgba(227,129,38,0.18), inset 0 6px 18px rgba(255,255,255,0.08)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Video size={20} />
              Start Recording
            </motion.button>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </>
        )}

        {isRecording && (
          <motion.button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StopCircle size={20} />
            Stop Recording
          </motion.button>
        )}
      </div>

      <p className="mt-3 text-center text-sm text-white">
        {!isRecording &&
          countdown === null &&
          !isProcessing &&
          "Click 'Start Recording' to begin after a 3-second countdown"}
        {isRecording &&
          "Recording in progress... Click 'Stop Recording' when finished"}
        {isProcessing && "Please wait while we process your recording..."}
      </p>
    </div>
  );
}
