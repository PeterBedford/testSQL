
// @param: database object 
function saveDB(db) {
	var result = db.export(),
		strings = [],
		chunksize = 0xffff
	for (var i = 0; i * chunksize < result.length; i++)
		strings.push(String.fromCharCode.apply(null, result.subarray(i * chunksize, (i + 1) * chunksize)));
	window.localStorage.setItem('DefaultDB', strings.join(''));
}

// export the binary database
function saveToFile(db) {
	var result = db.export()
	var blob = new Blob([result]);
	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(blob);
	a.download = 'sql.db';
	a.onclick = function() {
		setTimeout(function() {
			window.URL.revokeObjectURL(a.href);
		}, 1500);
	};
	a.click();
	debugMsg("check your downloads");
}

// fresh database!
function DefaultDB() {
	// fetch the database!
	alert("getting "+useDB);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'database/'+useDB, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
		var uInt8Array = new Uint8Array(this.response);
		// set to global db
		db = new SQL.Database(uInt8Array);
		saveDB(db)
		updateView(true)
	};
	xhr.send();
}

function removeCookies() {
	// remove all the cookies for the questions
	for (var c in Cookies.get()) {
		Cookies.remove(c)
	}
}

// construct the sidebar to display the tables in the current database
function showTables() {
	var html = "",
		sql = "SELECT tbl_name FROM sqlite_master WHERE type='table' AND tbl_name NOT LIKE 'testsql%'",
		results = db.exec(sql),
		rows = results[0].values,
		tbl_name, count;

	debugMsg("Tables: ",results);

	for (var i = 0; i < rows.length; i++) {
		tbl_name = rows[i];
		count = db.exec("SELECT COUNT(*) FROM `" + tbl_name + "`");
		html = html + '<li data-tbl-name="' + tbl_name + '"><a>' + tbl_name + '<span class="badge pull-right">' + count[0].values[0][0] + '</span></a></li>'
	}
	$('#tables-SQL').html(html);
}

// load and update ready Q&A in sections, set section choices
function updateSections() {
	var sql = "SELECT distinct section FROM testsql_question",
		results, numSections, section_name;

	try {
		results = db.exec(sql);
		var rows = results[0].values,
			numSections = rows.length;

		debugMsg("Question sections: ",results);
		if (numSections>0) {
			selectedSection = getSelectedSection();
			var section_name,
				option = '<option value="choose" selected>Pick a question set</option>',
				sectionMenu = $("#sets-dropdown").html(option);
			for (var i = 0; i < numSections; i++) {
				section_name = rows[i][0];
				debugMsg("Section: ",section_name);
				option = '<option value="'+section_name+'">'+section_name+'</option>';
				sectionMenu.append(option);
			}
			sectionMenu.append('<option value="generate">Test me</option>');
			sectionMenu.val(selectedSection);
			sectionMenu.change(
				function() {
					selectedSection = $(this).val();
					Cookies.set('selectedSection',selectedSection);
					currQuestion = getCurrQuestion();
					updateQuestions();
				}
			);
		}
	}
	catch(e) {
		debugMsg('Error: ',e);
	}
}

function getQuestionProgress() {
	var ss = getSelectedSection();
	if (ss == 'choose') return undefined;
	var qp = Cookies.get('QuestionProgress-'+ss);
	QuestionProgress = isDef(qp) ? JSON.parse(qp) : []; // note: was Base64.decode(qp)
	return QuestionProgress;
}

function setQuestionProgress(QuestionProgress) {
	var ss = getSelectedSection();
	if (ss != 'choose') {
		Cookies.set('QuestionProgress-'+ss, JSON.stringify(QuestionProgress)); // was Base64(JSON...)
	}
}

function getCurrQuestion() {
	var ss = getSelectedSection(),
		cq;
	if (ss == 'choose')
		cq = undefined;
	else {
		cq = Cookies.get('CurrQuestion-'+ss);
		//if (isDef(cq)) cq = Base64.decode(cq);
	}
	debugMsg("Current question is ",cq);
	return cq;
}

// set the Current Question
// @param cq - question to set
function setCurrQuestion(cq) {
	var ss = getSelectedSection();
	if (ss != 'choose') {
		Cookies.set('CurrQuestion-'+ss, cq); // was Base64.encode(cq)
	}
	currentQuestion = cq;
}

// selectedSection - current section from the questions
function getSelectedSection() {
	var ss = Cookies.get('selectedSection');
	selectedSection = isDef(ss) ? ss : 'choose';
	debugMsg("Current section is ",selectedSection);
	return selectedSection;
}

// isDef - returns true if X is defined, false otherwise
function isDef(X) {
    return (typeof X != 'undefined')
}

// update the sidebar!
function updateView(full) {
	full = (typeof full !== 'undefined') ? full : false
	if (full === true) {
		// get the current question
		updateSections();
		currQuestion = getCurrQuestion();
		updateQuestions();
	}
	showTables();
}

// clean the webpage from user input! 
// @param {bool} full - removes the editable area contents if TRUE!
function cleanView(full) {
	full = (typeof full !== 'undefined') ? full : false

	hideFeedback()
	$('#results-SQL').html(defaultResultsText)

	if (full === true) {
		editableCodeMirror.setValue("")
	}
}

// restore tables back to the default trusty database!
function restore() {
	// grab all tables
	var results = db.exec("SELECT DISTINCT `tbl_name` FROM `sqlite_master` WHERE tbl_name != 'sqlite_sequence'")

	// and remove them one-by-one
	for (var i = 0; i < results[0].values.length; i++) {
		var tbl_name = results[0].values[i][0]

		db.exec("DROP TABLE `" + tbl_name + "`");
	}

	// remove all the cookies for the questions
	for (var c in Cookies.get()) {
		Cookies.remove(c)
	}

	// update it (Update this to a file!)
	DefaultDB()
	// then save it
	saveDB(db)

	// clean up the views and remove the cookies
	removeCookies()
	cleanView(true)
}

/* Init a question
 * @param {string} question - the question name!
 * @return {object} - object containing question information
 */
function getQuestion(questionNum) {
	var cache;
	selectedSection = getSelectedSection(); // current section
	debugMsg('Trying question ',selectedSection,"-",questionNum);
	if (selectedSection=='generate') {
		// check if we have a stored version already saved?
		cache = getCachedQuestion(questionNum);
		// if not make one...
		if (!isDef(cache)) {
			cache = generateQuestion(questionNum);
		}
	}
	else {
		cache = getQuestionInDB(selectedSection,questionNum);
		debugMsg("got question: ",cache);
	}
	return cache;
}

/* Generate a random question
 * @param {int} question - the question number!
 * @return {object} - object containing question information
 */
function generateQuestion(questionNum) {
	var fn = window["Question"+questionNum];
	var cache;
	if(typeof fn === 'function') {
		//wrap as try catch, to catch errors such as empty tables...
		try {
			cache = fn.apply();
		} catch(e) {
			debugMsg("Error: ", e);
			cache = {
				Question: '<span class="text-muted">This question requires constraints that are not present in the current database! Please import another database!</span>',
				type: 'Not available'
			}
		}
		Cookies.set("Question-"+questionNum, JSON.stringify(cache))
	}
	debugMsg("generated question", questionNum, cache);
	return cache;
}

/* Get a question from the cache (cookies)
 * @param {int} question - the question number!
 * @return {object} - object containing question information; undefined if the question is not cached
 */
function getCachedQuestion(questionNum) {
	var cache = Cookies.getJSON('Question-'+questionNum);
	debugMsg('Found the cached data: ', cache);
	if(isDef(cache)) {
		debugMsg('returning question');
		return cache;
	}
	else {
		debugMsg('returning empty cache');
		return undefined;
	}
}

/* Get a question from the hidden table in the database
 * @param {int} question - the question number!
 * @return {object} - object containing question information; undefined if the question is not cached
 */
function getQuestionInDB(section,num) {
	db.run('CREATE TABLE IF NOT EXISTS testsql_question (num int, question text, answer text, include text)')

	var questionCache = db.exec( "SELECT question, answer, include FROM testsql_question WHERE num = '" + num + "' AND section = '"+section+"'" );

	debugMsg(questionCache);
	
	if (questionCache.length > 0) {
		questionCache = questionCache[0].values[0];
		// contruct an object
		var Question = questionCache[0];
		var Answer = questionCache[1];
		var Include = questionCache[2];
		if (Include!==null) {
			Include = Include.split(',').map(function(s) {return s.trim().toUpperCase()});
		}
		// note the type which we will have to improve on later
		var result =  {
			'Question': Question,
			'Answer': Answer,
			'Include': Include,
			'type': undefined
		};
		debugMsg("got question ", result);
		return result;
	} else {
		return null
	}
}

/* save the question in a hidden table in the database (not used)
function saveQuestionInCache(Num, Question, Answer, Include) {
	Include = (typeof Include !== 'undefined') ? JSON.stringify(Include) : "{}"
	db.run('INSERT INTO testsql_question VALUES(' + Num + ', "' + Question + '", "' + Answer + '", "' + Include + '")')
	saveDB(db)
}
*/

// check if the query alters the database, return true if so!
function checkDBChanges(q) {
	var x = q.toUpperCase();
	if (
		x.indexOf("INSERT INTO ") > -1 ||
		x.indexOf("UPDATE ") > -1 ||
		x.indexOf("DELETE ") > -1 ||
		x.indexOf("ALTER TABLE ") > -1 ||
		x.indexOf("DROP TABLE ") > -1 ||
		x.indexOf("INTO ") > -1 ||
		x.indexOf("CREATE TABLE ") > -1 ||
		x.indexOf("CREATE VIEW ") > -1 ||
		x.indexOf("REPLACE VIEW ") > -1 ||
		x.indexOf("DROP VIEW ") > -1 ||
		(x.indexOf("CREATE INDEX") > -1) ||
		(x.indexOf("CREATE UNIQUE INDEX") > -1) ||
		(x.indexOf("DROP INDEX") > -1)
	) {
		return true;
	}
	return false;
}

// update the questions, wrapped in function to remove bug of the side-loading that xml does!
/* Data used
QuestionsArray - array of qu. names
QuestionsProgress - array of indexes of completed questions
currQuestion - the current question
*/
function updateQuestions() {
	var selectedSection = getSelectedSection();
	QuestionProgress = getQuestionProgress();
	currQuestion = getCurrQuestion();

	if (selectedSection == 'generate') {
		updateTestQuestions();
	}
	else if (selectedSection == 'choose') {
		$('#questions-SQL').html('');
	}
	else {
		var sql = "SELECT num FROM testsql_question WHERE section = '"+selectedSection+"'";
		try {
			var result = db.exec(sql);
			var rows = result[0].values;
			var numQs = rows.length;
			debugMsg(numQs, "questions in section ",selectedSection);
			if (numQs>0) {

				var num, check, btnClass,
					html = '<div class="btn-group" role="group">';
				if (!isDef(currQuestion)) setCurrQuestion(''+rows[0][0]);

				for (var i = 0; i < numQs; i++) {
					// get question num from DB
					num = ''+rows[i][0];
					// check if the question has been completed?
					check = (QuestionProgress.indexOf(num) >=0 );
					// add the button to the questions block
					btnClass = 'btn btn-default' + (check ? ' btn-success' : '') + ((num == currQuestion) ? ' active' : '');
					html = html + '<button id="btn-q' + num + '" class="'+btnClass+'"' + (isSandboxMode() ? ' disabled="disabled"' : '') + '>' + num + '</button>';
				}

				html = html + '</div>';

				// add it to the DOM
				$('#questions-SQL').html(html)

				updateCurrQuestionDisplay();
			}
		}
		catch(e) {
			debugMsg('Error: ',sql, e);
		}
	}
}

function updateTestQuestions() {
	// Construct questions!
	var html = '<div class="btn-group" role="group">';
	var Qname, check;
	currQuestion = getCurrQuestion();
	if (!isDef(currQuestion)) setCurrQuestion(QuestionsArray[0]);

	for (var i in QuestionsArray) {

		//if(QuestionsArray[i].newgroup) {
		//html = html + '</div><div class="btn-group" role="group">'
		// }
		// start the questions at 1!
		Qname = ''+QuestionsArray[i];

		// check if the question has been completed?
		check = ( QuestionProgress.indexOf(Qname) > 0);

		// add the button to the questions block
		html = html + '<button id="btn-q' + Qname + '" class="btn btn-default' + (check ? ' btn-success' : '') + ((Qname == currQuestion) ? ' active' : '') + '"' + (isSandboxMode() ? ' disabled="disabled"' : '') + '>' + Qname + '</button>';
	}
	html = html + '</div>';

	// add it to the DOM
	$('#questions-SQL').html(html);

	updateCurrQuestionDisplay();

}

// update the display for the current question status
function updateCurrQuestionDisplay() {
	currQuestion = getCurrQuestion();
	hideFeedback();

	editableCodeMirror.setValue('');

	var qDetails = getQuestion(currQuestion);
	
	if (qDetails) {
		var check = (QuestionProgress.indexOf(currQuestion) >= 0);
		debugMsg(currQuestion, "is answered", check);

		$('#status-SQL').toggle(check);
		var type = qDetails.type; if (!isDef(type)) type='';
		$('#currQuestionTitle-SQL').html('Question ' + currQuestion + ' ' + type);
	}
	$('#currQuestion-SQL').html(isSandboxMode() ? 'Questions are <strong>disabled</strong> in sandbox mode.' : qDetails.Question);
}

// show current answer
function showCurrentAnswer() {
	var currQuestion = getCurrQuestion();
	var cache = getQuestion(currQuestion);
	// if the answer isn't in the cache, dont try show answer
	if (isDef(cache)) {
		editableCodeMirror.setValue(cache.Answer);
	}
}

// database object
var db = null

// Current question
var currQuestion;

// Current section, selected by user
var selectedSection;

// progress on questions for the current section
var QuestionProgress;

// database loaded by default
var useDB = 'employeeplusexam.db';
// was: 'employeeDatabase.db';
// a better system would make it easy to switch between databases
// or run them all, e.g. employee, northwind, exam database etc

// grab the default text and save it
var defaultResultsText = $('#results-SQL').html()

// array list questions' names for generated questions
var QuestionsArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

// if the database is in the local storage get it!
var data = window.localStorage.getItem('DefaultDB')
if (data !== null) {
	var result = []
	for (var i = 0, size = data.length; i < size; i++)
		result.push(data.charCodeAt(i));
	result = new Uint8Array(result);

	// load the database!
	db = new SQL.Database(result)
	// update view
	updateView(true)
} else {
	// no database exists in local storage, make a default one!
	DefaultDB()
}

// Create a HTML table - helper function
var tableCreate = function() {
	// private function
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>',
			close = '</' + tagName + '>';
		return open + vals.join(close + open) + close;
	}
	// public 
	return function(columns, values) {

		var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
		var rows = values.map(function(v) {
			return valconcat(v, 'td');
		});
		html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
		return html;
	}
}();

// update question on click
$('#questions-SQL').on('click', 'button', function() {
	var ele = $(this).html(); // no need for parseInt
	debugMsg("clicked question ",ele);

	// don't do anything if we already on the question
	if (ele != currQuestion) {
		debugMsg("change question ");
		// find all the buttons with `primary` class, remove!
		$('#questions-SQL>div>button.active').removeClass('active')
		$(this).addClass('active');

		// update the cookie!
		setCurrQuestion(ele);

		updateCurrQuestionDisplay();
	}
})

$('#model-answer').on('click', showCurrentAnswer );

$('#next-Question').on('click',function() {
	$('#questions-SQL>div>button.active').next().click();
});

// binding arrow keys for improved accessibility
// e.which for cross-broswer compatability
// http://api.jquery.com/event.which/
$(document).keydown(function(e) {
	// don't call if cursor inside textarea
	if ($(e.target).is('textarea')) {
		// both enter key and ctrl key
		if (e.which == 13 && e.ctrlKey) {
			// execute the sql
			execute(editableCodeMirror.getValue());
		}
	} else {
		if (e.which == 37) { // left arrow
			// simulate a click of the previous question
			$('#btn-q' + (currQuestion - 1)).trigger('click');
		} else if (e.which == 39) { // right arrow
			// simulate a click of the next question
			$('#btn-q' + (currQuestion + 1)).trigger('click');
		}
	}
})

// functionality for the RunSql button
$('#exec-SQL').click(function() {
	execute(editableCodeMirror.getValue())
});

//functionality for the side menu
$('#tables-SQL').on("click", "li", function() {
	var sql = "SELECT * FROM `" + $(this).data("tbl-name") + "`"
	editableCodeMirror.setValue(sql)
	execute(sql, false)
});

// functionality for the restore database function
$('#restore-SQL').click(function() {
	restore()
});

//functionality for the clear text area!
$('#clear-SQL').click(function() {
	cleanView(true)
});

// functionality for the sandbox mode!
$('#sandbox-SQL button:enabled').click(function() {
	var sb = !isSandboxMode();
	Cookies.set('Sandbox', sb);

	$('#sandbox-SQL>div>button:enabled').toggleClass('active btn-default btn-danger');

	updateCurrQuestionDisplay();

	// re-enable/disable question buttons
	$('#questions-SQL').find('button').prop('disabled', sb);

});

$('#sandbox-SQL>div>button:enabled:nth(' + (isSandboxMode() ? 1 : 0) + ')').addClass('active btn-danger').removeClass('btn-default');

// import another database, remove all the questions etc.
$('.import-SQL').on('change', function() {
	var input = $(this).get(0)
	var f = input.files[0];
	var r = new FileReader();
	r.onload = function() {
		var Uints = new Uint8Array(r.result)
		var results = db.exec("SELECT * FROM `sqlite_master` WHERE tbl_name != 'sqlite_sequence' and type = 'table'")
		//db.close()
		db = new SQL.Database(Uints)
		
		// save the changes!
		saveDB(db)
		
		var results = db.exec("SELECT * FROM `sqlite_master` WHERE tbl_name != 'sqlite_sequence'")

		// get some new questions
		removeCookies()
		// and update the view!
		updateView(true)
		// clean it too 
		cleanView(true)
	}
	r.readAsArrayBuffer(f);
})

//Run a command in the database
function execute(commands, check) {
	try {
		// hide the feedback from previous attempt (if any)
		$('#response-SQL').parent().hide()

		// don't check answer if someone clicks on the sidebar tables for example!
		check = (typeof check !== 'undefined') ? check : true

		// only make changes if sandbox mode!
		if (checkDBChanges(commands) && !isSandboxMode()) {
			$('#response-SQL').addClass('alert-danger').html('You can only make changes to the database when sandbox mode is enabled!').show().delay(3000).fadeOut(function() {
				$(this).removeClass('alert-danger')
			})
			return
		}
		// if it is sandbox and changes can be made... make them!
		var results = db.exec(commands)

		// if it changes the database save the changes
		if (checkDBChanges(commands)) {
			saveDB(db)
			updateView(false)

			//Don't check db changes as all questions relate to SELECT
			check = false
		}
		// only clean if selecting something!
		else {
			cleanView(false)
		}
		currQuestion = getCurrQuestion();

		// if sandbox mode don't even check the cache for the answer just let them play
		if (isSandboxMode() === true || check === false) {
			showFeedback('Query executed successfully', 'alert-success');
		} else {
			var feedback = checkAnswer(results, commands);
			if (feedback === true) {
				//--- correct answer! ---//
				// store the completed questions in a cookie! form of [1, 2 ... 5, 7]
				markComplete(currQuestion)

				// display the success ribbon
				showSuccess(currQuestion);

				// Move on to the next incomplete question in order!
				// Or maybe don't move on too quick?
				//$('#questions-SQL>div>button:not(.btn-success):first').trigger('click')
			} else {
				// incorrect
				showFeedback(feedback, 'alert-danger');
			}
		}

		var html = ''
		if (results.length === 0) {
			html = '<em> No rows returned </em>'
		} else {
			for (var i = 0; i < results.length; i++) {

				html = html + "<div style='margin-bottom:10px;'>Number of Records: " + results[i].values.length + " " + (results[i].values.length > 10 ? ' (Showing first 10 results)' : '') + "</div>";
				html = html + "<table class='table table-striped table-bordered'>"

				// limit results
				results[i].values.length = (results[i].values.length > 10 ? 10 : results[i].values.length)
				html = html + tableCreate(results[i].columns, results[i].values)
			}
			html = html + "</table>"
		}

		$('#results-SQL').html(html)
	}
	//Error running the query! Display error message
	catch (e) {
		showFeedback(e, 'alert-danger');
	}
}

// display the success ribbon
function showSuccess(q) {
	showFeedback('Well done! The answer was correct', 'alert-success');
	var bqid = "button[id='btn-q"+q+"']";
	debugMsg("success class for ",bqid);
	$(bqid).addClass('btn-success')
	$('#status-SQL').toggle(true);
}

// @param feedback - html to display
// @param alertClass - class to add to the alert message, e.g. 'alert-success'
function showFeedback(feedback, alertClass) {
	$('#response-SQL').parent().removeClass('alert-success alert-danger')
	$('#response-SQL').parent().addClass(alertClass).show()
	$('#response-SQL').html(feedback)
}

function hideFeedback() {
	$('#response-SQL').parent().hide()
}

// sandbox mode: in Cookie - otherwise, false by default
function isSandboxMode() {
	var sb = Cookies.get('Sandbox');
	return sb=='true';
}

// check if the question is complete @param - question name
function isCompleted(question) {
	// progress
	QuestionProgress = getQuestionProgress();

	// if it exists in the array it's done!
	if (QuestionProgress.indexOf(question) > -1) {
		return true
	}
	return false
}

// mark question as completed @param question number
function markComplete(question) {
	// get the current progress
	QuestionProgress = getQuestionProgress();

	if (!isCompleted(question)) {
		QuestionProgress.push(question)

		// then set the new cookie!
		setQuestionProgress(QuestionProgress);
	}
	return true
}

/* Gets a random int
 * @param {int} min - the minimum value (inclusive)
 * @param {int} max - the maximum value (exclusive)
 * @return {int} - random
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Gets table(s) from the SQLite database
 * @param {int} n - the amount of tables to fetch
 * @param {bool} strict - can we NOT budge?
 * @return {array} - array of the table name(s)
 */
function getTables(n, strict) {
	strict = (typeof strict !== 'undefined') ? strict : true;
	
	var q = "SELECT distinct tbl_name FROM sqlite_master WHERE tbl_name NOT LIKE 'sqlite%' AND tbl_name NOT LIKE 'testsql%' AND tbl_name NOT IN (select table_name from testsql_excluded where column_name = '*');"

	var result = db.exec(q);
	var rows = result[0].values;

	debugMsg("Tables to choose from ",rows);

	//if not enough tables, return false
	if (strict && rows.length < n) {
		return false;
	} else if (n > rows.length) { // can't get more tables then their is!
		n = rows.length;
	}

	// store previous table indexes to get unique tables!
	var out = [],
		prev = [],
		random = -1;

	// else grab random unique tables!
	for (var i = 0; i < n; i++) {
		// keep searching for a unique!
		do {
			random = Math.floor(Math.random() * rows.length)
		} while (prev.indexOf(random) > -1)
		prev[prev.length] = random

		out[out.length] = rows[random]
	}
	// return the array of table names
	return out
}

/* Gets column(s) from the SQLite database that is an Int Datatype if any!
 * Will loop through all the tables!
 * @param {string} type - "INTEGER", "NVARCHAR"
 * @param {bool} nulls - 0: nulls, 1: not nulls, 2: any
 * @param {string} tbl_name - specific table
 * @return {array} - array of the column name(s)
 */
function getTypeColumn(type, nulls, tbl_name) {
	
	var result;

	// fetch 10 tables - can be increased but 10 seems reasonable
	var tables = (isDef(tbl_name)) ? [[tbl_name]] : getTables(10, false)

	// default is to ALLOW nulls: 
	var nulls = (typeof nulls !== 'undefined' && nulls < 3) ? nulls : 2

	tables = shuffle(tables)

	for (var i = 0; i < tables.length; i++) {
		var info = db.exec('PRAGMA table_info(' + tables[i] + ')')
		//shuffle up the columns 
		var cols = shuffle(info[0].values);
		
		debugMsg(tables[i],"cols",cols);

		//loop through columns
		for (var j = 0; j < cols.length; j++) {

			if(nulls != cols[j][3] && nulls != cols[j][5]) {
				debugMsg("skip",cols[j]);
				continue;
			}

			if(typeof type !== 'undefined') {
				if (cols[j][2].indexOf(type) > -1) {
					// found an type column break all loops to save time!!
					result = {
						tbl_name: tables[i][0],
						col_name: cols[j][1]
					}
				}
				else if (cols[j][2].indexOf('CHAR') > -1 && (type == 'INTEGER' || type == 'VARCHAR'))
				{
					result = {
						tbl_name: tables[i][0],
						col_name: cols[j][1]
					}
				}
			} 
			else {
				result = {
					tbl_name: tables[i][0],
					col_name: cols[j][1]
				}
			}
		}
	}
	debugMsg(type, "random column", result);
	return result;
}

/* Gets a table with a valid foreign key constraint!
 * Will loop through all the tables!
 * @param {string} tbl_name - specific table
 * @return {object} - object of the column name and tables(s)
 */
function getForeign(tbl_name) {
	// get a handful of tables to check!
	var tables = (typeof tbl_name !== 'undefined') ? [
		[tbl_name]
	] : getTables(10, false)
	// shuffle the tables so a random table is at index 0
	tables = shuffle(tables)
	// loop through each table checeking for a foreign constraint
	for (var i = 0; i < tables.length; i++) {
		var check = db.exec('PRAGMA foreign_key_list(' + tables[i] + ')')
		// check if this table has foreign keys
		if (check.length > 0) {
			// shuffle the foreign keys to prevent the same on being used over and over! 
			var temp = shuffle(check[0].values)
			// then return the first one!
			// construct the object to be returned including both tables and the linked columns
			return {
				from: {
					tbl_name: tables[i][0],
					col_name: temp[0][3]
				},
				to: {
					tbl_name: temp[0][2],
					col_name: temp[0][4]
				}
			}
		}
	}
	// no table was found, return false
	return false
}

/* Gets column(s) from the SQLite database
 * @param {string} tbl_name - the table to get the column(s) from
 * @param {int} n - the amount of columns to fetch
 * @param {param} strict - can't budge on the columns
 * @return {array} - array of the column name(s)
 */
function getColumns(tbl_name, n, strict) {
	strict = (typeof strict !== 'undefined') ? strict : true

	var result = db.exec("SELECT * FROM `" + tbl_name + "`")

	// does the table have rows?
	if (typeof result[0] === 'undefined') {
		return false
	}

	//if not enough tables and is strict, return false
	if (result[0].columns.length < n && strict) {
		return false
	} else if (result[0].columns.length < n && !strict) {
		n = result[0].columns.length
	}

	// store previous column indexes to get unique columns!
	var out = [],
		prev = [],
		random = -1

	// else grab random unique columns!
	for (var i = 0; i < n; i++) {
		// keep searching for a unique!
		do {
			random = Math.floor(Math.random() * result[0].columns.length)
		} while (prev.indexOf(random) > -1)
		prev[prev.length] = random

		out[out.length] = result[0].columns[random]
	}
	// return the array of column names
	return out
}

/* Gets row(s) from the SQLite database
 * @param {string} tbl_name - the table to get the row(s) from
 * @param {string} col_name - the column to get the row(s) from
 * @param {int} n - the amount of rows to fetch
 * @param {bool} strict - this amount is required, no budging!!
 * @return {array} - array of the rows name(s)
 */
function getRows(tbl_name, col_name, n, strict) {
	strict = (typeof strict !== 'undefined') ? strict : true

	var result = db.exec("SELECT " + col_name + " FROM `" + tbl_name + "`")

	//if not enough tables and is strict, return false
	if (result[0].values.length < n && strict) {
		return false
	} else if (result[0].values.length < n && !strict) {
		n = result[0].values.length
	}

	// store previous row indexes to get unique rows!
	var out = [],
		prev = [],
		random = -1

	// else grab random unique rows!
	for (var i = 0; i < n; i++) {
		// keep searching for a unique!
		do {
			random = Math.floor(Math.random() * result[0].values.length)
		} while (prev.indexOf(random) > -1)
		prev[prev.length] = random

		out[out.length] = result[0].values[random]
	}

	// return the array of row names
	return out
}

/**
 * Question 1: Select all columns 
 * Sample: SELECT * FROM tbl_name
 */
function Question1() {

	var tbl_name = getTables(1);

	var Q = 'Select everything from the table <em>' + tbl_name + '</em>'
	var A = 'SELECT * FROM `' + tbl_name + '`'

	//set the cache
	cache = {
		'Question': Q,
		'Answer': A,
		'type': 'Selecting all columns'
	}

	return cache;
}

/**
 * Question 2: Select specific columns
 * Sample: SELECT `col_name` FROM `tbl_name`
 **/
function Question2() {

	var tbl_name = getTables(1)
	var col_name = getColumns(tbl_name, 1)

	var Q = 'Select ONLY the column <em>' + col_name + '</em> from the table <em>' + tbl_name + '</em>'
	var A = 'SELECT ' + col_name + ' FROM `' + tbl_name + '`'

	//set the cache
	cache = {
		'Question': Q,
		'Answer': A,
		'type': 'Selecting specific columns'
	}

	return cache;
}

/**
 * Question 3: Select specific rows
 * Sample: SELECT `col_name` FROM `tbl_name` WHERE `col_name` = value
 **/
function Question3() {

	var info = getTypeColumn(undefined, 1)
	
	var tbl_name = info.tbl_name
	var col_name = info.col_name
	
	var row_value = getRows(tbl_name, col_name, 1)

	var Q = 'Select the column <em>' + col_name + '</em> from the table <em>' + tbl_name + '</em> where the value of <em>' + col_name + '</em> is equal to "' + row_value + '"'
	var A = 'SELECT `' + col_name + '` FROM `' + tbl_name + '` WHERE `' + col_name + '` = "' + row_value + '"'

	//set the cache
	cache = {
		'Question': Q,
		'Answer': A,
		'type': 'Introducing the WHERE clause'
	}

	return cache;
}

/**
 * Question 4: Introducing greater/less than
 * Sample: SELECT `col_name` FROM `tbl_name` WHERE `col_name` >= value
 **/
function Question4() {

	var info = getTypeColumn(undefined, 1)
	
	var tbl_name = info.tbl_name
	var col_name = info.col_name
	
	var row_value = getRows(tbl_name, col_name, 1)

	// generate random numbers
	var randomOp = getRandomInt(0, 1),
		randomSel = getRandomInt(0, 1)

	// randomise the columns selected and the where operator!
	var operators = {
		Q: ['greater or equal', 'below or equal'],
		A: ['>=', '<=']
	}
	var selectVariance = {
		Q: ['everything', col_name],
		A: ['*', '`' + col_name + '`']
	}

	var Q = 'Select <em>' + selectVariance.Q[randomSel] + '</em> from the table <em>' + tbl_name + '</em> where the value of <em>' + col_name + '</em> is ' + operators.Q[randomOp] + ' to "' + row_value + '"'
	var A = 'SELECT ' + selectVariance.A[randomSel] + ' FROM `' + tbl_name + '` WHERE `' + col_name + '` ' + operators.A[randomOp] + ' "' + row_value + '"'

	//set the cache
	cache = {
		'Question': Q,
		'Answer': A,
		'type': 'Introducing operators into the WHERE clause'		
	}

	return cache;
}

/** * Question 5: Introducing AND in where clause
 * Sample: SELECT `col_name` FROM `tbl_name` WHERE `col_name` >= value and `col_name_2` <= value2
 **/
function Question5() {

	var info = getTypeColumn(undefined, 1)
	
	var tbl_name = info.tbl_name
	var col_name = info.col_name
	
	// ask to display these columns
	var named_cols = getColumns(tbl_name, 2)

	// returns two values from different columns for the same row
	var rows = getRows(tbl_name, col_name, 1)

	// construct the query
	var Q = 'Select the columns <em>' + named_cols.join(' and ') + '</em> from the table <em>' + tbl_name + '</em> where'
	var A = 'SELECT `' + named_cols.join('`, `') + '` FROM `' + tbl_name + '` WHERE'

	for (var i = 0; i < rows[0].length; i++) {
		var random = getRandomInt(0, 1)
		var operators = {
			name: ['greater or equal', 'below or equal'],
			operator: ['>=', '<=']
		}

		if (i > 0) {
			Q = Q + ', and'
			A = A + ' AND'
		}

		Q = Q + ' <em>' + col_name + '</em> is ' + operators.name[random] + ' to "' + rows[0][i] + '"'
		A = A + ' ' + col_name + ' ' + operators.operator[random] + ' "' + rows[0][i] + '"'
	}

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		'type': 'Introducing AND in the WHERE clause'
	}

	return cache;
}

/** * Question 6: Introducing OR in where clause
 * Sample: SELECT `col_name` FROM `tbl_name` WHERE `col_name` >= value or `col_name_2` <= value2
 **/
function Question6() {

	var info = getTypeColumn(undefined, 1)
	
	var tbl_name = info.tbl_name
	
	var col_name = [info.col_name, getTypeColumn(undefined, 1, tbl_name).col_name]
	
	// ask to display these columns
	var named_cols = getColumns(tbl_name, 2)

	// construct the query
	var Q = 'Select the columns <em>' + named_cols.join(' and ') + '</em> from the table <em>' + tbl_name + '</em> where the value of'
	var A = 'SELECT `' + named_cols.join('`, `') + '` FROM `' + tbl_name + '` WHERE'

	for (var i = 0; i < col_name.length; i++) {
		var random = getRandomInt(0, 4)
		var operators = {
			name: ['greater or equal to', 'below or equal to', 'below', 'above', 'equal to'],
			operator: ['>=', '<=', '<', '>', '=']
		}

		// returns two values from different columns for the same row
		var rows = getRows(tbl_name, col_name[i], 1)

		if (i > 0) {
			Q = Q + ', or'
			A = A + ' or'
		}

		Q = Q + ' <em>' + col_name[i] + '</em> is ' + operators.name[random] + ' "' + rows[0] + '"'
		A = A + ' ' + col_name[i] + ' ' + operators.operator[random] + ' "' + rows[0] + '"'
	}

	cache = {
		Question: Q,
		Answer: A,
		'type': 'Introducing OR in the WHERE clause'
	}

	return cache;
}

/** * Question 7: Introducing IN
 * Sample: SELECT `col_name` FROM `tbl_name` WHERE `col_name` IN(value, value2)
 **/
function Question7() {

	// get the data from these columns
	var info = getTypeColumn('INTEGER', 1);

	var tbl_name = info.tbl_name
	var col_name = info.col_name

	// ask to display these columns
	var named_cols = getColumns(tbl_name, 2)

	// generate random numbers
	var randomOp = getRandomInt(0, 1),
		randomSel = getRandomInt(0, 1),
		random_row_num = getRandomInt(4, 6)

	var rows = getRows(tbl_name, col_name, random_row_num, false) // strict
	var uniqueRows = [].concat.apply([], rows);

	uniqueRows = uniqueRows.filter(function(item, pos) {
		return uniqueRows.indexOf(item) == pos
	})
	
	// randomise the columns selected and the where operator!
	var selectVariance = {
		Q: ['everything', named_cols.join(', ')],
		A: ['*', '`' + named_cols.join('`, `') + '`']
	}

	var Q = 'Select <em>' + selectVariance.Q[randomSel] + '</em> from the table <em>' + tbl_name + '</em> where the value of <em>' + col_name + '</em> is either: <em>' + rows.join(', or ') + '</em>. Using IN operator'
	var A = 'SELECT ' + selectVariance.A[randomSel] + ' FROM `' + tbl_name + '` WHERE `' + col_name + '` IN("' + rows.join('", "') + '")'
	var I = ['IN']
	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing IN()',
		'newgroup': true
	}

	return cache;
}

/** * Question 8: Introducing Distinct
 * Sample: SELECT DISTINCT `col_name`, `col_name_2` FROM `tbl_name`
 **/
function Question8() {

	var tbl_name = getTables(1)
	// get the data from these columns
	var col_name = getColumns(tbl_name, 1)

	var Q = 'Select the DISTINCT values from the column <em>' + col_name + '</em> from the table <em>' + tbl_name + '</em>'
	var A = 'SELECT DISTINCT ' + col_name + ' FROM `' + tbl_name + '`'
	var I = ['DISTINCT']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing DISTINCT'
	}

	return cache;
}

/** * Question 9: Introducing Order by ... ASC / DESC
 * Sample: SELECT `col_name`, `col_name_2` FROM `tbl_name` ORDER BY `col` ASC/DESC
 **/
function Question9() {

	var tbl_name = getTables(1)

	// generate random numbers
	var randomCol = getRandomInt(1, 3),
		randomOrderBy = getRandomInt(0, 1)

	var orderBy = {
		Q: ['in ascending order', 'in descending order'],
		A: ['ASC', 'DESC']
	}

	// select from these columns
	var named_col = getColumns(tbl_name, randomCol, false)
	// order by col_name
	var order_col = getColumns(tbl_name, 1)

	var Q = 'Select <em>' + named_col.join(', ') + '</em> from the table <em>' + tbl_name + '</em> ordering them by the column <em>' + order_col + '</em>, ' + orderBy.Q[randomOrderBy]
	var A = 'SELECT `' + named_col.join('`, `') + '` FROM `' + tbl_name + '` ORDER BY `' + order_col + '` ' + orderBy.A[randomOrderBy]
	var I = ['ORDER', 'BY', orderBy.A[randomOrderBy]]

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing ORDER BY'
	}

	return cache;
}

/** * Question 10: Introducing LIMIT
 * Sample: SELECT `col_name`, `col_name_2` FROM `tbl_name` LIMIT x
 **/
function Question10() {

	var tbl_name = getTables(1)

	// generate random numbers
	var randomCol = getRandomInt(1, 3),
		randomLimit = getRandomInt(5, 15)

	// select from these columns
	var named_col = getColumns(tbl_name, randomCol, false)

	var Q = 'Select ' + randomLimit + ' rows from the table <em>' + tbl_name + '</em>, displaying the columns <em>' + named_col.join(', and ') + '</em>'
	var A = 'SELECT `' + named_col.join('`, `') + '` FROM `' + tbl_name + '` LIMIT ' + randomLimit
	var I = ['LIMIT']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing LIMIT'
	}

	return cache;
}

/** * Question 11: Introducing LIMIT offset
 * Sample: SELECT `col_name`, `col_name_2` FROM `tbl_name` LIMIT x, y
 **/
function Question11() {

	var tbl_name = getTables(1)

	// generate random numbers
	var randomCol = getRandomInt(1, 3),
		randomLimit = getRandomInt(5, 15),
		randomOffset = getRandomInt(5, 10)

	// select from these columns
	var named_col = getColumns(tbl_name, randomCol, false)

	var Q = 'Select ' + randomLimit + ' rows starting at the row ' + randomOffset + ' (OFFSET ' + (randomOffset - 1) + '), from the table <em>' + tbl_name + '</em>, displaying the columns <em>' + named_col.join(', and ') + '</em>'
	var A = 'SELECT `' + named_col.join('`, `') + '` FROM `' + tbl_name + '` LIMIT ' + (randomOffset - 1) + ', ' + randomLimit
	var I = ['LIMIT']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing LIMIT offset'
	}

	return cache;
}

/** * Question 12: Introducing Count
 * Sample: SELECT Count(`col_name`), `col_name_2` FROM `tbl_name`
 **/
function Question12() {

	var tbl_name = getTables(1)

	// get the column to count, not strict but tables usually have 2+ cols, right?
	var col_name = getColumns(tbl_name, 1)

	var Q = 'Select the number of rows from the table ' + tbl_name + ', using the COUNT function'
	var A = 'SELECT COUNT(*) FROM `' + tbl_name + '`'
	var I = ['COUNT']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing COUNT()',
		'newgroup': true
	}

	return cache;
}

/** * Question 13: Using Count and the Where clause
 * Sample: SELECT Count(`col_name`), `col_name_2` FROM `tbl_name` WHERE `col_name` <=> val
 **/
function Question13() {

	var info = getTypeColumn(undefined, 1)
	
	var tbl_name = info.tbl_name
	var col_name = info.col_name

	// generate randoms 
	var randomOp = getRandomInt(0, 3)

	// available operators
	var row = getRows(tbl_name, col_name, 1)
	var operators = {
		Q: ['above or equal to', 'below or equal to', 'above', 'below'],
		A: ['>=', '<=', '>', '<']
	}

	var Q = 'Select the number of rows from the table ' + tbl_name + ' where the value of ' + col_name + ' is ' + operators.Q[randomOp] + ' "' + row + '"'
	var A = 'SELECT COUNT(*) FROM `' + tbl_name + '` WHERE `' + col_name + '` ' + operators.A[randomOp] + ' "' + row + '"'
	var I = ['COUNT', 'WHERE']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Combining COUNT() with WHERE clause'
	}

	return cache;
}

/** * Question 14: Introducing MAX, MIN, AVG
 * Sample: SELECT MIN(`col_name`), MAX(`col_name_2`) FROM `tbl_name`
 **/
function Question14() {

	var tbl_name = getTables(1)

	// get the column in where
	var col_name = getColumns(tbl_name, 3)

	var Q = 'Select the '
	var A = 'SELECT '

	// available functions
	var functions = {
		Q: ['maximum', 'minimum', 'average'],
		A: ['MAX', 'MIN', 'AVG']
	}
	for (var i = 0; i < col_name.length; i++) {

		if (i == 1) {
			Q = Q + ', '
			A = A + ', '
		} else if (i == 2) {
			Q = Q + ' and '
			A = A + ', '
		}

		Q = Q + functions.Q[i] + ' value of the column <em>' + col_name[i] + '</em>'
		A = A + functions.A[i] + '(' + col_name[i] + ')'
	}

	Q = Q + ' from the table <em>' + tbl_name + '</em>'
	A = A + ' FROM `' + tbl_name + '`'

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		'type': 'Introducing AVG(), MIN(), MAX() functions'
	}

	return cache;
}

/** * Question 15: Introducing Group By
 * Sample: SELECT MIN(`col_name`) FROM `tbl_name` Group by `col_name`
 **/
function Question15() {

	// generate randoms 
	var randomFunc = getRandomInt(0, 2)

	// get the column in where
	var info = getTypeColumn('INTEGER')

	var tbl_name = info.tbl_name
	var col_name = info.col_name

	// get the group by column
	var group_col = getColumns(tbl_name, 1)

	// available functions
	var functions = {
		Q: ['maximum', 'minimum', 'average'],
		A: ['MAX', 'MIN', 'AVG']
	}

	Q = 'Select the ' + functions.Q[randomFunc] + ' value of the column <em>' + col_name + '</em> from the table <em>' + tbl_name + '</em> grouping the results by the column <em>' + group_col + '</em>'
	A = 'SELECT ' + functions.A[randomFunc] + '(' + col_name + ') FROM `' + tbl_name + '` GROUP BY `' + group_col + '`'
	var I = [functions.A[randomFunc], 'GROUP', 'BY']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing Group By'
	}

	return cache;
}

/** * Question 16: Introducing Nested Queries
 * Sample: SELECT * FROM `tbl_name` WHERE `col_name` > (SELECT AVG(`col_value`) FROM `tbl_name`)
 **/
function Question16() {

	// get a column that is only fill with INT's. 
	// 				{tbl_name: x, col_name: y}
	var info = getTypeColumn('INTEGER')

	// generate randoms 
	var randomCol = getRandomInt(1, 2),
		randomOp = getRandomInt(0, 3)

	var named_col = getColumns(info.tbl_name, randomCol)

	var operators = {
		Q: ['greater or equal to', 'below or equal to', 'below', 'above'],
		A: ['>=', '<=', '<', '>']
	}

	var Q = 'Select the rows from <em>' + named_col.join(', ') + '</em> in <em>' + info.tbl_name + '</em> where the value of <em>' + info.col_name + '</em> is ' + operators.Q[randomOp] + ' the average of the column <em>' + info.col_name + '</em>'
	var A = 'SELECT `' + named_col.join('`, `') + '` FROM `' + info.tbl_name + '` WHERE `' + info.col_name + '` ' + operators.A[randomOp] + ' (SELECT AVG(`' + info.col_name + '`) FROM `' + info.tbl_name + '`)'
	var I = ['SELECT', 'SELECT']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing Nested Queries'
	}

	return cache;
}

/** * Question 17: Introducing ISNULL, ISNOT
 * Sample: SELECT * FROM `tbl_name` WHERE `col_name` IS NULL/IS NOT NULL
 **/
function Question17() {
		
	var info = getTypeColumn(undefined, 0)
	
	var tbl_name = info.tbl_name
	var col_name = info.col_name

	// generate randoms 
	var randomCols = getRandomInt(1, 2),
		randomNull = getRandomInt(0, 1)

	// select these
	var named_cols = getColumns(tbl_name, randomCols)

	// random null or not null
	var nulls = {
		Q: ['null values', 'not null values'],
		A: ['IS NULL', 'IS NOT NULL'],
		I: ['NULL', ['NOT', 'NULL']]
	}

	var Q = 'Select the columns <em>' + named_cols.join(', ') + '</em> from the table <em>' + tbl_name + '</em> where the rows in the <em>' + col_name + '</em> column contains only <strong>' + nulls.Q[randomNull] + '</strong> values'
	var A = 'SELECT `' + named_cols.join('`, `') + '` FROM `' + tbl_name + '` WHERE `' + col_name + '` ' + nulls.A[randomNull]
	var I = nulls.I[randomNull]

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing IS NULL and IS NOT NULL'
	}

	return cache;
}

/** * Question 18: Introducing JOINS
 * Sample: SELECT a.BillingCity, a.InvoiceDate, b.SupportRepId, b.LastName FROM Invoice a INNER JOIN Customer b ON (a.CustomerId = b.CustomerId)
 **/
function Question18() {

	// get a valid foreign column
	var info = getForeign()

	// generate random
	var randomFromCols = getRandomInt(1, 2),
		randomToCols = getRandomInt(1, 2)

	// from col table 
	var col_f = getColumns(info.from.tbl_name, randomFromCols)
	// to col table 
	var col_t = getColumns(info.to.tbl_name, randomToCols)

	var Q = 'Select the columns <em>' + col_f.join(', ') + '</em> from the table <em>' + info.from.tbl_name + '</em>' +
		', and the columns <em>' + col_t.join(', ') + '</em> from the table <em>' + info.to.tbl_name + '</em>' +
		' joining ' + info.from.tbl_name + ' to ' + info.to.tbl_name + ' with an <strong>inner join</strong>, joining the columns <em>' + info.from.tbl_name + '.' + info.from.col_name + '</em>' +
		' and the column <em>' + info.to.tbl_name + '.' + info.to.col_name + '</em>'

	var A = 'SELECT a.' + col_f.join(', a.') + ', b.' + col_t.join(', b.') + ' FROM ' + info.from.tbl_name + ' a INNER JOIN ' + info.to.tbl_name + ' b ON (a.' + info.from.col_name + ' = b.' + info.to.col_name + ')'

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: ['INNER', 'JOIN'],
		'type': 'Introducing Inner Joins',
		'newgroup': true
	}

	return cache;
}

/** * Question 19: Introducing JOINS
 * Sample:SELECT a.BillingCity, a.InvoiceDate, b.SupportRepId, b.LastName 
 *				FROM Invoice a 
 * 				LEFT JOIN Customer b 
 *				ON (a.CustomerId = b.CustomerId)
 **/
function Question19() {

	// get a valid column that is a foreign key
	var info = getForeign()

	// generate random numbers
	var randomFromCols = getRandomInt(1, 2),
		randomToCols = getRandomInt(1, 2)

	// get columns from the "from" table to select
	var colFrom = getColumns(info.from.tbl_name, randomFromCols)
	// get columns from the "joined" table to select
	var colTo = getColumns(info.to.tbl_name, randomToCols)

	// create the variable that will hold the question string
	var Q = 'Select the columns <em>' + colFrom.join(', ') + '</em> from the table <em>' + info.from.tbl_name + '</em>' +
		', and the columns <em>' + colTo.join(', ') + '</em> from the table <em>' + info.to.tbl_name + '</em>' +
		' joining ' + info.from.tbl_name + ' to ' + info.to.tbl_name + ' using a <strong>left join</strong>, ' +
		'joining the columns <em>' + info.from.tbl_name + '.' + info.from.col_name + '</em>' +
		' and the column <em>' + info.to.tbl_name + '.' + info.to.col_name + '</em>'

	// create the variable that will hold the model answer
	var A = 'SELECT a.' + colFrom.join(', a.') + ', b.' + colTo.join(', b.') + ' FROM ' +
		info.from.tbl_name + ' a LEFT JOIN ' + info.to.tbl_name +
		' b ON (a.' + info.from.col_name + ' = b.' + info.to.col_name + ')'

	// array of keywords that need to be present in the user's query
	var I = ['LEFT', 'JOIN']

	//generate the object that will be returned as well as saved in the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: ['LEFT', 'JOIN'],
		'type': 'Introducing Left Joins'
	}

	return cache;
}

/** * Question 20: Introducing table aliases
 * Sample: SELECT `col` FROM `table` AS tbl
 **/
function Question20() {

	// get a valid foreign column
	var tbl_name = getTables(1)

	// get a suitable alias (first two letters of table name seems okay) 
	var tbl_alias = tbl_name[0][0].substr(0, 1)

	// generate random
	var randomCols = getRandomInt(1, 2)

	// cols to select table 
	var col_name = getColumns(tbl_name, randomCols)

	var Q = 'Select the columns <em>' + col_name.join(', ') + '</em> from the table <em>' + tbl_name + '</em>. Using the table alias <em>' + tbl_alias + '</em>'
	var A = 'SELECT `' + col_name.join('`, `') + '` FROM ' + tbl_name + ' AS ' + tbl_alias
	var I = ['AS', tbl_alias.toUpperCase()]
	
	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing table aliases'
	}

	return cache;
}

/** * Question 21: Introducing column aliases
 * Sample: SELECT `col` AS a FROM `table`
 **/
function Question21() {

	// get a valid foreign column
	var tbl_name = getTables(1)

	// cols to select table
	var col_name = getColumns(tbl_name, 1)
	var col_alias = col_name[0].substr(0, 1)

	var Q = 'Select the columns <em>' + col_name + '</em> with the alias <em>' + col_alias + '</em> from the table <em>' + tbl_name + '</em>'
	var A = 'SELECT ' + col_name + ' AS ' + col_alias + ' FROM ' + tbl_name

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		'type': 'Introducing column aliases'
	}
	return cache;
}

/**
 * Question 22: Introducing LIKE
 * Sample: SELECT `col` FROM `table` WHERE `col` LIKE '%ABC'
 **/
function Question22() {

	// get a valid text column
	var info = getTypeColumn('VARCHAR') 

	// get a random row value
	var row = getRows(info.tbl_name, info.col_name, 1).toString()

	// split the sentance if it is and return a random segement
	var split = row.split(' ')
	// shuffle it
	split = shuffle(split)

	// length of split word
	var row_length = split[0].length

	// generate randoms
	var before = getRandomInt(0, 1),
		// row_length -1 is the max it can be
		random_start = getRandomInt(1, Math.max(1, (row_length - 2)))

	// (row_length - random_start) is the full string
	var partial = row.substr(random_start, getRandomInt(2, (row_length - random_start)))

	var Q = 'Select all the rows from the table <em>' + info.tbl_name + '</em> where the column <em>' + info.col_name + '</em> contains "<em>' + partial + '</em>" anywhere in the row value'
	var A = 'SELECT * FROM `' + info.tbl_name + '` WHERE `' + info.col_name + '` LIKE "%' + partial + '%"'
	var I = ['LIKE']

	//set the cache
	cache = {
		Question: Q,
		Answer: A,
		Include: I,
		'type': 'Introducing LIKE clauses'
	}

	return cache;
}

/* Check the answer
 * @param {json} inputResult - the user input containing their sql output in json.stringify!
 * @param {string} raw - the raw SQL that the user inputted
 * @return {bool} - correct or not?
 */
function checkAnswer(inputResult, raw) {
	// refresh the current question from cookie
	currQuestion = getCurrQuestion();

	// fetch the model answer from the cache (generated when a question was stored)
	var cache = getQuestion(currQuestion);
	// if the answer isn't in the cache, return error
	if (!isDef(cache.Answer)) {
		return 'An error occurred while fetching the answer from the cache!';
	}

	debugMsg("checking cached question: ",cache);

	// Check to make sure syntax includes certain keywords, if set
	var inc = cache.Include;
	if (isDef(inc) && !(inc===null)) {
		var keywordIndex,
			r = raw.toUpperCase();
		debugMsg("checking query for keywords",inc," in ",r);

		for (var i = 0; i < inc.length; i++) {
			// search for the keyword, if strict, must come AFTER the previous keyword
			keywordIndex = r.indexOf(inc[i]); //, keywordIndex + 1)
			if (keywordIndex == -1) { // not found
				return 'Looking for the inclusion of the keyword: ' +
					inc[i] + ', but not found in the correct position!'
			}
		}
	}

	// set the blank arrays
	var modelResults = [],
		userResults = []

	// prepare both queries
	var stmt = db.prepare(raw.toUpperCase())
	var answerStmt = db.prepare(cache.Answer.toUpperCase())

	// run the statements in steps to loop each row
	while (answerStmt.step()) modelResults.push(answerStmt.getAsObject())
	while (stmt.step()) userResults.push(stmt.getAsObject())

	// free the statements to prevent memory leaks
	stmt.free()
	answerStmt.free()

	// check both result objects are of equal length
	if (modelResults.length != userResults.length || !userResults.length) {
		return 'Expected a total of ' + modelResults.length + ' row(s) to be returned' +
			', instead got ' + userResults.length + '!';
	}

	// extract the column names via the object keys
	var userColumns = Object.keys(userResults[0])
	var modelColumns = Object.keys(modelResults[0])

	// check if the columns selected is the same LENGTH as the model answer
	debugMsg('comparing user',userColumns, 'to model ',modelColumns);
	debugMsg('and user',userResults, 'to model ',modelResults);
	if (modelColumns.length != userColumns.length) {
		debugMsg("not same length");
		return 'Expected only the following column(s) to be selected: ' +
			modelColumns.join(', ');
	}

	var uc;
	// loop through each column
	for (var i = 0; i < userColumns.length; i++) {
		uc = userColumns[i];
		// construct a variable containing the row values contained in this column
		var answerObj = modelResults.map(function(item) {
			return item[uc
				// remove any unwanted punctuation
				//.replace(/[^A-Za-z()*]+/g, "")
				// and capitalize aggregate functions
				//.replace(/(COUNT|SUM|AVG|MIN|TOTAL|MAX|SUM)\(/gi, l => l.toUpperCase())
			]
		}).filter(function(x) {
			return typeof x !== 'undefined'
		})
		// filter out the undefined values, indication of mis-matched column names

		// do the same with the user's answer
		var userObj = userResults.map(function(item) {
			return item[uc]
		})

		// checks that the columns selected are expected
		if (answerObj.length != userObj.length) {
			debugMsg("difference",userObj, answerObj);
			return 'Expected only the following column(s) to be selected: ' +
				modelColumns.join(', ');
		}

		var lastItem;
		// checks every value in the users answer is included in the model answer
		var isPresent = answerObj.every(function(item, idx) {
			lastItem = item;
			return userObj.indexOf(item) !== -1
		})

		// if one column returns false, stop checking and return feedback
		if (!isPresent) {
			return 'The row containing "' + lastItem + '" in the column ' +
				uc + ' wasn\'t found within your result set';
		}
	}
	// if the code executed to this point, the solution is valid
	return true
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
	return a
}

/* Debug Message
 * outputs to the console the info in the parameters
 */
function debugMsg() {
	var debug = true; // set to true to turn on debugging at the console
	if (debug) {
		var m = [];
		var seen = [];
		for (i in arguments) {
			m.push(JSON.stringify(arguments[i], function(key, val) {
				if (val != null && typeof val == "object") {
					if (seen.indexOf(val) >= 0) {
						return "_seen";
					}
					seen.push(val);
				}
				return val;
			}
			));
		}
		console.log(m.join(" "));
	}
}

