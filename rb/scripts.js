/* Z INDEX MAP 
     5 -> top
     0 -> bottom
*/
class Panel {
    zIndex = 0
    htmlID;

    cssProperties;
    constructor(zIndex, htmlID, cssProperties) {
        this.zIndex = zIndex;
        this.htmlID = htmlID;
        this.cssProperties = cssProperties;
    }

    setZIndex = (zIndex) => {
        this.zIndex = zIndex;
    }

    applyCSS = () => {
        $(`#${this.htmlID}`).css('z-index', this.zIndex);

        for (let [k, v] of Object.entries(this.cssProperties)) {
            $(`#${this.htmlID}`).css(k, v);
        }
    }
}


class PanelControl {
    panels;

    panelStack;
    isRecording;

    rec;

    audioCollection = {
        "food": null,
        "toy": null,
        "shelter": null,
        "voicemail": null
    }

    constructor(panels, rec) {
        this.panels = panels;
        
        this.panelStack = ['main'];

        this.rec = rec;
        this.isRecording = false;
    }

    zIndexAtTop() {
        this.panels.filter( elem => elem.htmlID == this.panelStack[0] )
                    .forEach(elem => {console.log(elem); elem.setZIndex(5); elem.applyCSS();});
        this.panels.filter( elem => elem.htmlID != this.panelStack[0] )
                    .forEach(elem => {console.log(elem); elem.setZIndex(0); elem.applyCSS();});
    }

    addStack = (htmlID) => {
        if (this.isRecording) {
            return;
        }
        this.panelStack.unshift(htmlID);

        console.log(this.panelStack);
        this.redraw();
    }

    popStack = () => {
        if (this.isRecording) {
            return;
        }

        if (this.panelStack.length == 1) {
            return;
        }
        this.panelStack.shift();

        console.log(this.panelStack);
        this.redraw();
    }

    clearStack = (htmlID) => {
        if (this.isRecording) {
            return;
        }

        this.panelStack = [htmlID];
    }

    redraw = () => {
        this.zIndexAtTop();
    }
    
    startRecording = () => {
        if (this.panelStack[0] != 'toy' &&
            this.panelStack[0] != 'food' &&
            this.panelStack[0] != 'voicemail' &&
            this.panelStack[0] != 'shelter' ){
                return;
        }
        this.recordStartDate = new Date();
        this.isRecording = !this.isRecording;
    }

    stopRecording = () => {
        if (this.panelStack[0] != 'toy' &&
            this.panelStack[0] != 'food' &&
            this.panelStack[0] != 'voicemail' &&
            this.panelStack[0] != 'shelter'  ){
                return;
        }
        this.recordTimeElapsed = Math.round(Math.abs(this.recordStartDate.getTime() - new Date().getTime()) / 1000);
        this.audioCollection[this.panelStack[0]] = this.recordTimeElapsed;

        console.log(this.audioCollection);

        this.isRecording = !this.isRecording;
    }

    getIsRecording = () => {
        return this.isRecording;
    }
}

panelFood = new Panel(0, 'food', {'background-image': 'url(./assets/background.jpg)'});
panelToy = new Panel(0, 'toy', {'background-image': 'url(./assets/background.jpg)'});
panelShelter = new Panel(0, 'shelter', {'background-image': 'url(./assets/background.jpg)'});
panelVoicemail = new Panel(0, 'voicemail', {'background-image': 'url(./assets/background.jpg)'});
panelMain = new Panel(1, 'main', {'background-image': 'url(./assets/background.jpg)'});
panelIntro = new Panel(1, 'intro', {'background-image': 'url(./assets/background.jpg)'});

rec = new AudioRecorder();

panelsControl = new PanelControl([panelFood, panelShelter, panelToy, panelMain, panelVoicemail, panelIntro], rec);

document.addEventListener('keydown', async (event) => {
    switch (event.key) {
    case "q":
        panelsControl.addStack('food');
        break;
    case "w":
        panelsControl.addStack('toy');
        break;
    case "e":
        panelsControl.addStack('shelter');
        break;
    case "a":
        panelsControl.addStack('voicemail');
        break;
    case "r":
        panelsControl.addStack('main');
        break;
    case "s":
        panelsControl.addStack('intro');
        break;
    case "ArrowLeft":
        panelsControl.popStack();
        break;
    case " ":
        if (!panelsControl.getIsRecording()) {
            panelsControl.startRecording();
        } else {
            panelsControl.stopRecording();
        }
        break;
    }
  console.log("key ", event.key, " code ", event.code, " event " , event)
})