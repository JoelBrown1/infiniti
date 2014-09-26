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
	$crmID = get_post_meta($post->ID, 'crmPageID');

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
		$pcPatter = "/^([a-ceghj-npr-tv-z]){1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}$/i";
		$missing = array();
		if($_POST["firstname"] == "") array_push($missing, "First Name");
		if($_POST["lastname"] == "") array_push($missing, "Last Name");
		if($_POST["email"] == "" || preg_match($pattern, $_POST["email"]) == 0 || preg_match($pattern, $_POST["email"]) == false) {array_push($missing, "Email");}
		if($_POST["trip"] == "") array_push($missing, "Trip");
		if($_POST["vehicle"] == "") {
			array_push($missing, "Vehicle Model");
		} else { 
			$vDets = split(" ",$_POST["vehicle"]);
		}
		if($_POST["Rules"] != "true"){array_push($missing, "Rules and Regulations");}
		if($_POST["Privacy"] != "true"){array_push($missing, "Privacy Policy");}
		if(preg_match($pcPatter, $_POST["pCode"]) == false) {array_push($missing, "Postal Code");}
		$tStamp = new DateTime();
		$cIP = get_client_ip();
		$data = $wpdb->get_results( $wpdb->prepare("SELECT * FROM $table_name WHERE email=%s", $_POST["email"]));
		if(count($missing)>0){
				$dataError = true;
		} else {
			if(count($data)==0){
				$errorFlag = $wpdb->insert(
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
									'rules'				=> $_POST["Rules"],
									'privacy'			=> $_POST["Privacy"],
									'vehicle'			=> $_POST["vehicle"],
									'oMarketing'		=> $_POST["oMarketing"],
									'iMarketing'		=> $_POST["iMarketing"],
									'time_stamp'		=> $tStamp->format('Y-m-d H:i:s'),
									'ip_address'		=> $cIP,
									'agent_string'		=> $_SERVER['HTTP_USER_AGENT']
								),
								array(
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s',
									'%s'
								)
							);

				$url = "http://staging.nissanleads.ca/leadservices/leadacceptanceservice.svc/SendLead";
				$content = '<?xml version="1.0" encoding="UTF-8"?>
								<adf>
									<prospect status="new">
										<id source="LeadId" sequence="0">8059</id>
										<id source="EventName" sequence="1">Infiniti Canada Undiscovered</id>
									    <id source="EventID" sequence="2">ICANUNDI</id>
										<requestdate>'.$rDate->format("Y-m-d H:i:s").'</requestdate>
										<vehicle status="new" interest="buy">
											<year>'.$vDets[1].'</year>
											<make>Infiniti</make>
											<model>'.$vDets[0].'</model>
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
											<language>EN</language>
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
				/*echo $content;*/

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

				$errorFlag = 1;
								
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
							<form action="" onsubmit="return validation()" method="post">
								<div id="tripWarning">
									Please be sure to select your favourite journey...
								</div>
								<div id="trips clearfix">
								<?php
									$counter = 0;
									$trips = array("Pacific Rim National Park", "Athabasca Sand Dunes", "Sable Island");
									$cVal = "";
									$imgURL = array("Vote_Rainforest.jpg", "Vote_SandDunes.jpg", "Vote_NS.jpg");
									foreach ($trips as $trip) {
										if($trip == $_POST["trip"])	{
											$cVal = "checked";
										} else { 
											$cVal = ""; 
										}
										$tripImg = get_template_directory_uri().'/images/'.$imgURL[$counter];
										if($counter == 0){  ?>

											<label class="trip gbr">
												<input class="t_data" type="radio" name="trip" value="<?php echo $trip; ?>" <?php echo $cVal; ?> >
												<img src="<?php echo $tripImg; ?>" alt="<?php echo $trip."Trip"; ?>">
												<h4><?php echo $trip; ?></h4>
											</label>
								<?php	} else {  ?>

											<label class="trip">
												<input class="t_data" type="radio" name="trip" value="<?php echo $trip; ?>" <?php echo $cVal; ?> >
												<img src="<?php echo $tripImg; ?>" alt="<?php echo $trip."Trip"; ?>">
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
									<select placeholder="Province" name="province">
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

									<input class="p_code" type="text" name="pCode" placeholder="Postal Code" value="<?php echo $_POST["pCode"]; ?>">
								</div>
								<div class="iCar clearfix">
									<select placeholder="Vehicle Models" class="model" name="vehicle">
										<option value="">Choose a Model</option>
										<option value="QX50 2015">QX50 2015</option>
										<option value="QX70 2015">QX70 2015</option>
										<option value="Q50 2015">Q50 2015</option>
										<option value="Q50 Hybrid 2015">Q50 Hybrid 2015</option>
										<option value="Q50 2014">Q50 2014</option>
										<option value="Q50 Hybrid 2014">Q50 Hybrid 2014</option>
										<option value="Q60 Convertible 2014">Q60 Convertible 2014</option>
										<option value="Q60 Coupe 2014">Q60 Coupe 2014</option>
										<option value="Q70 2014">Q70 2014</option>
										<option value="Q70 Hybrid 2014">Q70 Hybrid 2014</option>
										<option value="QX60 2014">QX60 2014</option>
										<option value="QX60 Hybrid 2014">QX60 Hybrid 2014</option>
										<option value="QX80 2014">QX80 2014</option>
									</select>
								</div>
								<div class="rules_regs">
									<input class="rules" type="checkbox" name="Rules" value="true">I agree to the <a href="<?php echo  get_home_url().'/canada-undiscovered-contest-the-contest/'; ?>" target="_blank">Rules and Regulations</a><br>
									<input class="privacy" type="checkbox" name="Privacy" value="true">I agree to the <a href="http://www.infiniti.ca/en/privacy.html" target="_blank">Privacy Policy</a><br>
								</div>
									<div class="optin clearfix"><input class="oMarketing" type="checkbox" name="oMarketing" value="true"> <div class="disclaimer">I agree to receive electronic communications from Blue Ant Media Television Ltd. containing news, updates and promotions regarding Oasis HD, radX, Hifi and The Smithsonian Channel.  You may withdraw your consent at any time. Blue Ant Media Television, 130 Merton Street Suite 200, Toronto, Ontario M4S 1A4 <a href="http://www.oasishd.ca/" target="_blank">oasishd.ca</a></div></div>
									<div class="optin clearfix"><input class="iMarketing" type="checkbox" name="iMarketing" value="true"><div class="disclaimer">Yes I would like to receive communications, including emails, from Infiniti, a division of Nissan Canada  Inc. about them and their products, services, events, news, updates, offers, promotions, customized ads, and more. I may withdraw consent at any time. Infiniti Canada, 5290 Orbitor Drive, Mississauga, Ontario L4W 4Z5 <a href="http://www.infiniti.ca/en/" target="_blank">infiniti.ca</a></div></div>								
								<button type="submit" value="Enter">Enter</button>
							</form>
					
				<div id="bottom_cta">
					<img src="<?php echo $footer_image[0];?>" alt="">
				</div>
			</main>
			<script type="text/javascript">
				var $ = jQuery;
				$(document).ready( function(){
					var formSubmitted = <?php echo $errorFlag ?>;
					sendTagData(180,"","");

					if(formSubmitted == 1){
						sendTagData(182,"","");
					} else {
						console.log("there was no formSubmitted information");
					}
				})
			
				function validation(){
					console.log("inside the validation function");
					$(".warning").each(function(){
						$(this).removeClass("warining");
					});

					$("#tripWarning").css("display", "none");
					var missing = [];
					var flag = 0;
					var trips = false;
					var tripCheck = document.getElementsByClassName("t_data");
					var req = document.getElementsByClassName("r_data");
					var pc = document.getElementsByClassName("p_code");
					var model = document.getElementsByClassName("model");
					var rules = document.getElementsByClassName("rules");
					var privacy = document.getElementsByClassName("privacy");
					var k = 0;
					var i = 0;
					while(tripCheck[k]){
						if(tripCheck[k].checked){
							tripCheck[k].checked = true;
							trips = true;
							break;
						} else {
							flag = 1;
						}
						k++;
						console.log("this is the tripCheck");
					}
						console.log("this is the tripCheck: ", tripCheck);

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
					if(!model[0].options[model[0].options.selectedIndex].value){
						flag = 1;
						model[0].className = model[0].className + " warning";
						missing.push(model);
					}
					if(pc[0].value != "" ){
						var pcRE = /[a-zA-Z][0-9][a-zA-Z]( )?[0-9][a-zA-Z][0-9]/;
						if(pcRE.test(pc[0].value) == false){
							console.log("this is the pc if it fails: ", pc[0].value);
							pc[0].className = pc[0].className + " warning";
							flag = 1;
							missing.push(pc);
						} else {
							console.log("the postal code passed");
						}
					} else {
						pc[0].className = pc[0].className+" warning";
						flag = 1;
						missing.push(pc);
					}
					if(rules[0].checked != true){
						flag = 1;
						missing.push(rules);

						rules[0].parentNode.className = rules[0].parentNode.className+" warning";
					}
					if(privacy[0].checked != true){
						flag = 1;
						missing.push(privacy);

						privacy[0].parentNode.className = privacy[0].parentNode.className+" warning";
					}
					console.log("last check for error flags");
					if(missing.length() > 0){
						console.log("the missing array: ", missing);
						console.log("we threw an error?");
						sendTagData(181, "", "");
						if(trips == false){
							$("#tripWarning").css("display", "block");
						}
						return false;
					} else {
						console.log("did this return true?");
						return true;
					}
				}
			
			</script>
			<?php get_footer(); ?>