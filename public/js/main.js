$(document).ready(() => {
    $('.delete-recipe').on('click', function () {
        const id = $(this).data('id');
        const url = `/delete/${id}`;
        if (confirm('Delete Recipe?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: (result) => {
                    console.log('Deleting Recipe...');
                    window.location.href = '/'
                },
                error: (error) => console.log(error)
            })
        }
    })
    $('.edit-recipe').on('click', function () {
        $('#edit-form-name').val($(this).data('name').trim());
        $('#edit-form-id').val($(this).data('id'));
        $('#edit-form-directions').val($(this).data('directions'));
        $('#edit-form-ingredients').val($(this).data('ingredients'));

    })
})