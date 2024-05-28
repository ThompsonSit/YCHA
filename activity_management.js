document.addEventListener('DOMContentLoaded', () => {
    const activityForm = document.getElementById('activityForm');
    const activityTableBody = document.getElementById('activityTableBody');
    let activityIDCounter = 6; // Start counter after existing activities

    function loadActivitiesCSV() {
        fetch('activities.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csv => {
                console.log('CSV loaded successfully');
                const data = parseCSV(csv);
                console.log('Parsed CSV data:', data); // Debugging statement
                activityTableBody.innerHTML = ''; // Clear existing table data
                populateActivityTable(data);
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    function populateActivityTable(data) {
        console.log('Populating activity table with data:', data); // Debugging statement
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.ActivityID}</td>
                <td>${item.Date}</td>
                <td>${item.Time}</td>
                <td>${item.Duration}</td>
                <td>${item.Fee}</td>
                <td>${item.MaxVisitors}</td>
                <td><img src="${item.Image}" alt="Activity Image" style="max-width: 50px;"></td>
                <td>
                    <button class="preview-button" onclick="previewActivity('${item.ActivityID}', '${item.Date}', '${item.Time}', '${item.Duration}', '${item.Fee}', '${item.MaxVisitors}', '${item.Image}')">Preview</button>
                </td>
            `;
            activityTableBody.appendChild(tr);
        });
    }

    function parseCSV(csv) {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        if (parsed.errors.length > 0) {
            console.error('Error parsing CSV:', parsed.errors);
        }
        return parsed.data;
    }

    activityForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const activityID = `Activity${activityIDCounter++}`;
        const activityDate = document.getElementById('activityDate').value;
        const activityTime = document.getElementById('activityTime').value;
        const activityDuration = document.getElementById('activityDuration').value;
        const activityFee = document.getElementById('activityFee').value;
        const activityMaxVisitors = document.getElementById('activityMaxVisitors').value;
        const activityImage = document.getElementById('activityImage').files[0];

        if (activityImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const activityData = {
                    ActivityID: activityID,
                    Date: activityDate,
                    Time: activityTime,
                    Duration: activityDuration,
                    Fee: activityFee,
                    MaxVisitors: activityMaxVisitors,
                    Image: e.target.result
                };

                // Add the new activity to the table
                addActivityToTable(activityData);

                // Save the new activity to the CSV file
                saveActivityToCSV(activityData);
            };
            reader.readAsDataURL(activityImage);
        } else {
            alert('Please upload an image');
        }
    });

    function addActivityToTable(activityData) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${activityData.ActivityID}</td>
            <td>${activityData.Date}</td>
            <td>${activityData.Time}</td>
            <td>${activityData.Duration}</td>
            <td>${activityData.Fee}</td>
            <td>${activityData.MaxVisitors}</td>
            <td><img src="${activityData.Image}" alt="Activity Image" style="max-width: 50px;"></td>
            <td>
                <button class="preview-button" onclick="previewActivity('${activityData.ActivityID}', '${activityData.Date}', '${activityData.Time}', '${activityData.Duration}', '${activityData.Fee}', '${activityData.MaxVisitors}', '${activityData.Image}')">Preview</button>
            </td>
        `;
        activityTableBody.appendChild(tr);
    }

    function saveActivityToCSV(activityData) {
        const csvRow = `${activityData.ActivityID},${activityData.Date},${activityData.Time},${activityData.Duration},${activityData.Fee},${activityData.MaxVisitors},${activityData.Image}\n`;
        fetch('save_activities.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + encodeURIComponent(csvRow)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Activity saved to CSV');
        }).catch(error => console.error('Error saving to CSV:', error));
    }

    window.previewActivity = function(activityID, date, time, duration, fee, maxVisitors, image) {
        alert(`Activity ID: ${activityID}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hours\nFee: $${fee}\nMax Visitors: ${maxVisitors}\nImage: ${image}`);
    };

    window.importActivities = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const csv = e.target.result;
                console.log('Imported CSV data:', csv); // Debugging statement
                const data = parseCSV(csv);
                console.log('Parsed imported CSV data:', data); // Debugging statement
                activityTableBody.innerHTML = ''; // Clear existing table data
                populateActivityTable(data);
            };
            reader.readAsText(file);
        };
        input.click();
    };

    window.exportActivities = function() {
        const rows = Array.from(activityTableBody.getElementsByTagName('tr'));
        const csvData = rows.map(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            const imgSrc = cells[6].querySelector('img').src;
            return `${cells[0].textContent},${cells[1].textContent},${cells[2].textContent},${cells[3].textContent},${cells[4].textContent},${cells[5].textContent},${imgSrc}`;
        }).join('\n');

        const csvContent = `ActivityID,Date,Time,Duration,Fee,MaxVisitors,Image\n${csvData}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activities.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Load initial CSV data on page load
    loadActivitiesCSV();
});
