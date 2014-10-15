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
	$firstLoad = true;
	$optinVal = 1;
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
		$firstLoad = false;
		$pattern = '/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
		$pcPatter = "/^([a-ceghj-npr-tv-z]){1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}$/i";
		$missing = array();
		$modelDets;
		if($_POST["firstname"] == "") array_push($missing, "First Name");
		if($_POST["lastname"] == "") array_push($missing, "Last Name");
		if($_POST["email"] == "" || preg_match($pattern, $_POST["email"]) == 0 || preg_match($pattern, $_POST["email"]) == false) {array_push($missing, "Email");}
		if($_POST["trip"] == "") array_push($missing, "Trip");
		if($_POST["vehicle"] == "") {
			array_push($missing, "Vehicle Model");
		} else { 
			$vDets = split(" ",$_POST["vehicle"]);
			if(count($vDets)>2){
				$modelDets = 	'<year>'.$vDets[2].'</year>
								<make>Infiniti</make>
								<model>'.$vDets[0].'</model>
								<trim>'.$vDets[1].'</trim>';
			} else {
				$modelDets = '<year>'.$vDets[1].'</year>
							<make>Infiniti</make>
							<model>'.$vDets[0].'</model>
							<trim></trim>';
			}
		}
		if($_POST["salesContact"] == "true"){
			$lead = 0;
		} else {
			$lead = 1;
		}
		if($_POST["Rules"] != "true"){array_push($missing, "Rules and Regulations");}
		$pCode = strtolower($_POST["pCode"]);
		$pCode = str_replace(' ', '', $pCode);
		if(preg_match($pcPatter, $pCode) == false) {array_push($missing, "Postal Code");}
		if($_POST["iMarketing"] == true){
			$optinVal = 0;
		}
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

				$url = "https://production.nissanleads.ca/leadservices/leadacceptanceservice.svc/sendlead";
				$content = '<?xml version="1.0" encoding="UTF-8"?>
								<adf>
									<prospect status="new">
										<id source="LeadId" sequence="0">3073</id>
										<id source="EventName" sequence="1">Infiniti Canada Undiscovered</id>
									    <id source="EventID" sequence="2">ICANUNDI</id>
										<requestdate>'.$rDate->format("Y-m-d H:i:s").'</requestdate>
										<vehicle status="new" interest="buy">'
											.$modelDets.
										'</vehicle>
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
												<donotsend>'.$lead.'</donotsend>
												<optin1>'.$optinVal.'</optin1>
											</contact>
											<language>EN</language>
										</customer>
										<vendor>
											<id source="nissan-dealer-id"></id>
											<vendorname></vendorname>
											<contact>
												<name part="first" type="individual"></name>
												<name part="last" type="individual"></name>
												<phone type="voice" time="nopreference" preferredcontact="0"></phone>
											</contact>
										</vendor>
										<provider>
											<id source="nissan-source-id">3073</id>
											<name part="full" type="individual">Nissan.ca</name>
										</provider>
									</prospect>
								</adf>';
				if($_POST["iMarketing"] == "true"){
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
				}

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
										<?php if($optinVal == 0){?>
										<div id="i_market"></div>
										<?php } ?> 
										<?php if($_POST["dealer"] == "true"){?>
										<div id="dealer"></div>
										<?php } ?>
										<h2>Success!</h2>
										<p>Your entry was submitted successfully. Thanks!</p>
									</div>
								<?php	break;
								
								case 2: ?>
									<div id="duplicate" class="formError">
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
										<option value="AB"<?php if($_POST["province"]== "AB") {?> selected="selected"<?php } ?>>Alberta</option>
										<option value="BC"<?php if($_POST["province"]== "BC") {?> selected="selected"<?php } ?>>British Columbia</option>
										<option value="MB"<?php if($_POST["province"]== "MB") {?> selected="selected"<?php } ?>>Manitoba</option>
										<option value="NB"<?php if($_POST["province"]== "NB") {?> selected="selected"<?php } ?>>New Brunswick</option>
										<option value="NL"<?php if($_POST["province"]== "NL") {?> selected="selected"<?php } ?>>Newfoundland and Labrador</option>
										<option value="NS"<?php if($_POST["province"]== "NS") {?> selected="selected"<?php } ?>>Nova Scotia</option>
										<option value="ON"<?php if($_POST["province"]== "ON") {?> selected="selected"<?php } ?>>Ontario</option>
										<option value="PE"<?php if($_POST["province"]== "PE") {?> selected="selected"<?php } ?>>Prince Edward Island</option>
										<option value="QC"<?php if($_POST["province"]== "QC") {?> selected="selected"<?php } ?>>Quebec</option>
										<option value="SK"<?php if($_POST["province"]== "SK") {?> selected="selected"<?php } ?>>Saskatchewan</option>
										<option value="NT"<?php if($_POST["province"]== "NT") {?> selected="selected"<?php } ?>>Northwest Territories</option>
										<option value="NU"<?php if($_POST["province"]== "NU") {?> selected="selected"<?php } ?>>Nunavut</option>
										<option value="YT"<?php if($_POST["province"]== "YT") {?> selected="selected"<?php } ?>>Yukon</option>
									</select>

									<input class="p_code" type="text" name="pCode" placeholder="Postal Code" value="<?php echo $_POST["pCode"]; ?>">
								</div>
								<div class="iCar clearfix">
									<select placeholder="Vehicle Models" class="model" name="vehicle">
										<option value="">Vehicle of Interest</option>
										<option value="QX50 2015" <?php if($_POST["vehicle"]== "QX50 2015") {?> selected="selected"<?php } ?> >QX50 2015</option>
										<option value="QX70 2015"<?php if($_POST["vehicle"]== "QX70 2015") {?> selected="selected"<?php } ?>>QX70 2015</option>
										<option value="Q50 2015"<?php if($_POST["vehicle"]== "Q50 2015") {?> selected="selected"<?php } ?>>Q50 2015</option>
										<option value="Q50 Hybrid 2015"<?php if($_POST["vehicle"]== "Q50 Hybrid 2015") {?> selected="selected"<?php } ?>>Q50 Hybrid 2015</option>
										<option value="Q50 2014"<?php if($_POST["vehicle"]== "Q50 2014") {?> selected="selected"<?php } ?>>Q50 2014</option>
										<option value="Q50 Hybrid 2014"<?php if($_POST["vehicle"]== "Q50 Hybrid 2014") {?> selected="selected"<?php } ?>>Q50 Hybrid 2014</option>
										<option value="Q60 Convertible 2014"<?php if($_POST["vehicle"]== "Q60 Convertible 2014") {?> selected="selected"<?php } ?>>Q60 Convertible 2014</option>
										<option value="Q60 Coupe 2014"<?php if($_POST["vehicle"]== "Q60 Coupe 2014") {?> selected="selected"<?php } ?>>Q60 Coupe 2014</option>
										<option value="Q70 2014"<?php if($_POST["vehicle"]== "Q70 2014") {?> selected="selected"<?php } ?>>Q70 2014</option>
										<option value="Q70 Hybrid 2014"<?php if($_POST["vehicle"]== "Q70 Hybrid 2014") {?> selected="selected"<?php } ?>>Q70 Hybrid 2014</option>
										<option value="QX60 2014"<?php if($_POST["vehicle"]== "QX60 2014") {?> selected="selected"<?php } ?>>QX60 2014</option>
										<option value="QX60 Hybrid 2014"<?php if($_POST["vehicle"]== "QX60 Hybrid 2014") {?> selected="selected"<?php } ?>>QX60 Hybrid 2014</option>
										<option value="QX80 2014"<?php if($_POST["vehicle"]== "QX80 2014") {?> selected="selected"<?php } ?>>QX80 2014</option>
									</select>
								</div>
								<div class="rules_regs clearfix">
									<div class="optin"><input type="checkbox" name="salesContact" value="true" <?php if($_POST["salesContact"] == "true"){ echo "checked";} ?> > Yes, I would like an Infiniti retailer to contact me </div>
									<div class="i_disclaimer option">Note: You may withdraw your consent at any time. By providing your personal information above, you agree to the collection, use and disclosure of the personal information you provided as described in our <a href="http://www.infiniti.ca/en/privacy.html" target="_blank">Privacy Policy</a> </div>
								</div>
								<div class="rules_regs">
									<!-- <div class="optin clearfix">Yes, I would like an Infiniti retailer to contact me <input type="radio" name="salesContact" value="yes"> Yes <input type="radio" name="salesContact" value="no"> No</div> -->
									<input class="rules" type="checkbox" name="Rules" value="true" <?php if($_POST["Rules"] == "true"){ echo "checked";} ?> >Yes, I agree to the Contest <a href="<?php echo  get_home_url().'/canada-undiscovered-contest-the-contest/'; ?>" target="_blank">Rules and Regulations</a><br>
								</div>
									<div class="optin clearfix"><input class="oMarketing" type="checkbox" name="oMarketing" value="true" <?php if($_POST["oMarketing"] == "true"){ echo "checked";} ?> > <div class="disclaimer">I agree to receive electronic communications from Blue Ant Media Television Ltd. containing news, updates and promotions regarding Oasis HD, radX, Hifi and The Smithsonian Channel.  You may withdraw your consent at any time. Blue Ant Media Television, 130 Merton Street Suite 200, Toronto, Ontario M4S 1A4 <a href="http://www.oasishd.ca/" target="_blank">oasishd.ca</a></div></div>
									<div class="optin clearfix"><input class="iMarketing" type="checkbox" name="iMarketing" value="true" <?php if($_POST["iMarketing"] == "true"){ echo "checked";} ?> ><div class="disclaimer">Yes, I would like to receive newsletters, marketing and promotional materials from Infiniti Canada Inc. and its affiliates regarding Infiniti Canada Inc.’s products and services.  You can withdraw your consent at any time.<br> Please refer to our <a href="http://www.infiniti.ca/en/privacy.html" target="_blank">Privacy Policy</a> or <a href="http://www.infiniti.ca/en/privacy.html#Contact" target="_blank">Contact Us</a> for more details.  Affiliates: Infiniti Canada Financial Services Inc., Infiniti Canada Extended Services Inc. By providing your personal information above, you agree to the collection, use and disclosure of the personal information you provided as described in our <a href="http://www.infiniti.ca/en/privacy.html" target="_blank">Privacy Policy</a></div></div>								
								<button type="submit" value="Enter">Enter</button>
							</form>
					
				<div id="bottom_cta">
					<img src="<?php echo $footer_image[0];?>" alt="">
				</div>
			</main>
			<script type="text/javascript">
				var $ = jQuery;
				var contest = true;
				var missing = [];

				$(document).ready( function(){

					var formSubmitted = <?php echo $errorFlag; ?>;

					if(formSubmitted == 1){
						var opt = false;
						if($("#i_market").length > 0){
							opt = true;
						} 
						if($("#dealer").length > 0){
							// new flag to send to reporting to go here...
						}
						sendTagData(182,opt,"");
					} 
				})
			
				function validation(){
					if(missing.length > 0){
						var msges = $("form").find(".warning");
						missing = [];						
					}
					$(".warning").each(function(){
						$(this).removeClass("warining");
					});

					$("#tripWarning").css("display", "none");

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
							if($("#tripWarning").css({display: "block"})){
								$("#tripWarning").css({display: "none"});
							}
							break;
						} else {
							flag = 1;
						}
						k++;
					}

					while(req[i]){
						if(req[i].value != ""){
							req[i].className = "r_data names";
							if(req[i].getAttribute("name") == "email"){
								var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							    if(re.test(req[i].value) == false){
							    	flag = 1;
							    	req[i].className = "r_data warning";
							    	missing.push(req[i]);
							    } else {
							    	req[i].className = "r_data";
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
					} else {
						model[0].className = "model";
					}
					if(pc[0].value != "" ){
						var pcRE = /[a-zA-Z][0-9][a-zA-Z]( )?[0-9][a-zA-Z][0-9]/;
						if(pcRE.test(pc[0].value) == false){
							pc[0].className = pc[0].className + " warning";
							flag = 1;
							missing.push(pc);
						} else {
							pc[0].className = "p_code";
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
					} else {
						rules[0].parentNode.className = "rules_regs";
					}
					if(missing.length > 0){
						sendTagData(181, "", "");
						if(trips == false){
							$("#tripWarning").css("display", "block");
						}
						return false;
					} else {
						return true;
					}
				}
			
			</script>
			<?php get_footer(); ?>