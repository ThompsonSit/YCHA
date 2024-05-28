document.addEventListener('DOMContentLoaded', () => {
    const activityTableBody = document.getElementById('activityTableBody');

    function loadCSV() {
        fetch('user_data.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csv => {
                console.log('CSV loaded successfully');
                const data = parseCSV(csv);
                if (activityTableBody) {
                    activityTableBody.innerHTML = ''; // Clear existing table data
                    populateActivityTable(data);
                }
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    function populateActivityTable(data) {
        console.log('Populating activity table with data:', data); // Debugging statement
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.Username}</td>
                <td>${item.Phone}</td>
                <td>${item.UserActivities}</td>
                <td>
                    <button class="approve-button" onclick="approveActivity(this)">Approve</button>
                    <button class="disapprove-button" onclick="disapproveActivity(this)">Disapprove</button>
                </td>
            `;
            activityTableBody.appendChild(tr);
        });
    }

    function parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        const result = [];
        const headers = lines[0].split(',').map(header => header.trim());
        for (let i = 1; i < lines.length; i++) {
            const currentline = lines[i].split(',').map(value => value.trim());
            if (currentline.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
        }
        return result;
    }

    window.approveActivity = function(button) {
        const row = button.parentElement.parentElement;
        row.style.backgroundColor = 'lightgreen';
        // Here you can add code to handle approving the activity
    };

    window.disapproveActivity = function(button) {
        const row = button.parentElement.parentElement;
        row.style.backgroundColor = 'lightcoral';
        // Here you can add code to handle disapproving the activity
    };

    // Load initial CSV data on page load
    loadCSV();
});
