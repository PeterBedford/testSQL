<?php get_header();?>


            <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                <div class="row" style="margin-bottom: 15px;">
					<div>
						<select id="sets-dropdown">
							<option value="generate" selected>Test me</option>
						</select>
					</div>
                    <div class="input-group">
                        <div class="btn-toolbar" id="questions-SQL" role="toolbar" aria-label="Toolbar with button groups"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="panel panel-primary" style="margin-bottom: 0">
                        <div class="panel-heading"><span id="currQuestionTitle-SQL">Constructing Questions...</span></div>
                        <div class="panel-body">
                            <div id="currQuestion-SQL">Loading...</div>
                            <span class="pull-right small text-success" style="font-weight: bold; padding-top: 15px" id="status-SQL">
								Question Completed
								<button type="button" id="model-answer">Show model answer</button>
								<button type="button" id="next-Question">Next &gt;</button>
							</span>
                        </div>
                    </div>
                </div>
                <div class="row alert alert-dismissable" style="display: none; margin-bottom: 0; margin-top: 20px;" role="alert">
                    <a href="#" class="close" data-hide="alert" aria-label="Hide feedback">&times;</a>
                    <div id="response-SQL"></div>
                </div>
                <div class="row">
                    <h2> SQL Statement </h2>
                    <div class="form-group">
                        <textarea class="form-control textarea-sql" id="textarea-sql"></textarea>
                    </div>

                    <div class="form-group">
                        <button type="button" class="btn btn-success" id="exec-SQL">Run SQL &raquo; </button>
                        <button type="button" class="btn btn-danger" id="clear-SQL">Clear</button>
                    </div>
                </div>
                <!--/row-->
                <div class="row">
                    <h2 class="sub-header"> Result </h2>
                    <div id="results-SQL">
                        <p>Click "Run SQL" to execute the SQL statement above.</p>
                        <p>The menu to the left displays the database, and will reflect any changes.</p>
                        <p>You can restore the database at any time.</p>
                    </div>
                </div>
                <!--/.row-->
            </div>
            <!--/.col-xs-12.col-sm-9-->
        </div>
        <!--/row-->
    </div>
    <!-- /.container-fluid -->

<?php get_footer();?>