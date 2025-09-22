import { data } from '../Data/data.js';

const select = document.getElementById("Section_Batch");
const subject = document.getElementById('subject');
const popup = document.getElementById('popup');
const swh = document.getElementById('switch');
const copy = document.querySelector("#copy");
const nameButton = document.querySelector('.toggle-names-switch-button');
let section = select.value;
let AI = true;
let str; // declared as global for whatsapp API accessK

generate();

select.addEventListener('change', function () {
	section = select.value;
	document.getElementById("section").innerText = select.options[select.selectedIndex].text;
	document.getElementById('display').value = '';
	document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
	subject.value = '';
	document.getElementById('switch').checked = false;
	document.getElementById('popup').style.display = 'none';
	AI = section === 'AI';
	if (section === 'PBT' || section === 'SBT') {
		subject.value = 'Training and Placement';
	}
	generate();
})

subject.addEventListener("change", function () {
	if (subject.value === 'other')
		popup.style.display = 'block';
	else {
		popup.style.display = 'none';
		document.getElementById('other').value = '';
	}
	display();
})

swh.addEventListener("change", function () {
	generate();
});

function generate() {
	var parent = document.querySelector(".data");
	let content = "";
	parent.innerHTML = "";
	for (let one of data) {
		if (AI || one.Section == section) {
			const attendanceClass = swh.checked ? "red" : "green";
			const attendanceText = swh.checked ? "Absent" : "Present";

			content += `
            <div class="tab">
                <p><span>Roll Number :</span>${one.Id}</p>
                <p><span>Name :</span>${one.Name}</p>
                <div class="Attendance ${attendanceClass}" id="${one.Id}" name="${one.Name}" is-present="${!swh.checked}">
                    <p>${attendanceText}</p>
                </div>
            </div>
        `;
		}
	}
	parent.innerHTML = content;

	display();
	const tabs = document.querySelectorAll(".Attendance");
	tabs.forEach((tab) => {
		tab.addEventListener("click", function () {
			const isPresent = tab.getAttribute("is-present") === "true";
			const text = isPresent ? "Absent" : "Present";
			tab.classList.toggle("green", !isPresent);
			tab.classList.toggle("red", isPresent);
			tab.setAttribute("is-present", String(!isPresent));
			tab.innerHTML = `<p>${text}</p>`;
			display();
		});
	});
}

nameButton.addEventListener('change', () => {
	display();
})

// Function Display()

function display() {
	str = '';
	let str1 = '';
	let str2 = '';
	let count1 = 0;
	let count2 = 0;
	let subject;

	const present = document.querySelectorAll('.Attendance');
	for (let one of present) {
		let isPresent = one.getAttribute('is-present') === 'true';
		const rollNo = one.id.substring(0, 3);
		const rollNo2 = one.id.substring(4, 5); // Extract the first three characters of the ID
		const name = one.getAttribute('name');
		const haveName = nameButton.checked;
		// Adjust entry format based on roll number prefix
		let entry;
		if (rollNo === '239' && rollNo2 === '1') {
			entry = `${one.id.substring(8, 10)}${haveName ? ` - ${name}` : ''}`;
		} else if (rollNo === '229') {
			entry = `22-${one.id.substring(8, 10)}${haveName ? ` - ${name}` : ''}`;
		} else if (rollNo === '239' && rollNo2 === '5') {
			entry = `23LE-${one.id.substring(8, 10)}${haveName ? ` - ${name}` : ''}`;
		} else {
			entry = `LE${one.id.substring(8, 10)}${haveName ? ` - ${name}` : ''}`;
		}
		if(one.id === "23911A35B7" && isPresent == false){
			isPresent = !isPresent;
			//console.log("We Won");
		}
		if (isPresent) {
			str1 += `${entry}, `;
			count1++;
		} else {
			str2 += `${entry}, `;
			count2++;
		}
	}
	
	
	str1 = str1.slice(0, -2);
	str2 = str2.slice(0, -2);

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const currentDate = new Date().toLocaleDateString('en-US', options);

	str += `${document.getElementById('section').innerText} ( III year ) Attendance \n`;

    str += `Presentees (${count1} Member${count1 === 1 ? '' : 's'})\n`;
    str += `${str1}\n\n`;

    str += `Absentees (${count2} Member${count2 === 1 ? '' : 's'})\n`;
    str += `${str2}\n`;

    const select = document.getElementById('subject');
    subject = select.value;

    select.addEventListener('change', ( ) => {
        subject = select.value;
    });

    if (subject === 'other') {
        subject = document.getElementById('other').value;
    }

    str += `in ${subject} on ${currentDate}\n`;

    document.getElementById('display').value = str;

    // Display border color 
    const displayElement = document.getElementById('display');
    switch (true) {
        case (count1 > count2):
            displayElement.style.borderColor = 'lightgreen';
            break;
        case (count1 < count2):
            displayElement.style.borderColor = '#ff5c5c';
            break;
        case (count1 === 0):
            displayElement.style.borderColor = 'rgb(165, 165, 165)';
            break;
        default:
            displayElement.style.borderColor = '#f6f672';
            break;
    }
}

// Whatsapp Message sender Function

document.querySelector(".Whatsapp").addEventListener('click', function () {
	var message = encodeURIComponent(str);
	window.open(`whatsapp://send?text=${message}`);
})

// Copy Function

copy.addEventListener('click', async () => {
	const input = document.querySelector("#display");
	await navigator.clipboard.writeText(input.value);

	copy.classList.add("active");

	setTimeout(() => {
		copy.classList.remove("active");
	}, 2000);
});


// Reset Function

document.getElementById("reset").addEventListener('click', function () {
	const present = document.querySelectorAll('.Attendance');
	const switchStatus = document.getElementById('switch').checked;
	for (let one of present) {
		if (switchStatus == false) {
			one.setAttribute("is-present", 'true');
			one.classList = "Attendance green";
			one.lastChild.innerHTML = "Present";
		} else {
			one.setAttribute("is-present", 'false');
			one.classList = "Attendance red";
			one.lastChild.innerHTML = "Absent";
		}
	}
	document.getElementById('display').value = '';
	document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
	document.getElementById('switch').checked = switchStatus;
	document.getElementById('popup').style.display = 'none';
	nameButton.checked = false;
	display();
});
