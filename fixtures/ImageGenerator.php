<?php

class ImageGenerator{

	function __construct($width = 851, $height = 315, $background = 'blue', $options = array()){
		//Create a new Imagick inmage object to the specified canvas size and background color
		$this->image = new Imagick();
		$this->image->newImage($width, $height, new ImagickPixel($background));
		$this->image->setImageFormat("jpg");

		$this->defaults = array_merge(array(
			'color' => 'white',
			'width' => $width,
			'font-size' => 45,
			'align' => 'left' 
			//'font' => dirname(__FILE__).DIRECTORY_SEPARATOR.'Helvetica-Bold.ttf'
		),$options);
	}

	public function __toString(){
		header('Content-Type: image/'.$this->image->getImageFormat());
		return $this->image->__toString();
	}

	/*
	Draws text onto out canvas.
	The top left of the text starts at the user defined coordinates, this is differnet from ImageMagick which uses the y coordinate as the baseline to draw the text
	Allows for user defined drawing options

	returns true or false depenindg on text overflow
	*/
	public function text($string, $top, $left, $options = array()){
		$draw = new ImagickDraw();
		//Merge the user define options ontop of and class wide defaults
		$options = array_merge($this->defaults,$options);

		$draw->setFillColor($options['color']);
		$draw->setFontSize($options['font-size']);
		if(!is_null($options['font'])){
			$draw->setFont($options['font']);
		}
		$draw->setGravity(Imagick::GRAVITY_CENTER);
		$draw->setStrokeAntialias(false);
		$draw->setTextAntialias(true);

		switch($options['align']){
			case 'right':
				$draw->setTextAlignment(3);
				$left += $options['width'];
				break;
			case 'left':
			default:
				$draw->setTextAlignment(1);	
		}

		//Split text onto new lines based on our max width
		$words = explode(" ",$string);
		$lines = array();

		$lineHeight = 0;

		foreach($words as $word){
			//Try to draw this line, the attempt is the word appended to all previous words that are know to fit on this line
			$attempt = (sizeof($lines) === 0) ? $word : $lines[sizeof($lines) - 1]['string'].' '.$word;
			
			//Find imformation about the text we want to draw
			$metrics = $this->image->queryFontMetrics($draw,$attempt);
			
			$lineHeight = $metrics['textHeight'];

			//Check if the width of this line is greater that the max width of the drawing area
			if($metrics['textWidth'] < $options['width'] && sizeof($lines) !== 0){
				$lines[sizeof($lines) - 1]['string'] .= ' '.$word;
			}else{
				$lines[] = array('string' => $word, 'left' => $left, 'top' => $top + ($lineHeight + sizeof($lines)  * $lineHeight));
			}
		}

		//echo "<pre>"; print_r($lines); die;

		for($i = 0; $i < count($lines); $i++)
		    $this->image->annotateImage($draw, $lines[$i]['left'], $lines[$i]['top'], 0, $lines[$i]['string']);

		$draw->clear();
		$draw->destroy();

		return (($lines[count($lines) - 1]['top'] + $lineHeight) < $this->image->height);
	}
}