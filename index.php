<!DOCTYPE html>
<html>
<head>
	<title>Data Model Editor</title>
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon">
    <link rel="icon" href="./favicon.ico" type="image/x-icon">
    <style type="text/css">
		* { margin: 0; padding: 0; }
		body { font-size: 14px; font-family: sans-serif; line-height: 30px; }
		.page-wrap { display: block; padding: 0px; }
		h1 { padding-bottom: 10px; border-bottom: 1px solid #cc9999; margin-bottom: 10px; }
		.csv-content { margin-top: 20px; }
		table { table-layout: fixed; border-collapse: collapse; }
		tr th { padding: 5px 10px; background: #99CC66; cursor: pointer;}
		tr td { border: 1px solid #666666; padding: 0 10px; max-width: 10%;}
		table tbody tr:nth-child(even) { background-color: whitesmoke; }
		.action-btns { margin-top: 15px; }
		td:focus { outline: 1px dashed black; background: #cccc99; }
		.csv-content ul { line-height: 20px; margin: 20px 15px; }
	</style>
</head>
<body>

	<div class="page-wrap">
		<!--<h1>CSV Editor</h1>-->

		<div class="uploader-content">
			<p>Upload your CSV file below</p>
			<input type="file" class="csv-file" name="csv_file">
        </div>
        <div class="action-btns" style="display: none;">
             <a class="gen-csv" href="generate-csv.php">Download Updated CSV</a>
        </div>


		<div class="csv-content">
			
        </div>

        <div class="action-btns" style="display: none;">
             <button id="add-row" accesskey=q>Add Row[q]</button>
             <button id="del-row" accesskey=w>Del Row[w]</button>
        </div>

	</div>
	<script src="js/jquery.min.js" type="text/javascript"></script>
	<script src="js/app.js" type="text/javascript"></script>

	<script type="text/javascript">
		var app = new App();
		app.init();
	</script>
</body>
</html>
