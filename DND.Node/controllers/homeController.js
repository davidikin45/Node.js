(function (homeController) {

    var data = require("../data");
    var auth = require("../auth");

    homeController.init = function (app){
        app.get("/", function (req, res) {

            data.getNoteCategories(function (err, results) {
                res.render("index", {
                    title: "Note Board",
                    error: err,
                    categories: results,
                    newCatError: req.flash("newCatName"),
                    user: req.user
                });
            });     
        });

        //Only allow user to see page if authenticated
        app.get("/note/:categoryName",
            auth.ensureAuthenticated,
            function (req, res) {
            var categoryName = req.params.categoryName;

            data.getNoteCategories(function (err, results) {
                res.render("notes", {
                    title: categoryName,
                    user: req.user
                });
            });
        });

        app.post("/newCategory", function (req, res) {
            //body will contain post data in form encoded data. Make sure app.use(express.urlencoded()); has been executed
            var categoryName = req.body.categoryName;

            data.createNewCategory(categoryName, function (err) {
                if (err)
                {
                    console.log(err);
                    req.flash("newCatName", err);
                    res.redirect("/");
                }
                else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });
    };

})(module.exports);