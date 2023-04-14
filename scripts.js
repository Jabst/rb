/* Z INDEX MAP 
     5 -> top
     0 -> bottom
*/

let deactiveInput = false;

fadeInCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 250,
        opacity: '1.0',
        easing: 'easeInQuad'
    })  
}

fadeOutCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 175,
        opacity: '0.0',
        easing: 'linear',
        delay: 125,
    })  
}


class Panel {
    zIndex = 0
    translate;
    htmlID;

    cssProperties;
    constructor(zIndex, htmlID) {
        this.zIndex = zIndex;
        this.htmlID = htmlID;
    }

    setZIndex = (zIndex) => {
        this.zIndex = zIndex;
    }

    setTranslate = (translate) => {
        this.translate = translate;
    }

    applyCSS = () => {
        $(`#${this.htmlID}`).css('z-index', this.zIndex);
    }
}

class PanelControl {
    panels;

    panelStack;
    isRecording;

    rec;

    backgrounds = {
        "voicemail": null,
        "sent": null,
        "loading": null,
        "shelter": null,
        "toy": null,
        "intro": null
    }

    audioCollection = {
        "name": null,
        "where": null,
        "look": null,
        "do": null
    }

    times = {
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
    }

    initBackgroundAt = (id) => {
        this.backgrounds[id] = VANTA.CLOUDS({
            el: `#${id}`,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0x8c5757,
            skyColor: 0x5a7091,
            cloudColor: 0x7a6e7a,
            cloudShadowColor: 0x696969,
            sunColor: 0xa0743f,
            sunGlareColor: 0x7f4533,
            sunlightColor: 0xffe3c8,
        })
    }

    cleanBackgrounds = () => {
        for (var property in this.backgrounds) {
            if (this.backgrounds[property] != null) {
                this.backgrounds[property].destroy();
            }
        }
    }

    zIndexAtTop() {
        this.cleanBackgrounds();
        this.panels.filter( elem => elem.htmlID == this.panelStack[0] )
                    .forEach(elem => {fadeInCard(elem.htmlID); elem.setZIndex(100); elem.applyCSS(); this.initBackgroundAt(elem.htmlID)});
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

    stopRecording = () => {
        if (this.panelStack[0] != 'toy' &&
            this.panelStack[0] != 'food' &&
            this.panelStack[0] != 'voicemail' &&
            this.panelStack[0] != 'shelter'  ){
                return;
        }
        this.recordTimeElapsed = Math.round(Math.abs(this.recordStartDate.getTime() - new Date().getTime()) / 1000);

        this.times[this.panelStack[0]] = this.recordTimeElapsed;
        this.audioCollection[this.panelStack[0]] = this.formatTimeElapsed(this.recordTimeElapsed);

        this.isRecording = !this.isRecording;

        $(".stop-button").hide();
        $(".record-button").show();

        console.log(this.audioCollection);
    }

    getIsRecording = () => {
        return this.isRecording;
    }

    setName = (name) => {
        this.audioCollection.name = name;
    }

    setWhere = (where) => {
        this.audioCollection.where = where;
    }

    setLook = (look) => {
        this.audioCollection.look = look;
    }

    setDo = (d) => {
        this.audioCollection.do = d;
    }

    formatRequestString = () => {
        return `${this.audioCollection.look} ${this.audioCollection.where} ${this.audioCollection.do}`
    }

    getPetName = () => {
        return this.audioCollection.name;
    }

    resetStack = () => {
        this.panelStack = [];
    }
}

panelFood = new Panel(0, 'food');
panelToy = new Panel(0, 'toy');
panelShelter = new Panel(0, 'shelter');
panelVoicemail = new Panel(0, 'voicemail');
panelIntro = new Panel(1, 'intro');
panelLoading = new Panel(0, 'loading');
panelSent = new Panel(0, 'sent');

rec = new AudioRecorder();

panelsControl = new PanelControl([panelFood,
    panelShelter,
    panelToy,
    panelVoicemail,
    panelIntro,
    panelLoading, 
    panelSent], rec);

cycle = ["intro", "food", "toy", "shelter", "voicemail", "loading", "sent"];

const getNextPanel = (currentPanel) => {
    if (currentPanel == "sent") {
        return "";
    }

    for (let i = 0; i < cycle.length; i++) {
        if (cycle[i] == currentPanel) {
            return cycle[i+1];
        }
    }

    return "sent";
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
    case "ArrowLeft":
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
        break;
    }
})

panelsControl.addStack('intro');

$(".stop-button").hide();


$(".stop-button").on('click', () => {
    if (!panelsControl.getIsRecording()) {
        panelsControl.startRecording();
    } else {
        panelsControl.stopRecording();
    }
});

$(".backward-button-rectangle").on('click', () => {
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".backward-button-icon").on('click', () => {
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".forward-button-rectangle").on('click', () => {
    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".forward-button-icon").on('click', () => {
    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});

// :)
$(".back-button").on('click', () => {
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$("#nme").on('input', () => {
    panelsControl.setName($("#nme").val());
});

$("#look").on('input', () => {
    panelsControl.setLook($("#look").val());
});

$("#do").on('input', () => {
    panelsControl.setDo($("#do").val());
});

$("#where").on('input', () => {
    panelsControl.setWhere($("#where").val());
});

$(".right-square").on('click', () => {
    console.log(panelsControl.formatRequestString());

    $(".pet-name-text").html(panelsControl.getPetName());

    requestImage(panelsControl.formatRequestString());

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});


$(".back-icon").on('click', () => {
    panelsControl.resetStack();
    panelsControl.addStack('intro');
});


$(".right-icon-f").on('click', () => {
    console.log(panelsControl.formatRequestString());

    $(".pet-name-text").html(panelsControl.getPetName());

    requestImage(panelsControl.formatRequestString());

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});

$(".front-button").on('click', () => {
    nextPanel = getNextPanel(panelsControl.topStack());

    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

const setImageOfPolaroidFrame = (urlString) => {
    console.log(urlString);

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }

    $('.image-placement').css('background-size', 'contain');
    $('.image-placement').css('background-image', `url(${urlString})`);
}

$(document).keypress(
    function(event){
        if (event.which == '13') {
        event.preventDefault();
        }
    }
);

$(".left-square").on('click', () => {
    panelsControl.resetStack();
    panelsControl.addStack('intro');
});

$(".left-icon-f").on('click', () => {
    panelsControl.resetStack();
    panelsControl.addStack('intro');
});
