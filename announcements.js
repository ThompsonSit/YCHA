document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('announcementForm');

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
});
