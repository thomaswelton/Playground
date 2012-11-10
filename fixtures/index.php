<?php
require dirname(__FILE__).DIRECTORY_SEPARATOR.'ImageGenerator.php';
$coverPhoto = new ImageGenerator();

$coverPhoto->text("Week 3", 20, 20, array('width' => 811));
//Serve the file
echo $coverPhoto;