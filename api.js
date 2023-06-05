

const requestImage = (prompt) => {
    console.log(prompt);
    $.ajax({
        url: "https://api.openai.com/v1/images/generations",
        data: JSON.stringify({"prompt": `${prompt}`,"n": 1,"size": "1024x1024"}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        success: function(data) {
            setImageOfPolaroidFrame(data.data[0].url);
        },
        dataType: 'json',
        type: 'post'
    });
}

const sendEmail = (c) => {
    console.log(c);
    $.ajax({
        url: "http://localhost:8081/send",
        data: JSON.stringify({
            "name": c.name,
            "email": c.email,
            "image": c.image
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        success: function(data) {
            console.log("yay");
        },
        dataType: 'json',
        type: 'post'
    });
}
