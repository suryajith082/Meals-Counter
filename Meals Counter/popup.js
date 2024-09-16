document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the stored username
  chrome.storage.local.get('name', (result) => {
    if (result.name) {
      showAlertForm();
    } else {
      showNameForm();
    }
  });

  // Retrieve the stored form submission data
  chrome.storage.local.get(['formSubmitted'], (result) => {
    if (result.formSubmitted) {
      console.log('Form was submitted on ' + result.formSubmitted.date);
    } else {
      console.log('Form has not been submitted yet.');
    }
  });
});

document.getElementById('nameForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  chrome.storage.local.set({ name }, () => {
    showAlertForm();
  });
});

document.getElementById('alertForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const meal = document.getElementById('meal').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const mood = document.getElementById('mood').value;
  const comments = document.getElementById('comments').value;

  // Retrieve the stored username
  chrome.storage.local.get('name', (result) => {
    const name = result.name;

    const data = { "name": name, "meal": meal, "startDate": startDate, "endDate": endDate, "mood": mood, "comments": comments };

    // Save data to Chrome storage
    chrome.storage.local.set({ formSubmitted: { date: new Date().toLocaleDateString(), data } }, () => {
      console.log('Form data saved locally');
    });

    // Send data to backend API
    fetch('http://127.0.0.1:8000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      displayResult(result);
    })
    .catch(error => {
      console.error('Error:', error);
      displayResult({ error: 'Failed to submit data' });
    });
  });
});

function showNameForm() {
  document.getElementById('nameForm').style.display = 'block';
  document.getElementById('alertForm').style.display = 'none';
  document.getElementById('title').textContent = 'Set Your Name';
}

function showAlertForm() {
  document.getElementById('nameForm').style.display = 'none';
  document.getElementById('alertForm').style.display = 'block';
  document.getElementById('title').textContent = 'Daily Alert Form';
}

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (result.error) {
    resultDiv.innerHTML = `<p style="color: red;">${result.error}</p>`;
  } else {
    resultDiv.innerHTML = `<p style="color: green;">Form submitted successfully!</p>`;
  }
}
