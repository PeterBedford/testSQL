<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <
    

    <title>TestSQL - Learn SQL Interactively</title>
   
    <?php wp_head();?> 

    <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
    <script>
        window.addEventListener("load", function() {
            window.cookieconsent.initialise({
                "palette": {
                    "popup": {
                        "background": "#000"
                    },
                    "button": {
                        "background": "#f1d600"
                    }
                },
                "position": "bottom-left",
                "content": {
                    "href": "https://www.cookielaw.org/cookie-compliance/"
                }
            })
        });
    </script>

</head>

<body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button title="Show database tables" type="button" class="navbar-toggle collapsed pull-left tables-toggle" data-toggle="collapse" data-target=".sidebar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle database tables</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
                <label class="navbar-toggle btn btn-default" title="Import a database">
					<span class="sr-only">Import a custom database</span>
					<i class="glyphicon glyphicon-folder-open" style="color:white"></i>
					<input type="file" class="import-SQL" style="display: none;">
				</label>
                <a class="navbar-brand" href="/"><span style="color:white;">Test</span><span style="color:#337ab7; font-weight:bold;">SQL</span></a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <div class="nav navbar-btn pull-right">
                    <label class="btn btn-default btn-sm">
						Import a custom database <input type="file" class="import-SQL" style="display: none;">
					</label>
                </div>
            </div>
            <!--/.nav-collapse -->
        </div>
    </nav>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-3 col-md-2 sidebar">
                <h4 class="text-center sub-header"> Your Database </h4>
                <h5 style="font-weight:bold;"> <span class="pull-right">Records </span> Table</h5>
                <ul class="nav nav-sidebar" id="tables-SQL"></ul>
                <p class="text-center"><button type="button" class="btn btn-primary" id="restore-SQL" onclick="return confirm('Are you sure you want to restore the database to the default?');">Restore Database</button></p>
                <!-- p class="text-center"><a href="" id="save-SQL" onclick="" download="sql.db">Save Database to file</a></p -->
            </div>
