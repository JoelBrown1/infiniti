<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package infiniti
 */
	global $post;
	global $wpdb;
	$table_name = $wpdb->prefix."contest_entry";
	$errorFlag = 0;
	$dataError = false;
	$rDate = new DateTime();
	$cIP = get_client_ip();
	function get_client_ip() {
	    $ipaddress = '';
	    if ($_SERVER['HTTP_CLIENT_IP'])
	        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
	    else if($_SERVER['HTTP_X_FORWARDED_FOR'])
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
	    else if($_SERVER['HTTP_X_FORWARDED'])
	        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
	    else if($_SERVER['HTTP_FORWARDED_FOR'])
	        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
	    else if($_SERVER['HTTP_FORWARDED'])
	        $ipaddress = $_SERVER['HTTP_FORWARDED'];
	    else if($_SERVER['REMOTE_ADDR'])
	        $ipaddress = $_SERVER['REMOTE_ADDR'];
	    else
	        $ipaddress = 'UNKNOWN';
	    return $ipaddress;
	}

	$imageSrc;
	if(has_post_thumbnail()){
		$imageSrc = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' );
	}
	$footer_image = get_post_meta($post->ID, 'footer_image');

	if($_POST){
		$pattern = '/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
		$pcPatter = '/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/';
		$missing = array();
		if($_POST["firstname"] == "") array_push($missing, "First Name");
		if($_POST["lastname"] == "") array_push($missing, "Last Name");
		if($_POST["email"] == "" || preg_match($pattern, $_POST["email"]) == 0 || preg_match($pattern, $_POST["email"]) == false) {array_push($missing, "Email");}
		if($_POST["trip"] == "") array_push($missing, "trip");
		if($_POST["pCode"] == "" || preg_match($pcPatter, $_POST["pCode"]) == 0 || preg_match($pattern, $_POST["pCode"]) == false) {array_push($missing, "Postal Code");}

		$tStamp = new DateTime();
		$cIP = get_client_ip();
		$data = $wpdb->get_results( $wpdb->prepare("SELECT * FROM $table_name WHERE email=%s", $_POST["email"]));
		if(count($missing)>0){
				$dataError = true;
		} else {
			if(count($data)==0){
				/*$errorFlag = $wpdb->insert(
								$table_name,
								array(
									'f_name' 			=> $_POST["firstname"],
									'l_name' 			=> $_POST["lastname"],
									'email'				=> $_POST["email"],
									'telephone' 		=> $_POST["telephone"],
									'street_address'	=> $_POST["streetAddress"],
									'city'				=> $_POST["city"],
									'province'			=> $_POST["province"],
									'postal_code'		=> $_POST["pCode"],
									'trip_choice'		=> $_POST["trip"],
									'time_stamp'		=> $tStamp->format('Y-m-d H:i:s'),
									'ip_address'		=> $cIP,
									'agent_string'		=> $_SERVER['HTTP_USER_AGENT']
								),
								array(
									'%s',
									'%s',
									'%s',
									'%s',
									'%s'
								)
							);*/

				$url = "http://staging.nissanleads.ca/leadservices/leadacceptanceservice.svc/SendLead";
				$content = '<?xml version="1.0" encoding="UTF-8"?>
								<adf>
									<prospect status="new">
										<id source="LeadId" sequence="0">8059</id>
										<requestdate>'.$rDate->format("Y-m-d H:i:s").'</requestdate>
										<vehicle status="new" interest="buy">
											<year>2013</year>
											<make>Nissan</make>
											<model>Sentra</model>
											<comments />
										</vehicle>
										<customer>
											<contact>
												<name part="first" type="individual">'.$_POST["firstname"].'</name>
												<name part="last" type="individual">'.$_POST["lastname"].'</name>
												<email preferredcontact="0">'.$_POST["email"].'</email>
												<phone type="voice" time="evening" preferredcontact="1">'.$_POST["telephone"].'</phone>
												<address type="home">
													<street line="1">'.$_POST["streetAddress"].'</street>
													<city>'.$_POST["city"].'</city>
													<regioncode>'.$_POST["province"].'</regioncode>
													<postalcode>'.$_POST["pCode"].'</postalcode>
												</address>
												<donotsend>1</donotsend>
											</contact>
										</customer>
										<vendor>
											<id source="nissan-dealer-id">12345</id>
											<vendorname>Unknown</vendorname>
											<contact>
												<name part="first" type="individual">Unknown</name>
												<name part="last" type="individual">Unknown</name>
												<phone type="voice" time="nopreference" preferredcontact="0">(111) 111-1111</phone>
											</contact>
										</vendor>
										<provider>
											<id source="nissan-source-id">8059</id>
											<name part="full" type="individual">Nissan.ca</name>
										</provider>
									</prospect>
								</adf>';


/* uncomment this 
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_VERBOSE, 1); // set url to post to 
				curl_setopt($ch, CURLOPT_URL, $url); // set url to post to
				curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: text/xml"));
				curl_setopt($ch, CURLOPT_HEADER, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_POST, 1);  
				$response = curl_exec($ch);
				curl_close($ch);
				echo $response;*/
				
/* - just got this message:
HTTP/1.1 100 Continue 
HTTP/1.1 200 OK 
Content-Length: 169 
Content-Type: application/xml; charset=utf-8 
Server: Microsoft-IIS/8.0 
X-Powered-By: ASP.NET 
Date: Mon, 15 Sep 2014 15:14:57 GMT 
3585778 Accepted true
*/
				
			} else {
				$errorFlag = 2;
			}
		}
	}

get_header(); ?>
<?php get_sidebar(); ?>
		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">
				<?php 

					if(has_post_thumbnail()){ ?>
						<div id="post_banner">
							<img src="<?php echo $imageSrc[0]; ?>" alt="<?php echo $post->post_title ;?>">
						</div>
				<?php	} ?>
						<div id="cta">
							<h1>Vote for your favourite Journey</h1>
							<p>Enter to win a weekend journey to one of these amazing destinations. Fill out the contest entry form below and you'll be entered to win.</p>
						</div>
						<?php 	if($dataError){ ?>
							<div class="formError">
								There was an error. Please complete the following form fields:<br>
								<?php
										echo implode(", ",$missing);
								?>
							</div>
						<?php	} 

							switch ($errorFlag) {
								case 1: ?>
									<div id="thanks">
										<h2>Success!</h2>
										<p>Your entry was submitted successfully. Thanks!</p>
									</div>
								<?php	break;
								
								case 2: ?>
									<div  class="formError">
										<h2>Sorry!</h2>
										<p>You've already entered.</p>
									</div>
								<?php	break;
								
								} 
								?>
							<form action="" onsubmit="return validation()"> <!--  method="post"-->
								<div id="tripWarning">
									Please be sure to select your favourite journey...
								</div>
								<div id="trips clearfix">
								<?php
									$counter = 1;
									$trips = array("Great Bear Rainforest", "Sable Island", "Athabasca Sand Dunes");
									$cVal = "";
									foreach ($trips as $trip) {
										if($trip == $_POST["trip"])	{
											$cVal = "checked";
										}
										if($counter == 1){  ?>

											<label class="trip gbr">
												<input class="t_data" type="radio" name="trip" value="<?php echo $trip; ?>" <?php echo $cVal; ?> >
												<img src="<?php echo get_template_directory_uri().'/images/trip1.png'; ?>" alt="<?php echo $trip."Trip"; ?>">
												<h4><?php echo $trip; ?></h4>
											</label>
								<?php	} else {  ?>

											<label class="trip">
												<input class="t_data" type="radio" name="trip" value="<?php echo $trip; ?>" <?php echo $cVal; ?> >
												<img src="<?php echo get_template_directory_uri().'/images/trip1.png'; ?>" alt="<?php echo $trip."Trip"; ?>">
												<h4><?php echo $trip; ?></h4>
											</label>
								<?php	} 
										$counter++;
									}
								?>
								</div>
								<div class="clearfix">
									<input class="r_data names" type="text" name="firstname" placeholder="First Name" value="<?php echo $_POST["firstname"]; ?>">
									<input class="r_data names" type="text" name="lastname" placeholder="Last Name" value="<?php echo $_POST["lastname"]; ?>">
								</div>
								<input class="r_data" type="text" name="email" placeholder="Email" value="<?php echo $_POST["email"]; ?>">
								<input type="text" name="telephone" placeholder="Phone Number" value="<?php echo $_POST["telephone"]; ?>">
								<input type="text" name="streetAddress" placeholder="Street Address" value="<?php echo $_POST["streetAddress"]; ?>">
								<input type="text" name="city" placeholder="City" value="<?php echo $_POST["city"]; ?>">
								<div class="clearfix">
									<select placeholder="Province">
										<option value="">Province</option>
										<option value="AB">Alberta</option>
										<option value="BC">British Columbia</option>
										<option value="MB">Manitoba</option>
										<option value="NB">New Brunswick</option>
										<option value="NL">Newfoundland and Labrador</option>
										<option value="NS">Nova Scotia</option>
										<option value="ON">Ontario</option>
										<option value="PE">Prince Edward Island</option>
										<option value="QC">Quebec</option>
										<option value="SK">Saskatchewan</option>
										<option value="NT">Northwest Territories</option>
										<option value="NU">Nunavut</option>
										<option value="YT">Yukon</option>
									</select>

									<!-- <input type="text" name="province" placeholder="Province" value="<?php $_POST["province"]; ?>"> -->
									<input class="p_code" type="text" name="pCode" placeholder="Postal Code" value="<?php echo $_POST["pCode"]; ?>">
								</div>
								<button type="submit" value="Enter">Enter</button>
							</form>
					
				<div id="bottom_cta">
					<img src="<?php echo $footer_image[0];?>" alt="">
				</div>
			</main>
			<script type="text/javascript">
				var $ = jQuery;
				//console.log("this is the select elements: ", sel);

			
				function validation(){
					var missing = [];
					var flag = 0;
					var trips = false;
					var tripCheck = document.getElementsByClassName("t_data");
					var req = document.getElementsByClassName("r_data");
					var pc = document.getElementsByClassName("p_code");
					var k = 0;
					var i = 0;
					while(tripCheck[k]){
						if(tripCheck[k].checked){
							trips = true;
							break;
						} else {
							flag = 1;
							// return false;
						}
						k++;
					}

					while(req[i]){
						if(req[i].value != ""){
							if(req[i].getAttribute("name") == "email"){
								var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							    if(re.test(req[i].value) == false){
							    	flag = 1;
							    	missing.push(req[i]);
							    }
							}
						} else {
					    	req[i].className = req[i].className+" warning";
							flag = 1;
							missing.push(req[i]);
						}
						i++;
					}
					if(pc.value){
						var pcRE = /[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/;
						if(pcRE.test(pc.value) == false){
							pc[0].className = pc[0].className + " warning";
							flag = 1;
							missing.push(pc);
						}
					} else {
						pc[0].className = pc[0].className+" warning";
						flag = 1;
						missing.push(pc);
					}
					if(flag != 0){
						if(trips == false){
							$("#tripWarning").css("display", "block");
						}

/*						if(missing.length > 0){
							var b = 0;
							while(missing[b]){
								b++
							}
						}

*/						return false;
					} else {
						// return true;
						return false;
					}
				}
			
			</script>
			<?php get_footer(); ?>
		</div>

<?php //get_footer(); ?>
