const postEnvelope = (data) => {
    console.log(data);
    $.post("http://localhost:8081/send", {
        "toy": data.toy || "00:00",
        "place": data.shelter || "00:00",
        "food": data.food || "00:00",
        "name": data.name,
        "voicemail": data.voicemail || "00:00",
        "total": data.total,
    }, function(data, status) {
        console.log(data, status);
    })
}
