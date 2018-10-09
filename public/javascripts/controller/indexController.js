app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) =>{
    
    $scope.messages = [];
    $scope.players = {};

    $scope.init = () =>{
        const username = prompt('Please Enter Username');
        if(username)
            initSocket(username);
        else
            return false;
    }

    function initSocket(username){
        const connOpt = {
            reconnectionAttempts: 5,
            reconnectionDelay: 500,
        };
        indexFactory.connectSocket('http://localhost:3000', connOpt)
        .then((socket) =>{
            socket.emit('newUser', {username: username});

            //initPlayer karşılamak
            socket.on('initPlayers', (players) =>{
                $scope.players = players;
                $scope.$apply();
            });

            //newUser Karşılamak
            socket.on('newUser', (data) =>{
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 1 // login or disconnect
                    }, //info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                $scope.$apply();
            });

            //disUser Karşılamak
            socket.on('disUser', (data) =>{
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    }, //info
                    username: data.username
                };
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                $scope.$apply();
            });

            //animate x, y coodinates
            socket.on('animate', data =>{
                $('#' + data.socketId).animate({'left': data.x, 'top': data.y}, () =>{
                    animate = false;
                });
            });

            //animate işlemleri
            let animate = false;
            $scope.onClickPlayer = ($event) =>{
                if(!animate){
                   let x = $event.offsetX;
                   let y = $event.offsetY;

                   socket.emit('animate', {x, y});

                   animate = true;
                   $('#' + socket.id).animate({'left': x, 'top': y}, () =>{
                       animate = false;  
                   });
               }
            };
        }).catch((error) =>{
            console.log(error);
        });
    }
}]);