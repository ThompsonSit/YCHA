document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('announcementForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const announcementType = document.getElementById('announcementType').value;
            const announcementContent = document.getElementById('announcementContent').value;
            const announcementImage = document.getElementById('announcementImage').files[0];

            if (announcementImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const announcementData = {
                        type: announcementType,
                        content: announcementContent,
                        image: e.target.result
                    };

                    // Store the data in localStorage
                    localStorage.setItem('announcementData', JSON.stringify(announcementData));

                    // Redirect to announcement approval page
                    window.location.href = 'announcement_approval.html';
                };
                reader.readAsDataURL(announcementImage);
            } else {
                alert('Please upload an image');
            }
        });
    }

    const announcementPreview = document.getElementById('announcementPreview');

    if (announcementPreview) {
        const announcementData = JSON.parse(localStorage.getItem('announcementData'));

        if (announcementData) {
            announcementPreview.innerHTML = `
                <h3>Type: ${announcementData.type}</h3>
                <p>${announcementData.content}</p>
                <img src="${announcementData.image}" alt="Announcement Image" style="max-width: 100%;">
            `;
        }
    }
});

function publishAnnouncement() {
    alert('Announcement Published');
    localStorage.removeItem('announcementData');
    // Here you can add code to handle publishing the announcement
}

function holdAnnouncement() {
    alert('Announcement Put on Hold');
    localStorage.removeItem('announcementData');
    // Here you can add code to handle putting the announcement on hold
}
