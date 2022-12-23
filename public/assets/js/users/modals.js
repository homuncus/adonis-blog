// user onShow callbacks
$(() => {
  $('#user-modal').on('show.bs.modal', () => {
    $('#userName').val('')
    $('#role-select option:selected').prop('selected', false)
    $('#user-registers').html('')
  });

  $(document).on('click', '#create-user', (event) => {
    $('#user-modal #modal-title').text('Create user')
    $('#user-modal form')
      .attr({
        action: '/admin/users'
      })
    $('#user-registers').html(`
      <div class="form-group">
        <label>Enter user e-mail:</label>
        <input type="email" name="email" class="form-control"
          placeholder="email@test.com" required>
      </div>
      <div class="form-group">
        <label>Enter user password:</label>
        <input type="password" name="password" class="form-control"
          placeholder="********" required>
      </div>
      <div class="form-group">
        <label>Confirm user password:</label>
        <input type="password" name="confirmPassword" class="form-control"
          placeholder="********" required>
      </div>
    `)
  })

  $(document).on('click', '.edit-user', (event) => {
    const url = `/admin/users/${event.target.dataset.userId}`
    $('#user-modal #modal-title').text('Edit user')
    $('#user-modal form')
      .attr({
        action: `${url}?_method=PATCH`
      });
    $.ajax({ url })
      .done((user) => {
        $('#userName').val(user.username)
        $(`#role-select option[value="${user.role.id}"]`)
          .prop('selected', true)
          .trigger('change')
      })
      .fail(() => {
        alert('error')
      })
  });

  $(document).on('click', '.delete-user', (event) => {
    const url = `/admin/users/${event.target.dataset.userId}`
    $('#user-delete form')
      .attr({
        action: `${url}?_method=DELETE`
      });
  });

  // Reacting to external value changes
  $('.select-all-permissions').click(() => {
    $('#permissions_select label input:not(:checked)').click()
  })

  $('.switch-off-all-permissions').click(() => {
    $('#permissions_select label input:checked').click()
  })
})
