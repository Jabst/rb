/* Z INDEX MAP 
     5 -> top
     0 -> bottom
*/

let deactiveInput = true;

fadeInCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 300,
        opacity: '1.0',
        easing: 'cubicBezier(0.775, 1.320, 0.980, 0.825)'
    })  
}

fadeOutCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 300,
        opacity: '0.0',
        easing: 'cubicBezier(0.775, 1.320, 0.980, 0.825)'
    })  
}


class Panel {
    zIndex = 0
    translate;
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

    setTranslate = (translate) => {
        this.translate = translate;
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
        
        this.panelStack = [];

        this.rec = rec;
        this.isRecording = false;

        this.positionPanels();
    }

    positionPanels = () => {
        this.panels.forEach( elem => {
            elem.setTranslate('-1920px');
            elem.applyCSS();
        })
    }

    zIndexAtTop() {
        this.panels.filter( elem => elem.htmlID == this.panelStack[0] )
                    .forEach(elem => {fadeInCard(elem.htmlID); elem.setZIndex(100); elem.applyCSS()});
        this.panels.filter( elem => elem.htmlID != this.panelStack[0] )
                    .forEach(elem => {fadeOutCard(elem.htmlID); elem.setZIndex(0); elem.applyCSS()});
    }

    addStack = (htmlID) => {
        if (this.isRecording) {
            return;
        }
        this.panelStack.unshift(htmlID);

        console.log(this.panelStack);
        this.redraw();
    }

    topStack = () => {
        return this.panelStack[0];
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

    restartRecording = () => {
        this.audioCollection[this.panelStack[0]] = null;

        console.log(this.audioCollection);
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

        $(".stop-button").show();
        $(".record-button").hide();

        console.log(this.audioCollection);
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

        this.isRecording = !this.isRecording;

        $(".stop-button").hide();
        $(".record-button").show();

        console.log(this.audioCollection);
    }

    getIsRecording = () => {
        return this.isRecording;
    }
}

panelFood = new Panel(0, 'food', {'background-image': 'url(./assets/background.jpg)',
                                    'opacity': '0.0'});
panelToy = new Panel(0, 'toy', {'background-image': 'url(./assets/background.jpg)',
                                'opacity': '0.0'});
panelShelter = new Panel(0, 'shelter', {'background-image': 'url(./assets/background.jpg)',
                                        'opacity': '0.0'});
panelVoicemail = new Panel(0, 'voicemail', {'background-image': 'url(./assets/background.jpg)',
                                        'opacity': '0.0'});
panelMain = new Panel(1, 'main', {'background-image': 'url(./assets/background.jpg)'});
panelIntro = new Panel(1, 'intro', {'background-image': 'url(./assets/background.jpg)',
                                    'opacity': '0.0'});

rec = new AudioRecorder();

panelsControl = new PanelControl([panelFood, panelShelter, panelToy, panelMain, panelVoicemail, panelIntro], rec);

cycle = ["main", "intro", "food", "toy", "shelter", "voicemail"];

const getNextPanel = (currentPanel) => {
    if (currentPanel == "voicemail") {
        return "";
    }

    for (let i = 0; i < cycle.length; i++) {
        if (cycle[i] == currentPanel) {
            return cycle[i+1];
        }
    }

    return "voicemail";
}

const getPreviousPanel = (currentPanel) => {
    if (currentPanel == "intro") {
        return "";
    }

    for (let i = 0; i < cycle.length; i++) {
        if (cycle[i] == currentPanel) {
            return cycle[i-1];
        }
    }

    return "intro";
}

document.addEventListener('keydown', async (event) => {

    if (deactiveInput) {
        return;
    }

    let nextPanel = "";
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
    case "d":
        panelsControl.restartRecording();
        break;
    /*case "ArrowLeft":
        nextPanel = getPreviousPanel(panelsControl.topStack());
        if (nextPanel != "") {
            panelsControl.addStack(nextPanel)
        }
        break;
    case "ArrowRight":
        nextPanel = getNextPanel(panelsControl.topStack());
        if (nextPanel != "") {
            panelsControl.addStack(nextPanel)
        }
        break;*/
    case " ":
        if (!panelsControl.getIsRecording()) {
            panelsControl.startRecording();
        } else {
            panelsControl.stopRecording();
        }
        break;
    }
})

panelsControl.addStack('main');
panelsControl.addStack('intro');

anime({
    targets: '#main',
    opacity: '0.0',
    duration: 1000,
    easing: 'cubicBezier(0.775, 1.320, 0.980, 0.825)'
})

anime({
    targets: '#intro',
    opacity: '1.0',
    duration: 1000,
    easing: 'cubicBezier(0.775, 1.320, 0.980, 0.825)',
    delay: 1000
}).finished.then(function() {
    deactiveInput = false;
});

$(".stop-button").hide();


$(".stop-button").on('click', () => {
    if (!panelsControl.getIsRecording()) {
        panelsControl.startRecording();
    } else {
        panelsControl.stopRecording();
    }
});

$(".button-rectangle-1").on('click', () => {
    console.log("back");
    nextPanel = getPreviousPanel(panelsControl.topStack());
    console.log(nextPanel);
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".button-rectangle-2").on('click', () => {
    panelsControl.restartRecording();
});

$(".button-rectangle-3").on('click', () => {
});

$(".button-rectangle-4").on('click', () => {
    if (!panelsControl.getIsRecording()) {
        panelsControl.startRecording();
    } else {
        panelsControl.stopRecording();
    }
});
$(".button-rectangle-5").on('click', () => {
    console.log("front");
    nextPanel = getNextPanel(panelsControl.topStack());

    console.log(nextPanel);
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

// :)
$(".back-button").on('click', () => {
    console.log("back");
    nextPanel = getPreviousPanel(panelsControl.topStack());
    console.log(nextPanel);
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".restart-button").on('click', () => {
    panelsControl.restartRecording();
});

$(".save-button").on('click', () => {
});

$(".record-button").on('click', () => {
    if (!panelsControl.getIsRecording()) {
        panelsControl.startRecording();
    } else {
        panelsControl.stopRecording();
    }
});
$(".front-button").on('click', () => {
    console.log("front");
    nextPanel = getNextPanel(panelsControl.topStack());

    console.log(nextPanel);
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

let cloudClick = false;

$(".cloud").on('click', () => {
    /*if (!cloudClick) {
        
    }
    cloudClick = true;*/

    panelsControl.addStack('food');
});
