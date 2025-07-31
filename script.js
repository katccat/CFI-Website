const hamburger_menu = document.getElementById("hamburger");
const nav_links = document.getElementById("nav-links");
const reveal_contact_button = document.getElementById("reveal-contact");
const contact_area_div = document.getElementById("contact-area");
const is_portrait = window.matchMedia("(max-width: 1000px)");
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
	}
}
window.addEventListener('resize', function() {
	if (is_portrait.matches) {
		nav_links.classList.add("box-shadow");
	}
	else { // landscape
		nav_menu_show(); // unhides nav links if hidden for desktop view
		nav_links.classList.remove("box-shadow");
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
		<p><i>
			Email: <a href="mailto:${email}" class="persistent-link uncolored-link">${email}</a><br>
			Phone: ${phone}
		</i></p>
	`;
	contact_area_div.classList.add('visible');
	this.classList.add("active");
}

if (reveal_contact_button && contact_area_div) 
	reveal_contact_button.addEventListener("click", reveal_contact);