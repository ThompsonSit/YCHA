document.addEventListener('DOMContentLoaded', () => {
    let userId = 1;
    let currentCSV = '';
    const userTableBody = document.getElementById('userTableBody');

    // Function to load CSV data from user_data.csv on page load
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
                currentCSV = csv;
                const data = parseCSV(csv);
                console.log('Parsed CSV data:', data); // Debugging statement
                userTableBody.innerHTML = ''; // Clear existing table data
                userId = 1; // Reset userId counter
                populateTable(data);
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    // Function to populate the table with user data
    function populateTable(data) {
        console.log('Populating table with data:', data); // Debugging statement
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${userId++}</td>
                <td contenteditable="true" class="edit-cell username-style">${item.Username}</td>
                <td contenteditable="true" class="edit-cell">${item.Password}</td>
                <td contenteditable="true" class="edit-cell">${item.UserAddress}</td>
                <td contenteditable="true" class="edit-cell">${item.Phone}</td>
                <td contenteditable="true" class="edit-cell">${item.UserActivities}</td>
                <td contenteditable="true" class="edit-cell">${item.UserStatus}</td>
                <td contenteditable="true" class="edit-cell">${item.Gender}</td>
                <td contenteditable="true" class="edit-cell">${item.Remarks}</td>
                <td><button class="delete-button" onclick="deleteUser(this)">Delete</button></td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    // Function to import CSV data from a file
    window.importCSV = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            currentCSV = e.target.result;
            const data = parseCSV(currentCSV);
            console.log('Imported CSV data:', data); // Debugging statement
            userTableBody.innerHTML = ''; // Clear existing table data
            userId = 1; // Reset userId counter
            populateTable(data);
        };
        reader.readAsText(file);
    };

    // Function to parse CSV data
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

    // Function to export CSV data from the table
    window.exportCSV = function() {
        const rows = Array.from(userTableBody.getElementsByTagName('tr'));
        const csvData = rows.map(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            return cells.slice(1, cells.length - 1).map(cell => cell.textContent).join(',');
        }).join('\n');

        const csvContent = `ID,Username,Password,UserAddress,Phone,UserActivities,UserStatus,Gender,Remarks\n${csvData}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Function to save edits to the current CSV file
    window.saveCSV = function() {
        const rows = Array.from(userTableBody.getElementsByTagName('tr'));
        const csvData = rows.map(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            return cells.slice(1, cells.length - 1).map(cell => cell.textContent).join(',');
        }).join('\n');

        const csvContent = `ID,Username,Password,UserAddress,Phone,UserActivities,UserStatus,Gender,Remarks\n${csvData}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Function to add a new row
    window.addRow = function() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userId++}</td>
            <td contenteditable="true" class="edit-cell username-style"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td contenteditable="true" class="edit-cell"></td>
            <td><button class="delete-button" onclick="deleteUser(this)">Delete</button></td>
        `;
        userTableBody.appendChild(row);
    };

    // Function to delete a user row
    window.deleteUser = function(button) {
        const row = button.parentElement.parentElement;
        userTableBody.removeChild(row);
    };

    // Load initial CSV data on page load
    loadCSV();
});
