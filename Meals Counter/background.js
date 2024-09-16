function createDailyAlarm() {
  const now = new Date();
  const next3PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 10, 0, 0);
  console.log(now.getTime())
  console.log(next3PM.getTime())
  // if (now > next3PM) next3PM.setDate(next3PM.getDate() + 1);
  console.log(next3PM.getTime())
  chrome.alarms.create('dailyAlarm', {
    delayInMinutes: 1,
    periodInMinutes: 1
  });
}

chrome.runtime.onInstalled.addListener(() => {
  createDailyAlarm();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyAlarm') {
    notifyUser();
  }
});

function notifyUser() {
  const now = new Date();
  const currentHour = now.getHours();
  chrome.storage.local.get(['formSubmitted', 'name'], (result) => {
    if (!result.name) {
      return; // Do not notify if the name is not set
    }

    if (result.formSubmitted && result.formSubmitted.date === new Date().toLocaleDateString()) {
      return; // Do not notify if form already submitted today
    }

    if (currentHour >= 15 || currentHour < 7) {
      chrome.notifications.create('dailyAlert', {
        type: 'basic',
        iconUrl: 'images/pngtree-english-breakfast-featured-fried-eggs-sausages-soybeans-and-tomatoes-png-image_788332.jpg',
        title: 'Daily Form Alert',
        message: 'Please fill out the daily form!'
      });
    }
  });
}
