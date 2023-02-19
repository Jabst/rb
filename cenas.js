const { jsPDF } = require("jspdf"); // will automatically load the node version
var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

let cenas = base64_encode("./assets/logo.png");

const doc = new jsPDF({
    unit: "in",
    format: [11, 8]
});
doc.text("Hello world!", 1, 1);
doc.addImage(cenas, "PNG", 1, 2, 6, 3, "logo", "NONE", 0);

doc.save("a4.pdf"); // will save the file in the current working directory
