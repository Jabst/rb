const key = "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";

const sendEmail = (prompt) => {
    console.log(prompt);
    $.ajax({
        url: "https://api.sendgrid.com/v3/mail/send",
        data: JSON.stringify({"personalizations": [{"to": [{"email": "jabst123@gmail.com"}]}],
            "from": {"email": "test@example.com"},
            "subject": "Sending with SendGrid is Fun",
            "content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        success: function(data) {
            console.log(data);
        },
        dataType: 'json',
        type: 'post'
    });
}

