$('#users-table').DataTable({
  processing: true,
  serverSide: true,
  ajax: '/admin/users/data',
  columns: [
    { data: 'id', searchable: false },
    { data: 'username' },
    { data: 'email' },
    { data: 'name' },
    { data: 'creationDate', searchable: false, orderable: false },
    {
      orderable: false,
      searchable: false,
      render: (data, type, row) => {
        const markup = `
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-icon dropdown-toggle" data-toggle="dropdown">
              <i class="icon-menu7"></i> &nbsp;<span class="caret"></span>
            </button>

            <ul class="dropdown-menu dropdown-menu-right">
              <li><a class="edit-user" data-user-id="${row.id}" data-toggle="modal" data-target="#user-modal"><i class="icon-pencil3"></i> Edit</a></li>
              <li><a class="delete-user" data-user-id="${row.id}" data-toggle="modal" data-target="#user-delete"><i class="icon-trash"></i> Delete</a></li>
            </ul>
          </div>
        `;
        return markup
      }
    }
  ],
});
