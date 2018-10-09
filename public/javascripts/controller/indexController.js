app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) =>{
    
    $scope.messages = [];

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

            socket.on('newUser', (data) =>{
                const messageData = {
                    type: 0, //info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.$apply();
            });
        }).catch((error) =>{
            console.log(error);
        });
    }
}]);