const apiKey = "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"

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
