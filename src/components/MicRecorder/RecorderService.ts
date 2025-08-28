// recordService.ts
type RecordingData = {
  audioFileUrl: string;
  filename: string;
  duration: number;
};

class RecordService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private startTime = 0;
  private timer: NodeJS.Timeout | null = null;

  async startRecording(onUpdateTime?: (seconds: number) => void) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = this.getSupportedMimeType();
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.chunks = [];
    this.startTime = Date.now();

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      if (this.timer) clearInterval(this.timer);
    };

    this.mediaRecorder.start();

    if (onUpdateTime) {
      this.timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - this.startTime) / 1000);
        onUpdateTime(seconds);
      }, 1000);
    }
  }

  stopRecording(): RecordingData | null {
    if (!this.mediaRecorder) return null;

    this.mediaRecorder.stop();
    const duration = Math.floor((Date.now() - this.startTime) / 1000);

    const blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType });
    const audioFileUrl = URL.createObjectURL(blob);
    const filename = `cough_recording-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.${this.getExtension()}`;

    return { audioFileUrl, filename, duration };
  }

  isRecording() {
    return this.mediaRecorder?.state === "recording";
  }

  private getSupportedMimeType() {
    const types = ["audio/webm", "audio/mp4", "audio/ogg"];
    for (const type of types) if (MediaRecorder.isTypeSupported(type)) return type;
    return "audio/wav";
  }

  private getExtension() {
    const mime = this.mediaRecorder?.mimeType || "";
    if (mime.includes("webm")) return "webm";
    if (mime.includes("mp4")) return "mp4";
    if (mime.includes("ogg")) return "ogg";
    return "wav";
  }
}

export default new RecordService();
