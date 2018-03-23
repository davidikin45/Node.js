(function (noteController) {

    var data = require("../../data");
    var auth = require("../../auth");

    noteController.init = function (app){
        app.get("/api/note/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {

            var categoryName = req.params.categoryName;

            data.getNotes(categoryName, function (err, results) {
                if (err) {
                    res.send(400, err);
                }
                else {
                    res.set("Content-Type", "application/json");
                    res.send(results.notes );
                }
            });     
        });

        app.post("/api/note/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {
            //body will contain post data in form encoded data. Make sure app.use(express.urlencoded()); has been executed
            var categoryName = req.params.categoryName;

            var noteToInsert = {
                note: req.body.note,
                color: req.body.color,
                author: "David Ikin"
            }

            data.addNote(categoryName, noteToInsert, function (err) {
                if (err) {
                    res.send(400, "Failed to add note to data store");
                }
                else {
                    res.set("Content-Type", "application/json");
                    res.send(201, noteToInsert); //created new object 
                }
            });
        });
    };

})(module.exports);