const hamburger_menu = document.getElementById("hamburger");
const nav_links = document.getElementById("nav-links");
const reveal_contact_button = document.getElementById("reveal-contact");
const contact_area_div = document.getElementById("contact-text");
const is_portrait = window.matchMedia("(max-width: 1024px)");
let was_desktop = true;

function nav_menu_show() {
	hamburger_menu.classList.add("active");
	nav_links.classList.add("visible");
}
function nav_menu_hide() {
	hamburger_menu.classList.remove("active");
	nav_links.classList.remove("visible");
}
window.onload = function() {
	if (is_portrait.matches) {
		nav_links.classList.add("box-shadow");
		was_desktop = false;
	}
}

window.addEventListener('resize', function() {
	if (is_portrait.matches) {
		nav_links.classList.add("box-shadow");
		if (was_desktop) {
			nav_menu_hide();
		}
		was_desktop = false;
	}
	else { // landscape
		nav_menu_show(); // makes sure nav links are visible in desktop view
		nav_links.classList.remove("box-shadow");
		was_desktop = true;
	}
});
hamburger_menu.addEventListener('click', function() {
	if (nav_links.classList.contains('visible')) {
		nav_menu_hide();
	}
	else {
		nav_menu_show();
	}
});
function reveal_contact() {
	// Obfuscated data (Base64 encoded)
	const encodedEmail = "d2VsYmVyZDIwMDRAZ21haWwuY29t";
	const encodedPhone = "KDIwMSktODQxLTI0Mjk=";

	// Decode
	const email = atob(encodedEmail);
	const phone = atob(encodedPhone);

	// Inject into contact area
	contact_area_div.innerHTML = `
		<p>
			Email: <a href="mailto:${email}" class="persistent-link uncolored-link">${email}</a><br>
			Phone: ${phone}
		</p>
	`;
	contact_area_div.classList.add('visible');
	contact_area_div.classList.remove('placeholder-text');
	this.classList.add("active");
}

if (reveal_contact_button && contact_area_div) 
	reveal_contact_button.addEventListener("click", reveal_contact);

function start_slide_show(target_element, image_directory, image_list, duration) {
	let index = 0;

	update_image();
	setInterval(update_image, duration);

	function update_image() {
		target_element.classList.add('fade-out');

		// Wait for fade-out to complete before changing image
		setTimeout(() => {
			target_element.src = image_directory + image_list[index];
			index = (index + 1) % image_list.length;

			// Wait for the image to load before fading in
			target_element.onload = () => {
				target_element.classList.remove('fade-out');
			};
		}, 300); // match this to the CSS transition duration
	}
}