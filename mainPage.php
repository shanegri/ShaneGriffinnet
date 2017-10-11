<?php function showMainPage($content, $pageName){ ?>

<!DOCTYPE html>
<html >
  <head>
    <meta charset="utf-8">
    <title>Shane Griffin</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Karla" rel="stylesheet">
  </head>
  <body>
    <div class="LEFTnav">
      <a href="TEMP"><p id="TITLE" style="font-size: 25px; background: black; color: white;">Shane Griffin</p></a>
      <a href="Projects"><p>PROJECTS</p></a>
      <a href="Photography"><p>PHOTOGRAPHY</p></a>
      <a href="Motion_Design"><p>MOTION DESIGN</p></a>
      <a href="Resume"><p>RESUME</p></a>
    </div>
    <div class="CENTERcontent">
      <h2>	&nbsp <?php echo $pageName;  ?></h2>
      <div class="CENTERcontentContent">
        <?php require_once("$content") ?>
      </div>
    </div>
    <div class="RIGHTspacer">
      <footer><a target="_blank" href="https://github.com/shanegri/ShaneGriffinNet">View Source</a></footer>
    </div>
  </body>

</html>

<?php } ?>
