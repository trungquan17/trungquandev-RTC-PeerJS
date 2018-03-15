const socket = io('http://localhost:3000');

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

    $('#btnRegister').bind('click', function () {
        let username = $('#username').val();
        socket.emit('user-register', { username: username, peerId: id });
    });
});

// user online
socket.on('list-user-online', function (userArr) {
    $('#div-register').hide();
    $('#div-chat').show();

    userArr.forEach(user => {
        let { username, peerId } = user;
        $('#user-online').append(`<li id="${ peerId }">${ username }</li>`);
    });

    socket.on('new-user', function (user) {
        let { username, peerId } = user;
        $('#user-online').append(`<li id="${ peerId }">${ username }</li>`);
    });

    socket.on('user-disconnect', function (peerId) {
        $(`#${ peerId }`).remove();
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

$(document).ready(function () {
    //call
    $('#user-online').bind('click', 'li', function () {
        let id = $(this).attr('id');
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
});
