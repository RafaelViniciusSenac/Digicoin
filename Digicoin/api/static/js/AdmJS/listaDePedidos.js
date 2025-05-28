function toggleItens(id) {
    const el = document.getElementById('itens-' + id);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}