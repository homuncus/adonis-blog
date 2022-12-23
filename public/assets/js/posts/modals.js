// post onShow callbacks
$(() => {
  $('#post-modal').on('show.bs.modal', () => {
    $('#postTitle').val('')
    $('#editor-full').text('')
    $('#post-modal form input[name="tags"]').val('')
  });

  $(document).on('click', '#create-post', (event) => {
    $('#post-modal #modal-title').text('Create post')
    $('#post-modal form')
      .attr({
        action: '/admin/roles'
      })
  })

  $(document).on('click', '.edit-post', (event) => {
    const url = `/admin/posts/${event.target.dataset.postId}`
    $('#post-modal #modal-title').html('Edit post')
    $('#post-modal form')
      .attr({
        action: `${url}?_method=PATCH`
      });
    $.ajax({ url })
      .done((post) => {
        $('#postTitle').val(post.title)
        $('#cke_1_contents iframe').contents()
          .find('body').html(post.text);
        $('#post-modal form input[name="tags"]')
          .val(post.tags ? JSON.stringify(post.tags) : '')
      })
      .fail(() => {
        alert('error')
      })
  });

  $(document).on('click', '.delete-post', (event) => {
    const url = `/admin/post/${event.target.dataset.roleId}`
    $('#post-delete form')
      .attr({
        action: `${url}?_method=DELETE`
      });
  });
})
