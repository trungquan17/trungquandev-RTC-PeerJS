function openStream () {
    let config = { audio: false, video:true };
    return navigator.mediaDevices.getUserMedia(config); //1 promise
}

function playStream (idVideoTag, stream) {
    let video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play;
}

//connect
let peer = new Peer({ key: '2jqx54113lfh6w29' });
peer.on('open', id => {
    $('#my-peer').append(id);
});

//call
$('#btnCall').bind('click', function () {
    let id = $('#remote-id').val();

    openStream()
    .then(localStream => {
        //play in local
        playStream('localStream', localStream);

        //start call and show video in remoteStream when user accept call
        let call = peer.call(id, localStream);
        call.on('stream', function (remoteStream) {
            playStream('remoteStream', remoteStream);
        });
    });
});

//answer
peer.on('call', function (call) {
    openStream()
    .then(localStream => {
        //answer stream
        call.answer(localStream);

        //play in local
        playStream('localStream', localStream);

        //play in remote
        call.on('stream', function (remoteStream) {
            playStream('remoteStream', remoteStream);
        });
    });
});