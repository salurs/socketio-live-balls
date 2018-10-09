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
                $scope.$apply();
            });

            //animate işlemleri
            let animate = false;
            $scope.onClickPlayer = ($event) =>{
               if(!animate){
                   animate = true;
                   $('#' + socket.id).animate({'left': $event.offsetX, 'top': $event.offsetY});
                   animate = false;   
               }
            };
        }).catch((error) =>{
            console.log(error);
        });
    }
}]);