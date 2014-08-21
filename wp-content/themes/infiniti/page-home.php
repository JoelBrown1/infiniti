<?php
// Template Name: Home
get_header(); 
echo "this is the home page";
while ( have_posts() ) : the_post(); 
	
// the_content(); 

endwhile; 

// get_footer(); 
?>