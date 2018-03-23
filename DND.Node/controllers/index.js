(function (controllers) {
    var homeController = require("./homeController");
    var noteController = require("./api/noteController");

    controllers.init = function (app) {
        homeController.init(app);
        noteController.init(app);
    };

})(module.exports);