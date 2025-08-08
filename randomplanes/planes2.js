const name = document.getElementById("name");
const image = document.getElementById("image");
const description = document.getElementById("description");
const disclaimer = document.getElementById("disclaimer");

const year_input = document.getElementById("year");
let google_quota_exceeded = false; // Skip Google fallback if true

const MAX_RETRIES = 3; // Number of times to retry for a plane with an image

year_input.addEventListener('keydown', function (event) {
	if (event.keyCode === 13) {
		random_playne();
	}
});

const latest_year = 2025; // latest year with first flown in category
const latest_decade = latest_year - (latest_year % 10);

const decade_1890 = [
	"Category:Aircraft first flown in 1891",
	"Category:Aircraft first flown in 1893",
	"Category:Aircraft first flown in 1895",
	"Category:Aircraft first flown in 1896"
];
const decade_1900 = [
	"Category:Aircraft first flown in 1900",
	"Category:Aircraft first flown in 1901",
	"Category:Aircraft first flown in 1903",
	"Category:Aircraft first flown in 1904",
	"Category:Aircraft first flown in 1905",
	"Category:Aircraft first flown in 1906",
	"Category:Aircraft first flown in 1907",
	"Category:Aircraft first flown in 1908",
	"Category:Aircraft first flown in 1909"
];
const categories = [
	"Category:Individual aircraft",
	"Category:Homebuilt aircraft",
	"Category:Unflown aircraft",
	...decade_1890,
	...decade_1900
];
for (let i = 1910; i <= latest_year; i++) {
	categories.push("Category:Aircraft first flown in " + i);
}

function get_random_title(year) {
	const params = {
		action: 'query',
		list: 'categorymembers',
		cmlimit: 500,
		format: 'json',
		cmtype: 'page',
		cmprop: 'title',
		origin: '*'
	};

	if (year) {
		year = year.toLowerCase();
		if (year.slice(-2) === "0s" || year.slice(-3) === "0's" || year.slice(-3) === "0\u2019s") {
			let decade = parseInt(year);
			if (decade === 1890) {
				params.cmtitle = decade_1890[Math.floor(Math.random() * decade_1890.length)];
			}
			else if (decade === 1900 || decade === 0) {
				params.cmtitle = decade_1900[Math.floor(Math.random() * decade_1900.length)];
			}
			else if (decade === latest_decade) {
				params.cmtitle = "Category:Aircraft first flown in " + 
				(Math.floor(Math.random() * (latest_year - latest_decade + 1)) + latest_decade);
			} 
			else {
				if (decade < 100) decade += 1900;
				params.cmtitle = "Category:Aircraft first flown in " + (Math.floor(Math.random() * 10) + decade);
			}
		} 
		else {
			params.cmtitle = "Category:Aircraft first flown in " + parseInt(year);
		}
	}
	else {
		params.cmtitle = categories[Math.floor(Math.random() * categories.length)];
	}

	const url = new URL("https://en.wikipedia.org/w/api.php");
	url.search = new URLSearchParams(params).toString();

	return fetch(url)
		.then(res => res.json())
		.then(data => {
			const articles = data.query.categorymembers;
			if (!articles.length) throw new Error("No articles found");
			return articles[Math.floor(Math.random() * articles.length)].title;
		});
}

function change_name(article_name) {
	if (article_name) {
		name.textContent = article_name.replaceAll("_", " ");
		name.href = "https://en.wikipedia.org/wiki/" + article_name.replaceAll(" ", "_");
	} 
	else {
		name.textContent = "No Article Found";
		name.removeAttribute('href');
	}
}

function get_content(title, retries_left) {
	const params = {
		action: 'query',
		prop: 'extracts|pageimages',
		piprop: 'thumbnail',
		pithumbsize: 800,
		pilicense: 'any',
		titles: title,
		format: 'json',
		formatversion: 2,
		exsentences: 2,
		exintro: 1,
		explaintext: 1,
		origin: '*'
	};

	const url = new URL("https://en.wikipedia.org/w/api.php");
	url.search = new URLSearchParams(params).toString();

	return fetch(url)
		.then(res => res.json())
		.then(data => {
			const page = data.query.pages[0];
			if (page.thumbnail) {
				// Wikipedia has an image
				change_name(title);
				image.onload = () => description.textContent = page.extract;
				image.src = page.thumbnail.source;
				return true;
			}
			// No Wikipedia image
			google_images_fallback(title);
		});
}

function google_images_fallback(title) {
	if (google_quota_exceeded) {
		console.log("Skipping Google fallback due to quota exceeded");
		return false;
	}

	console.log("Google fallback requested for", title);
	return fetch(`https://clayrobot.net:8000/backend/randomplanes?plane=${encodeURIComponent(title)}`)
		.then(res => res.json())
		.then(googleData => {
			if (googleData.error.code == 429) {
				google_quota_exceeded = true;
				throw new Error("Google quota exceeded");
			}

			const link = googleData.items[0].link;
			if (!link) throw new Error("No Google image found");

			return new Promise(resolve => {
				change_name(title + " (Image from Google)");
				image.onload = () => {
					description.textContent = page.extract;
					resolve(true);
				};
				image.onerror = () => {
					console.error("Google image failed to load:", link);
					resolve(false);
				};
				image.src = link;
			});
		})
		.catch(err => {
			console.error("Google fallback failed:", err);
			return false;
		});
}

function random_playne(year = year_input.value, retries_left = MAX_RETRIES) {
	get_random_title(year)
		.then(title => get_content(title, retries_left))
		.then(success => {
			if (!success && retries_left > 0) {
				console.log(`Retrying... ${retries_left} attempts left`);
				random_playne(year, retries_left - 1);
			} 
			else if (!success) {
				// Final failure
				change_name();
				image.src = "no_image.png";
				description.textContent = "";
			}
		})
		.catch(error => {
			console.error("Error fetching article:", error);
			change_name();
			image.src = "no_image.png";
			description.textContent = "";
		});
}