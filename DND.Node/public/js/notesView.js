// notesView.js
(function (angular) {
    var theModule = angular.module("notesView", ["ui.bootstrap"]);

    theModule.controller("notesViewController", ["$scope","$window", "$http",
        function ($scope,$window, $http) {
            var vm = this;
            vm.save = save;

            function createBlankNote() {
                return {
                    note: "",
                    color: "yellow"
                };
            };

            vm.notes = [];
            vm.newNote = createBlankNote();

            //Get the category name
            var urlParts = $window.location.pathname.split("/");
            var categoryName = urlParts[urlParts.length - 1];
            var notesUrl = "/api/note/" + categoryName;
            $http.get(notesUrl).then(function (result) {
                vm.notes = result.data;
            }, function (err) {
                // Error
                alert(err);
                });

            var socket = io.connect();

            //Let server know which room we are part of
            socket.emit("join category", categoryName);

            //Receive server message
            socket.on("showThis", function (msg) {
                alert(msg);
            });

            //Receive server message
            socket.on("broadcast note", function (data) {
                vm.notes.push(data);
                $scope.$apply();
            });

            function save() {
                $http.post(notesUrl, vm.newNote).then(function (result) {
                    //success
                    vm.notes.push(result.data);
                    vm.newNote = createBlankNote();
                    socket.emit("newNote", { category: categoryName, note: result.data});
                }, function (err) {
                    // Error
                    alert(err);
                });
            };


        }
    ]);


})(window.angular);