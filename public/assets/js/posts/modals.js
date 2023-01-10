/* eslint-disable no-undef */
// post onShow callbacks
$(() => {
  $('#post-modal').on('show.bs.modal', () => {
    $('#postTitle').val('')
    $('#editor').text('')
    $('#post-modal form input[name="tags"]').val('')
  });

  $(document).on('click', '#create-post', (event) => {
    $('#post-modal #modal-title').text(transl.titles.create)
    $('#post-modal form')
      .attr({
        action: '/admin/posts'
      })
  })

  $(document).on('click', '.edit-post', (event) => {
    const url = `/admin/posts/${event.target.dataset.postId}`
    $('#post-modal #modal-title').html(transl.titles.edit)
    $('#post-modal form')
      .attr({
        action: `${url}?_method=PATCH`
      });
    $.ajax({ url })
      .done((post) => {
        locales.forEach((locale, ind) => {
          const currPost = post.translations.find((translation) => translation.locale === locale)
          if (!currPost) return
          $(`#${locale} #postTitle`).val(currPost.title)
          $(`#${locale} #cke_${ind + 1}_contents iframe`).contents()
            .find('body').html(currPost.text);
        })
        $('#post-modal form input[name="tags"]')
          .val(post.tags ? JSON.stringify(post.tags) : '')
      })
      .fail(() => {
        alert('error')
      })
  });

  $(document).on('click', '.delete-post', (event) => {
    const url = `/admin/post/${event.target.dataset.postId}`
    $('#post-delete form')
      .attr({
        action: `${url}?_method=DELETE`
      });
  });
})
