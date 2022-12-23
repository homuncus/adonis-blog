// role onShow callbacks
$(() => {
  $('#role-modal').on('show.bs.modal', () => {
    $('#roleName').val('')
    $('#permissions_select input:checked').click()
  });

  $(document).on('click', '#create-role', (event) => {
    $('#role-modal #modal-title').text('Create role')
    $('#role-modal form')
      .attr({
        action: '/admin/roles'
      })
  })

  $(document).on('click', '.edit-role', (event) => {
    const url = `/admin/roles/${event.target.dataset.roleId}`
    $('#role-modal #modal-title').text('Edit role')
    $('#role-modal form')
      .attr({
        action: `${url}?_method=PATCH`
      });
    $.ajax({ url })
      .done((role) => {
        $('#roleName').val(role.name)
        role.permissions.forEach((permRole) => {
          $(`#permissions_select input[value="${permRole.permission_id}"]`).click()
        })
      })
      .fail(() => {
        alert('error')
      })
  });

  $(document).on('click', '.delete-role', (event) => {
    const url = `/admin/roles/${event.target.dataset.roleId}`
    $('#role-delete form')
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
