/* Z INDEX MAP 
     5 -> top
     0 -> bottom
*/

let deactiveInput = false;

let imageUrl = '';
let userEmail = '';
let petName = '';

fadeInCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 250,
        opacity: '1.0',
        easing: 'easeInQuad',
        begin: function(anim) {
            //  deactiveInput = true;
        },
    });
}

fadeOutCard = (id) => {
    anime({
        targets: `#${id}`,
        duration: 175,
        opacity: '0.0',
        easing: 'linear',
        delay: 125,
        complete: function(anim) {
            deactivateInput = false;
        }
    });
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
            skyColor: 0x4dc8fc,
            cloudColor: 0xff327a,
            cloudShadowColor: 0x211850,
            sunColor: 0xed17e0,
            sunGlareColor: 0xe8c8ff,
            sunlightColor: 0x0
        })
    }

    isIntro = () => {
        return this.panelStack[0] == 'intro'
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

    resetInputs = () => {
        this.setWhere("");
        this.setLook("");
        this.setDo("");
    }

    formatRequestString = () => {
        return `${this.audioCollection.look} ${this.audioCollection.where} ${this.audioCollection.do} in happy mood , water colour painting`
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


panelsControl.addStack('intro');

$(".backward-button-rectangle").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".backward-button-icon").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".forward-button-rectangle").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".forward-button-icon").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});

// :)
$(".back-button").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$("#nme").on('input', () => {
    panelsControl.setName($("#nme").val());

    petName = $("#nme").val();
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
    if (deactiveInput) {
        return;
    }
    console.log(panelsControl.formatRequestString());

    $(".pet-name-text").html(panelsControl.getPetName());

    requestImage(panelsControl.formatRequestString());

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});

$(".send-to-email-icon").on('click', () => {

    sendEmail({
        name: petName,
        email: userEmail,
        image: imageUrl
    })
});


$(".back-icon").on('click', () => {
    if (deactiveInput) {
        return;
    }
    panelsControl.resetStack();
    panelsControl.addStack('intro');

    panelsControl.resetInputs();

    $("#where").val("");
    $("#do").val("");
    $("#look").val("");
    $("#nme").val("");
});


$(".right-icon-f").on('click', () => {
    if (deactiveInput) {
        return;
    }
    console.log(panelsControl.formatRequestString());

    $(".pet-name-text").html(panelsControl.getPetName());

    requestImage(panelsControl.formatRequestString());

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }
});

$(".front-button").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getNextPanel(panelsControl.topStack());

    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});


const setImageOfPolaroidFrame = (urlString) => {

    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel);
    }

    $('.image-placement').css('background-size', 'contain');
    $('.image-placement').css('background-image', `url(${urlString})`);

    imageUrl = urlString;
}

const getEmail = () => {
    userEmail = prompt("Enter your email address.");
}



$(document).keypress(
    function(event){
        if (event.which == '13') {
        event.preventDefault();
        }
    }
);


$(".left-square").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});

$(".left-icon-f").on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getPreviousPanel(panelsControl.topStack());
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});


$('#intro').on('click', () => {
    if (deactiveInput) {
        return;
    }
    nextPanel = getNextPanel(panelsControl.topStack());
    
    if (nextPanel != "") {
        panelsControl.addStack(nextPanel)
    }
});