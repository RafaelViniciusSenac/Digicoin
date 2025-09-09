document.addEventListener('DOMContentLoaded', function() {
    const sortIcons = document.querySelectorAll('.historico-compra-icone-sort');

    sortIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const isAsc = icon.classList.contains('historico-compra-sort-asc');
            if (isAsc) {
                icon.classList.remove('historico-compra-sort-asc');
                icon.classList.add('historico-compra-sort-desc');
            } else {
                icon.classList.remove('historico-compra-sort-desc');
                icon.classList.add('historico-compra-sort-asc');
            }
        });
    });
});
