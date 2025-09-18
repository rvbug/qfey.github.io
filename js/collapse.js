document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Quarto to finish rendering
    setTimeout(function() {
        const sections = document.querySelectorAll('.quarto-sidebar-section');
        sections.forEach(section => {
            const container = section.querySelector('.quarto-sidebar-section-container');
            if (container) {
                container.style.display = 'none';
                section.classList.remove('expanded');
                section.classList.add('collapsed');
            }
        });
    }, 100);
});