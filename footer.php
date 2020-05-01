<footer class="footer">
        <div class="container-fluid">
            <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                <div class="row" style="margin: 20px 0;">
                    <span class="text-muted">
						&copy; Joshua License (2017),
						<a href="https://www.shu.ac.uk/about-us/our-people/staff-profiles/charles-boisvert">Charles Boisvert, Sheffield Hallam University</a> (2017)</span>.
						Contribute or adapt the <a href="https://github.com/boisvert/testSQL">project on github</a>.
					</span>
                    <div class="btn-toolbar pull-right" id="sandbox-SQL" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group btn-toggle" role="group">
                            <button class="btn btn-xs btn-default disabled" style="cursor: help" title="Turn this off to manipulate the database how you see fit, on to return to questions" disabled>Prevent database changes</button>
                            <button class="btn btn-xs btn-default">ON</button>
                            <button class="btn btn-xs btn-default">OFF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script>
        window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')
    </script>
    <!-- Cookie -->
    <script src="js/cookie.js"></script>
    <!-- Main script -->
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <!-- CodeMirror -->
    <script src="https://codemirror.net/lib/codemirror.js"></script>
    <script src="https://codemirror.net/mode/sql/sql.js"></script>
    <script type="text/javascript">
        var sqlTextarea = document.getElementById('textarea-sql');
        var editableCodeMirror = CodeMirror.fromTextArea(sqlTextarea, {
            mode: "text/x-mysql",
            lineWrapping: true,
            lineNumbers: true,
            theme: "default",
        });

        $(function() {
            $("[data-hide]").on("click", function() {
                $("." + $(this).attr("data-hide")).hide();
            })
        });
    </script>
    <script src="js/sql.js"></script>
    <script src="js/main.js"></script>
</body>

</html>