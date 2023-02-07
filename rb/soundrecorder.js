audioCollection = {
    "food": null,
    "shelter": null,
    "toy": null
}

class AudioRecorder {
    
    constructor() {
        this.audioBlobs = [];
        this.mediaRecorder = null;
        this.streamBeingCaptured = null;
    }

    start = () => {
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then( (stream) => {
                this.streamBeingCaptured = stream;

                this.mediaRecorder = new MediaRecorder(stream); 
                this.audioBlobs = [];

                this.mediaRecorder.addEventListener("dataavailable", event => {
                    this.audioBlobs.push(event.data);
                });

                this.mediaRecorder.start();
        });
    }

    stop = () => {
        return new Promise(resolve => {
            this.mediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(this.audioBlobs, { type: "audio/mpeg" });
                
                resolve(audioBlob);
            });
            
            this.mediaRecorder.stop();
        });
    }
}