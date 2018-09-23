app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) =>{
    const connOpt = {
        reconnectionAttempts: 5,
        reconnectionDelay: 500,
    };
    indexFactory.connectSocket('http://localhost:3000', connOpt)
    .then((socket) =>{
        console.log('Bağlantı gerçekleşti', socket);
    }).catch((error) =>{
        console.log(error);
    });
}]);